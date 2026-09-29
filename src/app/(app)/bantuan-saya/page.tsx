import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BadgeKategori, BadgeStatus } from '@/components/ui/badge'
import { TombolHapus } from '@/components/features/tombol-hapus'
import { TombolKonfirmasi } from '@/components/features/tombol-konfirmasi'
import { EmptyState } from '@/components/ui/states'
import { bantuanMilik } from '@/lib/data/bantuan'
import { sesiSekarang } from '@/lib/data/sesi'
import { waktuRelatif } from '@/lib/format'

export const metadata: Metadata = { title: 'Bantuan Saya' }

export default async function BantuanSayaPage() {
  const user = await sesiSekarang()

  // Proxy sudah nendang tamu dari sini. Pengecekan ini jaring kedua,
  // sekalian bikin TypeScript yakin user-nya nggak null di bawah.
  if (!user) redirect('/login?lanjut=/bantuan-saya')

  const daftar = await bantuanMilik(user.id)
  const menunggu = daftar.filter((b) => b.status === 'menunggu').length

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Bantuan Saya</h1>
      <p className="mt-1 mb-6 text-sm text-ink-muted">
        {daftar.length === 0
          ? 'Riwayat permintaan yang pernah kamu tempel di papan.'
          : `${daftar.length} permintaan, ${menunggu} masih menunggu.`}
      </p>

      {daftar.length === 0 ? (
        <EmptyState
          judul="Belum ada permintaan"
          pesan="Setiap permintaan yang kamu tempel di papan akan tercatat di sini, lengkap dengan statusnya."
          aksi={{ label: 'Minta Bantuan', href: '/minta-bantuan' }}
        />
      ) : (
        <ul className="space-y-3">
          {daftar.map((bantuan) => (
            <li key={bantuan.id} className="rounded-card border border-line bg-surface p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <BadgeKategori kategori={bantuan.category} />
                <BadgeStatus status={bantuan.status} />
              </div>

              <h2 className="mt-2.5 font-display leading-snug font-bold text-ink">
                <Link href={`/bantuan/${bantuan.id}`} className="hover:text-primary">
                  {bantuan.title}
                </Link>
              </h2>

              <p className="mt-1.5 line-clamp-1 text-sm text-ink-muted">{bantuan.location}</p>

              {/* Tampil begitu ada yang nawarin, bukan nunggu dikonfirmasi. */}
              {(bantuan.status === 'diproses' || bantuan.status === 'selesai') && (
                <p className="mt-1.5 text-sm text-ink-muted">
                  {bantuan.status === 'selesai' ? 'Dibantu' : 'Ditawarkan'} oleh{' '}
                  <span className="font-semibold text-ink">{bantuan.penolong?.nama ?? 'warga'}</span>
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                <p className="text-xs text-ink-muted">
                  <span className="tabular">{waktuRelatif(bantuan.created_at)}</span>
                </p>

                {bantuan.status === 'menunggu' && (
                  <TombolHapus id={bantuan.id} judul={bantuan.title} />
                )}
                {bantuan.status === 'diproses' && <TombolKonfirmasi id={bantuan.id} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
