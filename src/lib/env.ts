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
