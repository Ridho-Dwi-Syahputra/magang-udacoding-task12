import type { Metadata } from 'next'
import Link from 'next/link'
import { FilterKategori } from '@/components/features/filter-kategori'
import { KartuBantuan } from '@/components/features/kartu-bantuan'
import { gayaTombol } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/states'
import { LABEL_KATEGORI, isKategori } from '@/lib/constants'
import { daftarBantuan } from '@/lib/data/bantuan'

export const metadata: Metadata = { title: 'Papan Bantuan' }

function angkaHalaman(nilai: string | undefined): number {
  const n = Number(nilai)
  return Number.isInteger(n) && n > 0 ? n : 1
}

export default async function PapanPage({ searchParams }: PageProps<'/bantuan'>) {
  const { kategori, halaman: halamanMentah } = await searchParams
  const filter = isKategori(kategori) ? kategori : null
  const halaman = angkaHalaman(
    typeof halamanMentah === 'string' ? halamanMentah : undefined,
  )

  const papan = await daftarBantuan(filter, halaman)
  const { data: daftar, meta } = papan

  // Query string dasar buat link halaman lain, tanpa param "halaman" sendiri
  // (itu ditempel beda-beda per tombol di bawah).
  const queryDasar = filter ? `?kategori=${filter}&` : '?'

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
          <>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {daftar.map((bantuan) => (
                <li key={bantuan.id} className="flex">
                  <KartuBantuan bantuan={bantuan} />
                </li>
              ))}
            </ul>

            {meta.totalHalaman > 1 && (
              <div className="mt-6 flex items-center justify-between gap-3 text-sm">
                <span className="text-ink-muted">
                  Halaman <span className="tabular">{meta.halaman}</span> dari{' '}
                  <span className="tabular">{meta.totalHalaman}</span> ({meta.total} permintaan)
                </span>
                <div className="flex gap-2">
                  {meta.halaman > 1 ? (
                    <Link
                      href={`/bantuan${queryDasar}halaman=${meta.halaman - 1}`}
                      className={gayaTombol('secondary', 'sm')}
                    >
                      Sebelumnya
                    </Link>
                  ) : (
                    <span className={`${gayaTombol('secondary', 'sm')} opacity-40`} aria-disabled>
                      Sebelumnya
                    </span>
                  )}
                  {meta.halaman < meta.totalHalaman ? (
                    <Link
                      href={`/bantuan${queryDasar}halaman=${meta.halaman + 1}`}
                      className={gayaTombol('secondary', 'sm')}
                    >
                      Berikutnya
                    </Link>
                  ) : (
                    <span className={`${gayaTombol('secondary', 'sm')} opacity-40`} aria-disabled>
                      Berikutnya
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
