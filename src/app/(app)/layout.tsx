import { Rangka } from '@/components/rangka'
import { Sidebar } from '@/components/sidebar'

/*
  Chrome buat halaman aplikasi beneran: papan bantuan, form posting, riwayat.
  Sidebar-nya tampil buat tamu maupun yang sudah login -- lihat papan itu
  nggak butuh akun, cuma posting dan kelola punya sendiri yang butuh.
*/
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Rangka sidebar={<Sidebar />}>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
    </Rangka>
  )
}
