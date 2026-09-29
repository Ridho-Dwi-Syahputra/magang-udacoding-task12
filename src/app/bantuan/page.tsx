import type { Metadata } from 'next'
import { FilterKategori } from '@/components/features/filter-kategori'
import { KartuBantuan } from '@/components/features/kartu-bantuan'
import { EmptyState } from '@/components/ui/states'
import { LABEL_KATEGORI, isKategori } from '@/lib/constants'
import { daftarBantuan } from '@/lib/repo'

export const metadata: Metadata = { title: 'Papan Bantuan' }

export default async function PapanPage({ searchParams }: PageProps<'/bantuan'>) {
  const { kategori } = await searchParams
  const filter = isKategori(kategori) ? kategori : null

  const daftar = await daftarBantuan(filter)

  return (
    <div>
      <header className="mb-5">
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Papan Bantuan</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {filter
            ? `Menampilkan permintaan kategori ${LABEL_KATEGORI[filter]}.`
            : 'Permintaan yang masih menunggu ditampilkan lebih dulu.'}
        </p>
      </header>

      <FilterKategori aktif={filter} />

      <div className="mt-6">
        {daftar.length === 0 ? (
          <EmptyState
            judul={filter ? 'Belum ada permintaan di kategori ini' : 'Papannya masih kosong'}
            pesan={
              filter
                ? 'Coba lihat kategori lain, atau tempel permintaanmu sendiri di sini.'
                : 'Jadi yang pertama menempel permintaan. Tetangga yang bisa bantu akan melihatnya di sini.'
            }
            aksi={{ label: 'Minta Bantuan', href: '/minta-bantuan' }}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {daftar.map((bantuan) => (
              <li key={bantuan.id} className="flex">
                <KartuBantuan bantuan={bantuan} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
