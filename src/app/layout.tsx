import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { NavBawah } from '@/components/nav-bawah'
import { PenandaOffline } from '@/components/penanda-offline'
import './globals.css'

// Di-host sendiri waktu build: hilang satu request ke pihak ketiga, dan
// fallback metric-nya nahan layout biar nggak lompat pas font-nya datang.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'Papan Bantuan Warga',
    template: '%s | Papan Bantuan Warga',
  },
  description:
    'Papan pengumuman warga untuk saling bantu: donor darah, sembako, pinjam alat, sampai cari tenaga relawan.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      {/* pb-14 di HP: ruang buat nav bawah yang posisinya fixed */}
      <body className="flex min-h-full flex-col pb-14 md:pb-0">
        <PenandaOffline />
        <Navbar />
        <main className="mx-auto w-full max-w-5xl grow px-4 pt-6 pb-12 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-line bg-surface">
          <p className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-ink-muted sm:px-6">
            Papan Bantuan Warga &middot; dibangun dengan Next.js dan Supabase
          </p>
        </footer>
        <NavBawah />
      </body>
    </html>
  )
}
