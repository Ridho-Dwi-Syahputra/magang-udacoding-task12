import Link from 'next/link'
import { gayaTombol } from '@/components/ui/button'
import { MenuLink } from '@/components/menu-link'
import { logout } from '@/lib/actions/auth'
import { sesiSekarang } from '@/lib/repo'

export async function Sidebar() {
  const sesi = await sesiSekarang()

  return (
    <div className="flex h-full flex-col p-4">
      <Link
        href="/"
        className="mb-6 block rounded-lg px-3 py-2 font-display text-lg leading-tight font-extrabold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Community
        <span className="block text-sm font-semibold text-ink-muted">Help Board</span>
      </Link>

      <nav aria-label="Menu utama" className="space-y-1">
        <MenuLink href="/">Beranda</MenuLink>
        <MenuLink href="/bantuan">Papan Bantuan</MenuLink>
        <MenuLink href="/minta-bantuan">Minta Bantuan</MenuLink>
        <MenuLink href="/bantuan-saya">Bantuan Saya</MenuLink>
      </nav>

      <div className="mt-auto border-t border-line pt-4">
        {sesi ? (
          <>
            <p className="truncate px-3 text-sm text-ink-muted">Masuk sebagai</p>
            <p className="mb-3 truncate px-3 font-semibold text-ink">{sesi.nama}</p>
            <form action={logout}>
              <button type="submit" className={`${gayaTombol('secondary', 'sm')} w-full`}>
                Keluar
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-2">
            <Link href="/login" className={`${gayaTombol('secondary', 'sm')} w-full`}>
              Masuk
            </Link>
            <Link href="/register" className={`${gayaTombol('primary', 'sm')} w-full`}>
              Daftar
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
