import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { PenandaOffline } from '@/components/penanda-offline'
import './globals.css'

// Di-host sendiri waktu build: hilang satu request ke pihak ketiga, dan
// fallback metric-nya nahan layout biar nggak lompat pas font-nya datang.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'Community Help Board',
    template: '%s | Community Help Board',
  },
  description:
    'Papan pengumuman warga untuk saling bantu: donor darah, sembako, pinjam alat, sampai cari tenaga relawan.',
}

/*
  Sengaja minimal: cuma html/body, font, dan penanda offline. Chrome
  per-halaman (sidebar aplikasi, header landing, header auth) itu urusan
  layout di masing-masing grup rute -- (app), (marketing), (auth) --
  supaya login/register nggak ketarik nampilin sidebar aplikasi yang
  isinya link ke halaman yang belum tentu bisa dia akses.
*/
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full">
        <PenandaOffline />
        {children}
      </body>
    </html>
  )
}
