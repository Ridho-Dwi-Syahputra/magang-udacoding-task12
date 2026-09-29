import Image from 'next/image'
import Link from 'next/link'
import { KartuBantuan } from '@/components/features/kartu-bantuan'
import { gayaTombol } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/states'
import { daftarBantuan, ringkasan } from '@/lib/repo'

const JUMLAH_PRATINJAU = 6

export default async function LandingPage() {
  // Berangkat bareng: dua sumber data yang saling bebas.
  const [{ total, selesai }, daftar] = await Promise.all([ringkasan(), daftarBantuan(null)])
  const pratinjau = daftar.slice(0, JUMLAH_PRATINJAU)

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl leading-[1.15] font-extrabold text-balance text-ink sm:text-5xl">
            Saling Bantu, Saling Jaga
          </h1>

          <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            Community Help Board itu papan pengumuman warga: siapa pun bisa menempel permintaan
            bantuan, dari donor darah sampai pinjam kursi roda, dan tetangga yang sanggup tinggal
            angkat tangan. Papannya bisa dilihat siapa saja -- akun cuma dibutuhkan buat menempel
            permintaan atau menawarkan bantuan.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className={gayaTombol('primary')}>
              Daftar dan Mulai Bantu
            </Link>
            <Link href="/bantuan" className={gayaTombol('secondary')}>
              Lihat Semua Permintaan
            </Link>
          </div>

          {total > 0 && (
            <p className="mt-6 text-sm text-ink-muted">
              <span className="tabular font-bold text-ink">{total}</span> permintaan tertempel,{' '}
              <span className="tabular font-bold text-ink">{selesai}</span> sudah tertangani.
            </p>
          )}
        </div>

        {/* PNG-nya sudah dipotong transparan (bukan kotak putih), jadi nyatu
            ke latar krem maupun gelap tanpa kotak/bingkai tambahan. */}
        <div className="mx-auto w-full max-w-sm lg:max-w-none">
          <Image
            src="/image/landing-hero.png"
            alt="Ilustrasi warga mengantre di meja bantuan"
            width={620}
            height={608}
            priority
            className="h-auto w-full"
          />
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink">Permintaan terbaru</h2>
          <Link href="/bantuan" className="text-sm font-semibold text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          Boleh dilihat tanpa akun. Masuk dulu kalau mau menempel permintaan atau menawarkan
          bantuan.
        </p>

        <div className="mt-4">
          {pratinjau.length === 0 ? (
            <EmptyState
              judul="Papannya masih kosong"
              pesan="Jadi yang pertama menempel permintaan. Daftar dulu, satu menit saja."
              aksi={{ label: 'Daftar Sekarang', href: '/register' }}
            />
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pratinjau.map((bantuan) => (
                <li key={bantuan.id} className="flex">
                  <KartuBantuan bantuan={bantuan} />
                </li>
              ))}
            </ul>
          )}
        </div>
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
            papan dan bisa disaring per kategori, tanpa perlu akun buat sekadar melihat.
          </li>
          <li>
            <span className="font-semibold text-ink">Ada yang angkat tangan.</span> Warga yang
            sanggup masuk dulu, lalu menekan tombol bantu -- statusnya jadi selesai.
          </li>
        </ol>
      </section>
    </div>
  )
}
