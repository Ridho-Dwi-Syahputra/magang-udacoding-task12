import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BadgeKategori, BadgeStatus } from '@/components/ui/badge'
import { gayaTombol } from '@/components/ui/button'
import { PetaLokasi } from '@/components/features/peta-lokasi'
import { TombolBantu } from '@/components/features/tombol-bantu'
import { TombolHapus } from '@/components/features/tombol-hapus'
import { tanggalLengkap, waktuRelatif } from '@/lib/format'
import { ambilBantuan, sesiSekarang } from '@/lib/repo'

export async function generateMetadata({ params }: PageProps<'/bantuan/[id]'>): Promise<Metadata> {
  const { id } = await params
  const bantuan = await ambilBantuan(id).catch(() => null)
  return { title: bantuan?.title ?? 'Permintaan tidak ditemukan' }
}

export default async function DetailPage({ params }: PageProps<'/bantuan/[id]'>) {
  const { id } = await params

  const [bantuan, user] = await Promise.all([ambilBantuan(id), sesiSekarang()])

  if (!bantuan) notFound()

  const milikSendiri = user?.id === bantuan.user_id
  const bolehBantu = Boolean(user) && !milikSendiri && bantuan.status === 'menunggu'

  return (
    <div className="max-w-2xl">
      <Link
        href="/bantuan"
        className="text-sm font-semibold text-ink-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        &larr; Kembali ke papan
      </Link>

      <article className="mt-4 rounded-card border border-line bg-surface">
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <BadgeKategori kategori={bantuan.category} />
            <BadgeStatus status={bantuan.status} />
          </div>

          <h1 className="mt-3 font-display text-2xl leading-tight font-extrabold text-balance text-ink">
            {bantuan.title}
          </h1>

          <p className="mt-2 text-sm text-ink-muted">
            {bantuan.pemilik?.nama ?? 'Warga'} &middot;{' '}
            <time dateTime={bantuan.created_at}>{tanggalLengkap(bantuan.created_at)}</time>
          </p>

          {/* whitespace-pre-line: paragraf yang diketik user tetap kepisah.
              Isinya dirender sebagai teks biasa, nggak pernah sebagai HTML. */}
          <p className="mt-5 leading-relaxed whitespace-pre-line text-ink">{bantuan.description}</p>

          <dl className="mt-6 space-y-3 rounded-lg bg-primary-soft p-4 text-sm">
            <div>
              <dt className="font-semibold text-ink">Lokasi</dt>
              <dd className="text-ink-muted">{bantuan.location}</dd>
            </div>

            {bantuan.status === 'selesai' && (
              <div>
                <dt className="font-semibold text-ink">Dibantu oleh</dt>
                <dd className="text-ink-muted">
                  {bantuan.penolong?.nama ?? 'Seorang warga'}
                  {bantuan.helped_at && <> &middot; {waktuRelatif(bantuan.helped_at)}</>}
                </dd>
              </div>
            )}
          </dl>

          {bantuan.latitude !== null && bantuan.longitude !== null && (
            <div className="mt-3">
              <PetaLokasi lat={bantuan.latitude} lng={bantuan.longitude} />
            </div>
          )}
        </div>

        <div className="border-t border-line p-5 sm:p-6">
          {bantuan.status === 'selesai' ? (
            <p className="text-sm font-semibold text-primary">
              Permintaan ini sudah tertangani. Terima kasih sudah saling jaga.
            </p>
          ) : milikSendiri ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-muted">
                Ini permintaanmu. Menunggu tetangga yang bisa membantu.
              </p>
              <TombolHapus id={bantuan.id} judul={bantuan.title} />
            </div>
          ) : bolehBantu ? (
            <>
              <p className="mb-3 text-sm text-ink">
                Bisa bantu? Tekan tombol di bawah, permintaan ini langsung ditandai selesai atas
                namamu.
              </p>
              <TombolBantu id={bantuan.id} />
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-ink-muted">Masuk dulu untuk bisa menawarkan bantuan.</p>
              <Link
                href={`/login?lanjut=/bantuan/${bantuan.id}`}
                className={gayaTombol('primary', 'sm')}
              >
                Masuk
              </Link>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
