'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  const path = usePathname()
  const aktif = href === '/' ? path === '/' : path.startsWith(href)

  return (
    <Link
      href={href}
      aria-current={aktif ? 'page' : undefined}
      className={`block rounded-lg px-3 py-2.5 text-[0.9375rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        aktif ? 'bg-primary-soft text-primary' : 'text-ink-muted hover:bg-primary-soft hover:text-ink'
      }`}
    >
      {children}
    </Link>
  )
}
