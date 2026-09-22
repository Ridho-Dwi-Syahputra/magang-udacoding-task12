import Link from 'next/link'
import { INFO_KATEGORI, KATEGORI, type Kategori } from '@/lib/constants'

/*
  Filter pakai <Link>, bukan state di client: pilihannya nempel di URL (bisa
  di-share, bisa ditekan tombol back), dan nol JavaScript yang dikirim ke browser.
*/
export function FilterKategori({ aktif }: { aktif: Kategori | null }) {
  const dasar =
    'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap">
        <Link
          href="/bantuan"
          aria-current={aktif === null ? 'true' : undefined}
          className={`${dasar} ${
            aktif === null
              ? 'border-primary bg-primary text-white'
              : 'border-stone-300 bg-surface text-stone-600 hover:bg-stone-100'
          }`}
        >
          Semua
        </Link>

        {KATEGORI.map((kategori) => {
          const { label, ikon: Ikon } = INFO_KATEGORI[kategori]
          const dipilih = aktif === kategori
          return (
            <Link
              key={kategori}
              href={`/bantuan?kategori=${kategori}`}
              aria-current={dipilih ? 'true' : undefined}
              className={`${dasar} ${
                dipilih
                  ? 'border-primary bg-primary text-white'
                  : 'border-stone-300 bg-surface text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Ikon className="size-4" aria-hidden />
              {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
