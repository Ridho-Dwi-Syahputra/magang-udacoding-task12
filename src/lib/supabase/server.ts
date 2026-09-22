import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { envSupabase } from '@/lib/env'

/*
  Klien untuk Server Component, Server Action, dan Route Handler.
  Sesi disimpan di cookie httpOnly (diurus @supabase/ssr), bukan localStorage --
  token di localStorage kebaca XSS mana pun.
*/
export async function supabaseServer() {
  // cookies() dipanggil duluan supaya Next tahu route ini dinamis sebelum
  // apa pun yang lain jalan.
  const cookieStore = await cookies()
  const { url, anonKey } = envSupabase()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Component nggak boleh nulis cookie. Nggak masalah:
          // middleware yang nanganin refresh token di tiap request.
        }
      },
    },
  })
}

/** Ambil user yang lagi login, atau null. Dipakai navbar dan halaman privat. */
export async function userSekarang() {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
