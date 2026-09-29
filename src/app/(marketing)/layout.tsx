import Link from 'next/link'
import { gayaTombol } from '@/components/ui/button'
import { TemaToggle } from '@/components/tema-toggle'
import { logout } from '@/lib/actions/auth'
import { sesiSekarang } from '@/lib/repo'

/*
  Halaman depan sebelum masuk ke aplikasi. Headernya sengaja cuma logo +
  satu-dua tombol, bukan menu navigasi -- yang mau jelajah papan, minta
  bantuan, dsb. masuk lewat tombol di isi halaman, bukan dari sini.
*/
export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const sesi = await sesiSekarang()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="font-display font-extrabold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Community Help Board
        </Link>

        <div className="flex items-center gap-2">
          <TemaToggle />
          {sesi ? (
            <>
              <Link href="/bantuan" className={gayaTombol('primary', 'sm')}>
                Buka Papan Bantuan
              </Link>
              <form action={logout}>
                <button type="submit" className={gayaTombol('ghost', 'sm')}>
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={gayaTombol('secondary', 'sm')}>
                Masuk
              </Link>
              <Link href="/register" className={gayaTombol('primary', 'sm')}>
                Daftar
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-6 pb-16 sm:px-8 sm:pt-10">{children}</main>
    </div>
  )
}
