# Community Help Board

Papan pengumuman digital buat warga satu lingkungan. Siapa pun bisa menempel permintaan bantuan (donor darah, sembako, pinjam kursi roda, cari tenaga relawan), dan tetangga yang sanggup tinggal menekan satu tombol untuk mengangkat tangan.

Dibangun dengan Next.js App Router, Tailwind CSS, dan Supabase (Auth + Postgres).

## Fitur

- Landing page publik dengan hero dua kolom (teks + ilustrasi), nav ke Beranda/Papan Bantuan, dan pratinjau tiga permintaan terbaru asli -- bisa dilihat siapa saja tanpa akun. Masuk cuma diminta begitu mau menempel permintaan atau menawarkan bantuan.
- Daftar/masuk pakai email & kata sandi, plus opsi masuk dengan Google.
- Papan bantuan yang bisa disaring per kategori; yang masih menunggu naik ke atas sendiri.
- Form "Minta Bantuan" dengan validasi di server dan pesan error nempel di field-nya. Lokasinya bisa diketik manual atau dipilih lewat peta (klik/geser pin, cari alamat, atau pakai GPS).
- Halaman detail dengan tombol "Saya Ingin Membantu" yang mengubah status jadi selesai. Kalau lokasinya dipilih lewat peta, halaman detail nampilin mini-peta dengan pin di titik itu.
- Halaman "Bantuan Saya": riwayat permintaan sendiri, lengkap dengan hapus (pakai konfirmasi).
- Responsif: sidebar tetap di kiri pada layar lebar, berubah jadi laci lewat tombol Menu di HP.
- Skeleton saat memuat, layar kosong ber-ajakan, layar error dengan tombol coba lagi, dan penanda saat koneksi putus.

## Kategori & status

Empat kategori: **Medis & Darurat**, **Sembako**, **Peminjaman Alat**, dan **Tenaga Relawan**. Tampilannya sengaja satu warna (coklat) dengan netral hangat, dan kategori dibedakan lewat tulisan, bukan warna.

Statusnya dua: **Menunggu** dan **Selesai**. Sebuah permintaan pindah ke Selesai begitu ada warga lain yang menekan tombol bantu.

## Cara menjalankan

Aplikasi ini bisa langsung dicoba tanpa Supabase: kalau `.env.local` belum diisi, semua data (akun, permintaan bantuan) disimpan sementara di memori server, sudah terisi beberapa contoh. Cukup jalankan `npm install && npm run dev` dan langsung dipakai. Bagian di bawah ini untuk nyambungin ke Supabase beneran.

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

Tiga "grup rute" (tidak muncul di URL), masing-masing dengan chrome sendiri:

```
src/
├── app/
│   ├── layout.tsx               root: html/body, font, penanda offline
│   ├── (marketing)/             landing page publik (header logo + Masuk/Daftar)
│   │   ├── layout.tsx
│   │   └── page.tsx             hero + pratinjau permintaan terbaru + cara kerja
│   ├── (auth)/                  login & register (header minimal, TANPA sidebar)
│   │   ├── layout.tsx
│   │   ├── login/ register/
│   ├── (app)/                   aplikasi beneran (sidebar navigasi)
│   │   ├── layout.tsx
│   │   ├── bantuan/             papan bantuan (feed + filter) & detail
│   │   ├── bantuan-saya/        riwayat permintaan sendiri
│   │   └── minta-bantuan/       form posting
│   ├── auth/callback/           penukaran kode OAuth jadi sesi
│   └── error.tsx not-found.tsx  layar error & 404 (chrome minimal, tombol balik ke papan)
├── components/
│   ├── ui/                      tombol, field, badge, skeleton
│   └── features/                kartu, filter, form, tombol aksi, peta
├── lib/
│   ├── actions/                 server action: auth & CRUD bantuan
│   ├── supabase/                klien server & browser
│   ├── dummy/                   data awal buat mode tanpa Supabase
│   ├── repo.ts                  satu pintu akses data (dummy atau Supabase)
│   └── constants.ts types.ts    kategori, status, bentuk data
└── proxy.ts                     refresh sesi + penjaga rute privat
```

## Beberapa keputusan teknis

**Server dulu, client kalau perlu.** Halaman papan, detail, dan riwayat semuanya Server Component: datanya diambil di server, browser terima HTML yang sudah jadi. Yang jadi Client Component cuma daun yang memang butuh interaksi, seperti tombol bantu, tombol hapus, form, dan sidebar (yang perlu tahu halaman aktif).

**Filter kategori lewat URL, bukan state.** Tombol filternya `<Link>` biasa, jadi pilihan kategori ikut di alamat (bisa di-share, tombol back jalan) dan nol JavaScript tambahan.

**Token di cookie, bukan localStorage.** Sesi diurus `@supabase/ssr` lewat cookie httpOnly. Token yang disimpan di localStorage kebaca XSS mana pun.

**RLS dinyalakan, bukan dimatikan.** Anon key itu publik karena ikut kebundel ke JavaScript browser, jadi kebijakan RLS di `schema.sql` inilah yang sebenarnya menjaga data. `proxy.ts` yang menendang tamu dari halaman privat cuma penjaga UX, bukan keamanan.

**Aksi "Saya Ingin Membantu" lewat fungsi database.** Kebijakan UPDATE tidak bisa mengunci per-kolom, jadi kalau relawan diberi izin UPDATE langsung, dia juga bisa mengubah judul dan isi postingan orang. Aksinya dibungkus fungsi `tandai_selesai` yang cuma menyentuh kolom status. Syaratnya ditaruh di `WHERE`, bukan di `IF` sebelumnya, supaya dua relawan yang menekan tombol bersamaan tidak saling menimpa.

**Peta pakai OpenStreetMap, bukan Google Maps.** Leaflet + ubin OpenStreetMap + pencarian alamat Nominatim, semuanya gratis dan tanpa API key. Koordinat (`latitude`/`longitude`) sifatnya opsional di database -- permintaan yang lokasinya diketik manual nilainya tetap `null`, dan halaman detail cuma nampilin mini-peta kalau koordinatnya ada. Pengambilan alamat dan pencarian lokasi butuh koneksi internet, terlepas dari status koneksi ke Supabase.

**Satu pintu akses data (`lib/repo.ts`).** Halaman dan server action manggil fungsi seperti `daftarBantuan()` atau `simpanBantuan()`, bukan Supabase langsung. Di baliknya, fungsi-fungsi ini nyambung ke Supabase kalau environment variable-nya ada, atau ke data di memori kalau belum -- jadi satu basis kode yang sama bisa didemokan tanpa Supabase maupun jalan penuh dengannya.

**Sidebar aplikasi nggak nempel di semua halaman.** Awalnya sidebar dipasang di root layout, jadi ikut tampil juga di halaman login/register -- link ke "Bantuan Saya" dsb. buat tamu yang belum login cuma mantul balik ke login. Sekarang root layout-nya minimal, dan tiap grup rute (`(marketing)`, `(auth)`, `(app)`) punya layout serta chrome sendiri.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di Vercel: **Add New > Project**, pilih repo-nya.
3. Isi dua environment variable yang sama seperti di `.env.local`.
4. Deploy, lalu tambahkan `https://<domain-vercel>/auth/callback` ke Redirect URLs di Supabase.
