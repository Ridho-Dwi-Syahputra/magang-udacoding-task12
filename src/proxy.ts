import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const RUTE_PRIVAT = ['/minta-bantuan', '/bantuan-saya']

/*
  Dua tugas: (1) nyegerin token Supabase supaya sesi nggak putus sendiri,
  (2) nendang tamu dari halaman privat sebelum halamannya sempat dirender.

  Nomor (2) itu penjaga UX, bukan keamanan. Yang beneran ngejaga data tetap
  RLS di Supabase -- orang bisa aja manggil API-nya langsung tanpa lewat sini.
*/
export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return response

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  if (!user && RUTE_PRIVAT.some((rute) => path.startsWith(rute))) {
    const login = new URL('/login', request.url)
    // Biar setelah login user balik ke halaman yang tadi dia tuju.
    login.searchParams.set('lanjut', path)
    return NextResponse.redirect(login)
  }

  if (user && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/bantuan', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
