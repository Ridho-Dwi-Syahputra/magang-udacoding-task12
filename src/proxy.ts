import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { modeDummy } from '@/lib/env'

const RUTE_PRIVAT = ['/minta-bantuan', '/bantuan-saya']
const COOKIE_DEMO = 'demo_user'

/*
  Dua tugas: (1) nyegerin token Supabase supaya sesi nggak putus sendiri,
  (2) nendang tamu dari halaman privat sebelum halamannya sempat dirender.

  Nomor (2) itu penjaga UX, bukan keamanan. Yang beneran ngejaga data tetap
  RLS di Supabase -- orang bisa aja manggil API-nya langsung tanpa lewat sini.
*/
export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  let login = false

  if (modeDummy()) {
    // Mode dummy: sesi cuma cookie penanda. Keabsahannya dicek halaman
    // lewat sesiSekarang(), di sini cukup buat memutuskan redirect.
    login = Boolean(request.cookies.get(COOKIE_DEMO)?.value)
  } else {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            )
          },
        },
      },
    )
    const {
      data: { user },
    } = await supabase.auth.getUser()
    login = Boolean(user)
  }

  const path = request.nextUrl.pathname

  if (!login && RUTE_PRIVAT.some((rute) => path.startsWith(rute))) {
    const tujuan = new URL('/login', request.url)
    // Biar setelah login user balik ke halaman yang tadi dia tuju.
    tujuan.searchParams.set('lanjut', path)
    return NextResponse.redirect(tujuan)
  }

  if (login && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/bantuan', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
