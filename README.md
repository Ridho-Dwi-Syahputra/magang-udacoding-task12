# Papan Bantuan Warga

Papan pengumuman digital buat warga satu lingkungan. Siapa pun bisa menempel permintaan bantuan (donor darah, sembako, pinjam kursi roda, cari tenaga relawan), dan tetangga yang sanggup tinggal menekan satu tombol untuk mengangkat tangan.

Dibangun dengan Next.js App Router, Tailwind CSS, dan Supabase (Auth + Postgres).

## Fitur

- Daftar/masuk pakai email & kata sandi, plus opsi masuk dengan Google.
- Papan bantuan yang bisa disaring per kategori; yang masih menunggu naik ke atas sendiri.
- Form "Minta Bantuan" dengan validasi di server dan pesan error nempel di field-nya.
- Halaman detail dengan tombol "Saya Ingin Membantu" yang mengubah status jadi selesai.
- Halaman "Bantuan Saya": riwayat permintaan sendiri, lengkap dengan hapus (pakai konfirmasi).
- Responsif: sidebar tetap di kiri pada layar lebar, berubah jadi laci lewat tombol Menu di HP.
- Skeleton saat memuat, layar kosong ber-ajakan, layar error dengan tombol coba lagi, dan penanda saat koneksi putus.

## Kategori & status

Empat kategori: **Medis & Darurat**, **Sembako**, **Peminjaman Alat**, dan **Tenaga Relawan**. Tampilannya sengaja satu warna (coklat) dengan netral hangat, dan kategori dibedakan lewat tulisan, bukan warna.

Statusnya dua: **Menunggu** dan **Selesai**. Sebuah permintaan pindah ke Selesai begitu ada warga lain yang menekan tombol bantu.

## Cara menjalankan

### 1. Siapkan proyek Supabase

Bikin proyek baru di [supabase.com](https://supabase.com), lalu:

1. Buka **SQL Editor > New query**, tempel isi [`supabase/schema.sql`](supabase/schema.sql), jalankan. Ini membuat tabel `profiles` dan `help_requests`, indeks, trigger pembuat profil, kebijakan RLS, dan fungsi `tandai_selesai`.
2. Buka **Authentication > Sign In / Providers**, pastikan **Email** aktif. Untuk demo, matikan **Confirm email** supaya akun baru langsung bisa dipakai tanpa menunggu email masuk.
3. (Opsional) Nyalakan provider **Google** kalau mau tombol "Masuk dengan Google" jalan. Tambahkan `https://<domain-kamu>/auth/callback` dan `http://localhost:3000/auth/callback` ke daftar **Redirect URLs** di **Authentication > URL Configuration**.

### 2. Isi environment variable

```bash
cp .env.local.example .env.local
```

Isi dua nilainya dari **Project Settings**: `NEXT_PUBLIC_SUPABASE_URL` dari bagian *Data API*, `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari bagian *API Keys* (ambil yang **anon public**, bukan `service_role`).

### 3. Jalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000, daftar satu akun lewat `/register`.

### 4. Isi data dummy (opsional)

Setelah punya minimal satu akun, jalankan [`supabase/seed.sql`](supabase/seed.sql) di SQL Editor. Kalau mau mencoba alur "dibantu orang lain", daftarkan dua akun dulu baru jalankan file ini.

## Struktur folder

```
src/
├── app/
│   ├── page.tsx                 beranda + hero
│   ├── bantuan/                 papan bantuan (feed + filter) & detail
│   ├── bantuan-saya/            riwayat permintaan sendiri
│   ├── minta-bantuan/           form posting
│   ├── login/ register/         halaman auth
│   ├── auth/callback/           penukaran kode OAuth jadi sesi
│   └── error.tsx not-found.tsx  layar error & 404
├── components/
│   ├── ui/                      tombol, field, badge, skeleton
│   └── features/                kartu, filter, form, tombol aksi
├── lib/
│   ├── actions/                 server action: auth & CRUD bantuan
│   ├── supabase/                klien server & browser
│   └── constants.ts types.ts    kategori, status, bentuk data
└── proxy.ts                     refresh sesi + penjaga rute privat
```

## Beberapa keputusan teknis

**Server dulu, client kalau perlu.** Halaman papan, detail, dan riwayat semuanya Server Component: datanya diambil di server, browser terima HTML yang sudah jadi. Yang jadi Client Component cuma daun yang memang butuh interaksi, seperti tombol bantu, tombol hapus, form, dan sidebar (yang perlu tahu halaman aktif).

**Filter kategori lewat URL, bukan state.** Tombol filternya `<Link>` biasa, jadi pilihan kategori ikut di alamat (bisa di-share, tombol back jalan) dan nol JavaScript tambahan.

**Token di cookie, bukan localStorage.** Sesi diurus `@supabase/ssr` lewat cookie httpOnly. Token yang disimpan di localStorage kebaca XSS mana pun.

**RLS dinyalakan, bukan dimatikan.** Anon key itu publik karena ikut kebundel ke JavaScript browser, jadi kebijakan RLS di `schema.sql` inilah yang sebenarnya menjaga data. `proxy.ts` yang menendang tamu dari halaman privat cuma penjaga UX, bukan keamanan.

**Aksi "Saya Ingin Membantu" lewat fungsi database.** Kebijakan UPDATE tidak bisa mengunci per-kolom, jadi kalau relawan diberi izin UPDATE langsung, dia juga bisa mengubah judul dan isi postingan orang. Aksinya dibungkus fungsi `tandai_selesai` yang cuma menyentuh kolom status. Syaratnya ditaruh di `WHERE`, bukan di `IF` sebelumnya, supaya dua relawan yang menekan tombol bersamaan tidak saling menimpa.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di Vercel: **Add New > Project**, pilih repo-nya.
3. Isi dua environment variable yang sama seperti di `.env.local`.
4. Deploy, lalu tambahkan `https://<domain-vercel>/auth/callback` ke Redirect URLs di Supabase.
