import { HeaderPublik } from '@/components/header-publik'
import { Rangka } from '@/components/rangka'
import { Sidebar } from '@/components/sidebar'
import { sesiSekarang } from '@/lib/repo'

/*
  Chrome-nya ngikut status login, bukan ngikut URL:
  - Belum login: header publik (logo + nav + Masuk/Daftar), kerasa kayak
    situs biasa. Ini yang kepake buat landing ("/") dan buat tamu yang
    sekadar jelajah papan bantuan -- klik "Papan Bantuan" dari landing
    nggak boleh langsung nyemplung ke shell sidebar punya orang login.
  - Sudah login: shell sidebar. /minta-bantuan dan /bantuan-saya sudah
    digembok proxy duluan buat tamu, jadi cabang bawah ini di dua halaman
    itu cuma pernah kejalanin kalau memang lagi login.
*/
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sesi = await sesiSekarang()

  if (!sesi) {
    return (
      <div className="flex min-h-screen flex-col">
        <HeaderPublik />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-6 pb-16 sm:px-8 sm:pt-10">
          {children}
        </main>
      </div>
    )
  }

  return (
    <Rangka sidebar={<Sidebar />}>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
    </Rangka>
  )
}
