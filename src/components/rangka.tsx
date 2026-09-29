'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

/*
  Sidebar tetap di kiri mulai layar md. Di HP dia jadi laci yang digeser masuk
  lewat tombol Menu di bar atas.

  Status buka-tutup disimpan sebagai "laci terbuka di halaman mana", bukan
  boolean. Pindah halaman otomatis menutup laci tanpa efek samping tambahan.
*/
export function Rangka({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  const path = usePathname()
  const [terbukaDi, setTerbukaDi] = useState<string | null>(null)
  const terbuka = terbukaDi === path

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface px-4 md:hidden">
        <Link href="/" className="font-display font-extrabold text-primary">
          Papan Bantuan
        </Link>
        <button
          type="button"
          onClick={() => setTerbukaDi(terbuka ? null : path)}
          aria-expanded={terbuka}
          aria-controls="sidebar"
          className="min-h-9 rounded-lg px-3 text-sm font-semibold text-ink hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {terbuka ? 'Tutup' : 'Menu'}
        </button>
      </header>

      {terbuka && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setTerbukaDi(null)}
          className="fixed inset-0 z-30 bg-ink/40 md:hidden"
        />
      )}

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-line bg-surface transition-[transform,visibility] duration-200 md:visible md:translate-x-0 ${
          terbuka ? 'translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        {sidebar}
      </aside>

      <div className="md:pl-64">{children}</div>
    </div>
  )
}
