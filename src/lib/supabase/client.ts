import { createBrowserClient } from '@supabase/ssr'
import { envSupabase } from '@/lib/env'

/* Cuma dipakai daun client yang memang harus jalan di browser --
   sejauh ini tombol login Google, karena redirect-nya berangkat dari window. */
export function supabaseBrowser() {
  const { url, anonKey } = envSupabase()
  return createBrowserClient(url, anonKey)
}
