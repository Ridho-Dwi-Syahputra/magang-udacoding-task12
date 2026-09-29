import Link from 'next/link'
import { TemaToggle } from '@/components/tema-toggle'

/*
  Sengaja tanpa sidebar. Orang yang lagi masuk/daftar belum tentu punya akun --
  nampilin menu ke halaman yang butuh login cuma mantul-mantulin dia balik
  ke sini. Satu-satunya jalan keluar: link logo ke landing page.
*/
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 sm:p-6">
        <Link
          href="/"
          className="font-display font-extrabold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Community Help Board
        </Link>
        <TemaToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-12">{children}</main>
    </div>
  )
}
