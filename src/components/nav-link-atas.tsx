'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/* Sama logikanya kayak MenuLink (sidebar), cuma gaya tampilannya beda:
   teks polos buat header horizontal, bukan pil dengan latar. */
export function NavLinkAtas({ href, children }: { href: string; children: React.ReactNode }) {
  const path = usePathname()
  const aktif = href === '/' ? path === '/' : path.startsWith(href)

  return (
    <Link
      href={href}
      aria-current={aktif ? 'page' : undefined}
      className={`text-sm font-semibold transition-colors ${
        aktif ? 'text-primary' : 'text-ink-muted hover:text-primary'
      }`}
    >
      {children}
    </Link>
  )
}
