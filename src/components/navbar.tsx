import Link from 'next/link'
import { HandHeart, LogOut } from 'lucide-react'
import { gayaTombol } from '@/components/ui/button'
import { logout } from '@/lib/actions/auth'
import { supabaseServer } from '@/lib/supabase/server'

export async function Navbar() {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let nama: string | null = null
  if (user) {
    const { data } = await supabase.from('profiles').select('nama').eq('id', user.id).single()
    nama = data?.nama ?? user.email?.split('@')[0] ?? null
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-white">
            <HandHeart className="size-5" aria-hidden />
          </span>
          <span className="font-display leading-tight font-extrabold text-ink">
            Papan Bantuan
            <span className="block text-xs font-semibold text-ink-muted">Warga</span>
          </span>
        </Link>

        {/* Menu utama tinggal di nav bawah pas di HP, jadi di sini cuma urusan akun. */}
        <div className="hidden items-center gap-1 md:flex">
          <Link href="/bantuan" className={gayaTombol('ghost', 'sm')}>
            Papan Bantuan
          </Link>
          {user && (
            <Link href="/bantuan-saya" className={gayaTombol('ghost', 'sm')}>
              Bantuan Saya
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-[10rem] truncate text-sm text-ink-muted sm:inline">
                Halo, <span className="font-semibold text-ink">{nama}</span>
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className={gayaTombol('secondary', 'sm')}
                  aria-label="Keluar dari akun"
                >
                  <LogOut className="size-4" aria-hidden />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={gayaTombol('ghost', 'sm')}>
                Masuk
              </Link>
              <Link href="/register" className={gayaTombol('primary', 'sm')}>
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
