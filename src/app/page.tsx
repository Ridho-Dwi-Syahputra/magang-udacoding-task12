import Link from 'next/link'
import { ArrowRight, Megaphone } from 'lucide-react'
import { gayaTombol } from '@/components/ui/button'
import { INFO_KATEGORI, KATEGORI } from '@/lib/constants'
import { supabaseServer } from '@/lib/supabase/server'

async function ringkasan() {
  const supabase = await supabaseServer()

  // Berangkat bareng, bukan antre. Dua query kecil yang saling bebas nggak ada
  // alasannya bikin halaman nunggu dua kali.
  const [semua, selesai] = await Promise.all([
    supabase.from('help_requests').select('id', { count: 'exact', head: true }),
    supabase
      .from('help_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'selesai'),
  ])

  return { total: semua.count ?? 0, selesai: selesai.count ?? 0 }
}

export default async function BerandaPage() {
  const { total, selesai } = await ringkasan()

  return (
    <div className="space-y-12 py-4 sm:py-8">
      <section className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold tracking-wide text-primary uppercase">
          <Megaphone className="size-3.5" aria-hidden />
          Papan pengumuman warga
        </p>

        <h1 className="mx-auto mt-5 max-w-2xl font-display text-4xl leading-[1.15] font-extrabold text-balance text-ink sm:text-5xl">
          Saling Bantu, Saling Jaga
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
          Tempel permintaan bantuanmu di papan ini, dari donor darah sampai pinjam kursi roda.
          Tetangga yang bisa membantu tinggal angkat tangan.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/bantuan" className={gayaTombol('primary')}>
            Lihat Papan Bantuan
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link href="/minta-bantuan" className={gayaTombol('secondary')}>
            Minta Bantuan
          </Link>
        </div>

        {total > 0 && (
          <p className="mt-6 text-sm text-ink-muted">
            <span className="tabular font-bold text-ink">{total}</span> permintaan tertempel,{' '}
            <span className="tabular font-bold text-primary">{selesai}</span> sudah tertangani warga.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-center font-display text-xl font-bold text-ink">
          Bantuan apa yang bisa dititipkan?
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {KATEGORI.map((kategori) => {
            const { label, ikon: Ikon, teks, latar, strip } = INFO_KATEGORI[kategori]
            return (
              <li
                key={kategori}
                className="overflow-hidden rounded-card border border-line bg-surface"
              >
                <div className={`h-1.5 ${strip}`} aria-hidden />
                <Link
                  href={`/bantuan?kategori=${kategori}`}
                  className="flex items-center gap-3 p-4 hover:bg-stone-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                >
                  <span className={`flex size-10 items-center justify-center rounded-lg ${latar}`}>
                    <Ikon className={`size-5 ${teks}`} aria-hidden />
                  </span>
                  <span className="font-semibold text-ink">{label}</span>
                  <ArrowRight className="ml-auto size-4 text-stone-400" aria-hidden />
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-card border border-line bg-surface p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold text-ink">Cara kerjanya</h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3">
          {[
            ['Tempel permintaan', 'Tulis butuh apa, di mana, dan kategorinya. Butuh akun dulu.'],
            ['Tetangga melihat', 'Permintaanmu muncul di papan, bisa disaring per kategori.'],
            ['Ada yang angkat tangan', 'Warga yang sanggup menekan tombol bantu, statusnya jadi selesai.'],
          ].map(([judul, isi], i) => (
            <li key={judul}>
              <span className="tabular font-display text-sm font-extrabold text-primary">
                0{i + 1}
              </span>
              <p className="mt-1 font-semibold text-ink">{judul}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{isi}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
