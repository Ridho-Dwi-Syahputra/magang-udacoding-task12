import { NextResponse, type NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

/*
  Google balikin user ke sini bawa ?code. Kode itu ditukar jadi sesi, dan
  cookie-nya ditulis dari sisi server -- token nggak pernah mampir ke JS browser.
*/
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')

  const tujuan = searchParams.get('lanjut')
  const lanjut = tujuan?.startsWith('/') && !tujuan.startsWith('//') ? tujuan : '/bantuan'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?galat=oauth`)
  }

  const supabase = await supabaseServer()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/login?galat=oauth`)
  }

  return NextResponse.redirect(`${origin}${lanjut}`)
}
