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
// Baca preferensi tema TERSIMPAN (bukan preferensi sistem -- itu sudah
// dijamin CSS lewat prefers-color-scheme tanpa JS) dan tempel ke <html>
// sebelum apa pun sempat digambar. Tanpa ini, orang yang manual milih tema
// bakal lihat kedipan sekejap ke tema kebalikannya tiap buka halaman baru.
const SKRIP_TEMA = `try{var t=localStorage.getItem('tema');if(t)document.documentElement.setAttribute('data-theme',t==='gelap'?'dark':'light')}catch(e){}`

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="id"
      // Skrip di bawah nulis atribut data-theme sebelum React sempat hydrate,
      // jadi <html> yang dikirim server dan yang dilihat browser beda atribut.
      // Itu disengaja, bukan bug -- makanya peringatannya dimatikan di sini saja.
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: SKRIP_TEMA }} />
        <PenandaOffline />
        {children}
      </body>
    </html>
  )
}
