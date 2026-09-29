/*
  Dibaca lewat fungsi, bukan konstanta di top-level modul: kalau env-nya belum
  diisi, yang gagal cuma request yang butuh Supabase -- bukan seluruh build.
  Pesannya sengaja nyebut nama variabelnya biar langsung ketahuan yang kurang.
*/
export function envSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi. Salin .env.local.example jadi .env.local dulu.',
    )
  }

  return { url, anonKey }
}

/*
  Mode dummy = env Supabase belum diisi. Semua data datang dari memori server
  (src/lib/dummy/data.ts), jadi seluruh alur bisa didemokan tanpa database.
  Begitu .env.local diisi, aplikasi otomatis pindah ke Supabase tanpa ubah kode.
*/
export function modeDummy() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

/*
  Google OAuth butuh Client ID dari Google Cloud Console.
  Set NEXT_PUBLIC_GOOGLE_OAUTH=true di .env.local kalau sudah dikonfigurasi.
  Default: false (tombol Google disembunyikan).
*/
export function googleOAuthAktif() {
  return process.env.NEXT_PUBLIC_GOOGLE_OAUTH === 'true'
}
