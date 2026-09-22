import type { Metadata } from 'next'
import { FormBantuan } from '@/components/features/form-bantuan'

export const metadata: Metadata = { title: 'Minta Bantuan' }

export default function MintaBantuanPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Minta Bantuan</h1>
      <p className="mt-1 mb-6 text-sm text-ink-muted">
        Permintaanmu langsung tampil di papan dan bisa dilihat semua warga.
      </p>

      <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
        <FormBantuan />
      </div>
    </div>
  )
}
