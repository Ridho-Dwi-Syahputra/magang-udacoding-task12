import Link from 'next/link'
import { NavLinkAtas } from '@/components/nav-link-atas'
import { gayaTombol } from '@/components/ui/button'

/*
  Header buat pengunjung yang belum login -- dipakai di landing ("/") dan di
  papan bantuan publik ("/bantuan", "/bantuan/[id]") kalau diakses tanpa sesi.
  Begitu login, orangnya pindah ke shell sidebar (lihat (app)/layout.tsx),
  header ini nggak kepake lagi -- makanya di sini nggak perlu cek sesi.
*/
export function HeaderPublik() {
  return (
    <header className="flex items-center justify-between px-4 py-4 sm:px-8">
      <Link
        href="/"
        className="font-display font-extrabold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Community Help Board
      </Link>

      <nav aria-label="Menu utama" className="hidden items-center gap-6 sm:flex">
        <NavLinkAtas href="/">Beranda</NavLinkAtas>
        <NavLinkAtas href="/bantuan">Papan Bantuan</NavLinkAtas>
      </nav>

      <div className="flex items-center gap-2">
        <Link href="/login" className={gayaTombol('secondary', 'sm')}>
          Masuk
        </Link>
        <Link href="/register" className={gayaTombol('primary', 'sm')}>
          Daftar
        </Link>
      </div>
    </header>
  )
}
