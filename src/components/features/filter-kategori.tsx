import Link from 'next/link'
import { KATEGORI, LABEL_KATEGORI, type Kategori } from '@/lib/constants'

/*
  Filter pakai <Link>, bukan state di client: pilihannya nempel di URL (bisa
  di-share, bisa ditekan tombol back), dan nol JavaScript yang dikirim ke browser.
*/
export function FilterKategori({ aktif }: { aktif: Kategori | null }) {
  const dasar =
    'inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
  const kelas = (dipilih: boolean) =>
    `${dasar} ${
      dipilih
        ? 'border-primary bg-primary text-white'
        : 'border-line bg-surface text-ink-muted hover:bg-primary-soft'
    }`

  return (
    // py di div INI (yang overflow-x-auto), bukan di anak di bawahnya --
    // begitu satu sumbu diset overflow, browser diam-diam ikut motong sumbu
    // satunya juga, jadi ring fokus/outline yang nongol di luar tombol
    // kepotong kalau nggak dikasih ruang di kontainer yang overflow ini.
    <div className="-mx-4 -my-1.5 overflow-x-auto px-4 py-1.5 sm:mx-0 sm:px-0">
      <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        <Link
          href="/bantuan"
          aria-current={aktif === null ? 'true' : undefined}
          className={kelas(aktif === null)}
        >
          Semua
        </Link>

        {KATEGORI.map((kategori) => (
          <Link
            key={kategori}
            href={`/bantuan?kategori=${kategori}`}
            aria-current={aktif === kategori ? 'true' : undefined}
            className={kelas(aktif === kategori)}
          >
            {LABEL_KATEGORI[kategori]}
          </Link>
        ))}
      </div>
    </div>
  )
}
