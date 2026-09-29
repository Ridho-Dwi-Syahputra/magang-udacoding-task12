-- Data dummy buat ngisi papan biar nggak kosong pas demo/screenshot.
-- Jalanin SETELAH schema.sql dan setelah minimal 1 akun didaftarin lewat
-- halaman /register (baris di bawah nyantol ke profil yang sudah ada).

do $$
declare
  warga_a uuid;
  warga_b uuid;
begin
  select id into warga_a from public.profiles order by created_at limit 1;
  select id into warga_b from public.profiles order by created_at offset 1 limit 1;

  if warga_a is null then
    raise exception 'Belum ada akun. Daftar dulu lewat /register, baru jalanin file ini.';
  end if;

  -- Koordinatnya perkiraan kasar per kecamatan buat kebutuhan demo peta,
  -- bukan hasil survei presisi -- cukup buat nunjukkin pin-nya nempel di
  -- Kota Padang, jangan dipakai sebagai alamat akurat.
  insert into public.help_requests
    (title, description, category, location, latitude, longitude, user_id, created_at)
  values
    ('Butuh pendonor darah O+ untuk operasi besok',
     'Ibu saya dijadwalkan operasi hari Rabu pagi di RSUP M. Djamil dan stok darah O+ di PMI sedang kosong. Butuh 2 kantong. Biaya transport pendonor kami ganti.',
     'medis', 'RT 03 / RW 05, Kel. Jati, Padang', -0.9390, 100.3720, warga_a, now() - interval '2 hours'),

    ('Pinjam kursi roda untuk seminggu',
     'Bapak baru jatuh di kamar mandi dan belum bisa jalan jauh. Kalau ada warga yang punya kursi roda nganggur, boleh dipinjam sekitar seminggu. Dijemput sendiri.',
     'alat', 'Komplek Griya Insani Blok C, Kuranji', -0.9010, 100.4010, warga_a, now() - interval '9 hours'),

    ('Bantuan sembako untuk keluarga Pak Yanto',
     'Pak Yanto baru kena PHK dan punya tiga anak yang masih sekolah. Warga yang mau nyumbang beras, minyak, atau telur bisa titip ke pos ronda RT 02.',
     'sembako', 'Pos Ronda RT 02, Kel. Surau Gadang', -0.9250, 100.3700, warga_a, now() - interval '1 day'),

    ('Cari 5 relawan untuk gotong royong bersihkan drainase',
     'Drainase depan musala mampet dan tiap hujan air masuk ke rumah warga. Rencana kerja bakti Minggu pagi jam 7. Alat disediakan, konsumsi ditanggung RT.',
     'relawan', 'Musala Al-Ikhlas, RW 04, Nanggalo', -0.9210, 100.3730, warga_a, now() - interval '2 days'),

    -- Ini sengaja tanpa koordinat: contoh permintaan yang lokasinya diisi
    -- manual (tanpa peta), biar kelihatan halaman detail tetap wajar tanpa mini-peta.
    ('Pinjam tenda dan kursi untuk pengajian',
     'Butuh 1 tenda ukuran 4x6 dan sekitar 30 kursi plastik untuk pengajian 40 hari, Sabtu malam. Dibongkar pasang sendiri.',
     'alat', 'Jl. Gajah Mada No. 21, Padang Utara', null, null, coalesce(warga_b, warga_a), now() - interval '3 days')
  on conflict do nothing;

  -- Satu contoh yang sudah kelar, biar badge "Selesai" ada isinya pas demo.
  if warga_b is not null then
    insert into public.help_requests
      (title, description, category, location, latitude, longitude, status, user_id, helper_id, helped_at, created_at)
    values
      ('Butuh tabung oksigen portabel',
       'Kakek sesak napas sejak semalam dan belum dapat rujukan rumah sakit. Sudah dibantu warga sebelah, terima kasih banyak.',
       'medis', 'RT 01 / RW 02, Kel. Alai Parak Kopi', -0.9200, 100.3620, 'selesai',
       warga_a, warga_b, now() - interval '4 days', now() - interval '5 days')
    on conflict do nothing;
  end if;
end $$;
