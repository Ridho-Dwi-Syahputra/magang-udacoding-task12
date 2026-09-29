import Link from 'next/link'
import { gayaTombol } from '@/components/ui/button'
import { KATEGORI, LABEL_KATEGORI } from '@/lib/constants'
import { ringkasan } from '@/lib/repo'

export default async function BerandaPage() {
  const { total, selesai } = await ringkasan()

  return (
    <div className="space-y-12">
      <section>
        <h1 className="max-w-xl font-display text-4xl leading-[1.15] font-extrabold text-balance text-ink sm:text-5xl">
          Saling Bantu, Saling Jaga
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
          Tempel permintaan bantuanmu di papan ini, dari donor darah sampai pinjam kursi roda.
          Tetangga yang bisa membantu tinggal angkat tangan.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/bantuan" className={gayaTombol('primary')}>
            Lihat Papan Bantuan
          </Link>
          <Link href="/minta-bantuan" className={gayaTombol('secondary')}>
            Minta Bantuan
          </Link>
        </div>

        {total > 0 && (
          <p className="mt-6 text-sm text-ink-muted">
            <span className="tabular font-bold text-ink">{total}</span> permintaan tertempel,{' '}
            <span className="tabular font-bold text-ink">{selesai}</span> sudah tertangani.
          </p>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-ink">Bantuan apa yang dicari?</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {KATEGORI.map((kategori) => (
            <li key={kategori}>
              <Link
                href={`/bantuan?kategori=${kategori}`}
                className="block rounded-card border border-line bg-surface p-4 font-semibold text-ink transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {LABEL_KATEGORI[kategori]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-ink">Cara kerjanya</h2>
        <ol className="mt-4 max-w-xl list-decimal space-y-3 pl-5 text-ink-muted marker:font-bold marker:text-primary">
          <li>
            <span className="font-semibold text-ink">Tempel permintaan.</span> Tulis butuh apa, di
            mana, dan kategorinya. Perlu akun dulu.
          </li>
          <li>
            <span className="font-semibold text-ink">Tetangga melihat.</span> Permintaanmu muncul di
            papan dan bisa disaring per kategori.
          </li>
          <li>
            <span className="font-semibold text-ink">Ada yang angkat tangan.</span> Warga yang
            sanggup menekan tombol bantu, statusnya jadi selesai.
          </li>
        </ol>
      </section>
    </div>
  )
}
