import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { FormGantiSandi } from '@/components/features/form-ganti-sandi'
import { FormNama } from '@/components/features/form-nama'
import { sesiSekarang } from '@/lib/data/sesi'

export const metadata: Metadata = { title: 'Profil Saya' }

export default async function ProfilPage() {
  const sesi = await sesiSekarang()

  // Proxy sudah nendang tamu dari sini. Pengecekan ini jaring kedua.
  if (!sesi) redirect('/login?lanjut=/profil')

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Profil Saya</h1>
      <p className="mt-1 mb-6 text-sm text-ink-muted">Ubah nama tampilan atau kata sandi akunmu.</p>

      <div className="space-y-6">
        <section className="rounded-card border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-ink">Nama</h2>
          <div className="mt-4">
            <FormNama namaSekarang={sesi.nama} />
          </div>
        </section>

        <section className="rounded-card border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-ink">Kata Sandi</h2>
          <div className="mt-4">
            <FormGantiSandi />
          </div>
        </section>
      </div>
    </div>
  )
}
