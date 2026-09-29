import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { PenandaOffline } from '@/components/penanda-offline'
import { Rangka } from '@/components/rangka'
import { Sidebar } from '@/components/sidebar'
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
      <body className="min-h-full">
        <Rangka sidebar={<Sidebar />}>
          <PenandaOffline />
          <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
        </Rangka>
      </body>
    </html>
  )
}
