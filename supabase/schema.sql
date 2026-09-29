-- Community Help Board - skema database
-- Jalanin sekali di Supabase Dashboard > SQL Editor > New query > Run.
-- Aman diulang: semua pakai "if not exists" / "drop policy if exists".

-- ---------------------------------------------------------------------------
-- 1. profiles
-- ---------------------------------------------------------------------------
-- auth.users itu tabel bawaan Supabase dan nggak boleh dibaca anon key.
-- Supaya nama pemosting bisa tampil di papan, datanya dicerminkan ke sini.

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nama       text not null check (char_length(nama) between 1 and 60),
  created_at timestamptz not null default now()
);

-- Profil dibuat otomatis begitu user daftar, termasuk yang lewat Google.
-- Kalau dibuat dari sisi aplikasi, user yang daftar tapi keburu nutup tab
-- bakal punya akun tanpa profil.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nama)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'nama'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. help_requests
-- ---------------------------------------------------------------------------
-- user_id/helper_id nunjuk ke profiles (bukan auth.users) supaya nama pemilik
-- dan penolong bisa ikut sekali jalan lewat embed PostgREST, tanpa query susulan.

create table if not exists public.help_requests (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(trim(title)) between 5 and 120),
  description text not null check (char_length(trim(description)) between 10 and 1000),
  category    text not null check (category in ('medis', 'sembako', 'alat', 'relawan')),
  location    text not null check (char_length(trim(location)) between 3 and 120),
  -- Opsional: cuma keisi kalau pemosting milih lokasi lewat peta di form.
  -- Permintaan yang lokasinya diketik manual nilainya tetap null, dan itu sah.
  latitude    double precision,
  longitude   double precision,
  status      text not null default 'menunggu' check (status in ('menunggu', 'selesai')),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  helper_id   uuid references public.profiles(id) on delete set null,
  helped_at   timestamptz,
  created_at  timestamptz not null default now(),

  -- Status selesai tanpa penolong itu data setengah jadi. Dijaga di database,
  -- bukan cuma di form, karena database yang jadi sumber kebenarannya.
  constraint penolong_sejalan_dengan_status check (
    (status = 'menunggu' and helper_id is null and helped_at is null)
    or (status = 'selesai' and helper_id is not null and helped_at is not null)
  ),
  constraint tidak_bantu_diri_sendiri check (helper_id is null or helper_id <> user_id),

  -- Kedua kolom harus sama-sama kosong atau sama-sama keisi, dan kalau keisi
  -- harus koordinat yang valid secara geografis.
  constraint koordinat_sejalan check (
    (latitude is null and longitude is null)
    or (latitude between -90 and 90 and longitude between -180 and 180)
  )
);

-- Feed selalu difilter status/kategori lalu diurut terbaru, jadi kolom itu
-- yang diindeks. "Bantuan Saya" jalannya lewat user_id.
create index if not exists help_requests_created_idx on public.help_requests (created_at desc);
create index if not exists help_requests_status_created_idx on public.help_requests (status, created_at desc);
create index if not exists help_requests_category_created_idx on public.help_requests (category, created_at desc);
create index if not exists help_requests_user_idx on public.help_requests (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------------
-- RLS dinyalain, bukan dimatiin. Anon key itu publik (kebundel ke JS browser),
-- jadi kebijakan di bawah inilah satu-satunya yang beneran ngejaga data.

alter table public.profiles enable row level security;
alter table public.help_requests enable row level security;

-- profiles: nama boleh dibaca siapa saja (dipajang di papan), tapi cuma
-- pemiliknya yang boleh nulis. Email nggak pernah ikut ke tabel ini.
drop policy if exists "profil bisa dibaca siapa saja" on public.profiles;
create policy "profil bisa dibaca siapa saja"
  on public.profiles for select
  using (true);

drop policy if exists "user bikin profil sendiri" on public.profiles;
create policy "user bikin profil sendiri"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "user ubah profil sendiri" on public.profiles;
create policy "user ubah profil sendiri"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- help_requests: papan pengumuman, jadi isinya memang buat dilihat umum.
drop policy if exists "papan bisa dibaca siapa saja" on public.help_requests;
create policy "papan bisa dibaca siapa saja"
  on public.help_requests for select
  using (true);

-- Nempel user_id ke orang lain ditolak di sini, bukan cuma di form.
drop policy if exists "warga posting atas nama sendiri" on public.help_requests;
create policy "warga posting atas nama sendiri"
  on public.help_requests for insert
  to authenticated
  with check (auth.uid() = user_id and status = 'menunggu');

drop policy if exists "pemilik ubah postingannya" on public.help_requests;
create policy "pemilik ubah postingannya"
  on public.help_requests for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "pemilik hapus postingannya" on public.help_requests;
create policy "pemilik hapus postingannya"
  on public.help_requests for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. Aksi "Saya Ingin Membantu"
-- ---------------------------------------------------------------------------
-- Relawan perlu ngubah postingan orang lain, tapi cuma satu kolom: status.
-- Kebijakan UPDATE nggak bisa ngunci per-kolom, jadi aksinya dibungkus fungsi
-- ini dan nggak ada policy UPDATE buat orang lain sama sekali.
--
-- Syaratnya ditaruh di WHERE, bukan di IF sebelumnya. Bedanya kelihatan pas
-- dua relawan mencet tombol barengan: yang kedua nggak nemu baris berstatus
-- "menunggu" lagi, jadi kalah dengan sopan alih-alih nimpa penolong pertama.

create or replace function public.tandai_selesai(bantuan_id uuid)
returns public.help_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  hasil public.help_requests;
begin
  if auth.uid() is null then
    raise exception 'Login dulu sebelum menawarkan bantuan.' using errcode = '42501';
  end if;

  update public.help_requests
     set status    = 'selesai',
         helper_id = auth.uid(),
         helped_at = now()
   where id = bantuan_id
     and status = 'menunggu'
     and user_id <> auth.uid()
  returning * into hasil;

  if not found then
    raise exception 'Permintaan ini sudah ditangani orang lain, atau ini postinganmu sendiri.'
      using errcode = 'P0001';
  end if;

  return hasil;
end;
$$;

revoke all on function public.tandai_selesai(uuid) from public, anon;
grant execute on function public.tandai_selesai(uuid) to authenticated;
