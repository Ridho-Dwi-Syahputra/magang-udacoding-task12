'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, Home, PlusCircle, ScrollText } from 'lucide-react'

/*
  Di HP, jempol berdaulat di sepertiga bawah layar. Empat tujuan utama ditaruh
  di sini alih-alih disembunyiin di balik hamburger.
  Ikonnya selalu berlabel -- ikon tanpa label itu tebak-tebakan.
*/
const MENU = [
  { href: '/', label: 'Beranda', ikon: Home },
  { href: '/bantuan', label: 'Papan', ikon: ClipboardList },
  { href: '/minta-bantuan', label: 'Minta', ikon: PlusCircle },
  { href: '/bantuan-saya', label: 'Saya', ikon: ScrollText },
]

export function NavBawah() {
  const path = usePathname()

  return (
    <nav
      aria-label="Menu utama"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface md:hidden"
    >
      <ul className="mx-auto flex max-w-5xl">
        {MENU.map(({ href, label, ikon: Ikon }) => {
          const aktif = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={aktif ? 'page' : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold ${
                  aktif ? 'text-primary' : 'text-ink-muted'
                }`}
              >
                <Ikon className="size-5" aria-hidden />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
