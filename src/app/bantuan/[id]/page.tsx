import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, MapPin, User } from 'lucide-react'
import { BadgeKategori, BadgeStatus } from '@/components/ui/badge'
import { gayaTombol } from '@/components/ui/button'
import { TombolBantu } from '@/components/features/tombol-bantu'
import { TombolHapus } from '@/components/features/tombol-hapus'
import { tanggalLengkap, waktuRelatif } from '@/lib/format'
import { supabaseServer } from '@/lib/supabase/server'
import { KOLOM_BANTUAN, type BantuanDenganProfil } from '@/lib/types'

async function ambilBantuan(id: string) {
  const supabase = await supabaseServer()
  const { data, error } = await supabase
    .from('help_requests')
    .select(KOLOM_BANTUAN)
    .eq('id', id)
    .maybeSingle()

  // maybeSingle() balikin data null tanpa error kalau barisnya nggak ada.
  // Error yang tersisa berarti masalah beneran, bukan "nggak ketemu".
  if (error) throw new Error(`Gagal memuat permintaan: ${error.message}`)
  return data as unknown as BantuanDenganProfil | null
}

export async function generateMetadata({ params }: PageProps<'/bantuan/[id]'>): Promise<Metadata> {
  const { id } = await params
  const bantuan = await ambilBantuan(id).catch(() => null)
  return { title: bantuan?.title ?? 'Permintaan tidak ditemukan' }
}

export default async function DetailPage({ params }: PageProps<'/bantuan/[id]'>) {
  const { id } = await params

  const supabase = await supabaseServer()
  const [bantuan, { data: auth }] = await Promise.all([ambilBantuan(id), supabase.auth.getUser()])

  if (!bantuan) notFound()

  const user = auth.user
  const milikSendiri = user?.id === bantuan.user_id
  const bolehBantu = Boolean(user) && !milikSendiri && bantuan.status === 'menunggu'

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/bantuan"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kembali ke papan
      </Link>

      <article className="mt-4 overflow-hidden rounded-card border border-line bg-surface">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-5 sm:p-6">
          <BadgeKategori kategori={bantuan.category} />
          <BadgeStatus status={bantuan.status} />
        </div>

        <div className="p-5 sm:p-6">
          <h1 className="font-display text-2xl leading-tight font-extrabold text-balance text-ink">
            {bantuan.title}
          </h1>

          <p className="mt-2 text-sm text-ink-muted">
            Diposting{' '}
            <span className="font-semibold text-stone-700">{bantuan.pemilik?.nama ?? 'warga'}</span>{' '}
            &middot; <time dateTime={bantuan.created_at}>{tanggalLengkap(bantuan.created_at)}</time>
          </p>

          {/* whitespace-pre-line: paragraf yang diketik user tetap kepisah.
              Isinya dirender sebagai teks biasa, nggak pernah sebagai HTML. */}
          <p className="mt-5 leading-relaxed whitespace-pre-line text-stone-700">
            {bantuan.description}
          </p>

          <dl className="mt-6 space-y-3 rounded-lg bg-stone-50 p-4 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-stone-400" aria-hidden />
              <div>
                <dt className="font-semibold text-stone-700">Lokasi</dt>
                <dd className="text-ink-muted">{bantuan.location}</dd>
              </div>
            </div>

            {bantuan.status === 'selesai' && (
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <dt className="font-semibold text-stone-700">Sudah dibantu</dt>
                  <dd className="text-ink-muted">
                    {bantuan.penolong?.nama ?? 'Seorang warga'}
                    {bantuan.helped_at && <> &middot; {waktuRelatif(bantuan.helped_at)}</>}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t border-line bg-stone-50 p-5 sm:p-6">
          {bantuan.status === 'selesai' ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="size-5" aria-hidden />
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
              <p className="mb-3 text-sm text-stone-700">
                Bisa bantu? Tekan tombol di bawah, permintaan ini langsung ditandai selesai atas
                namamu.
              </p>
              <TombolBantu id={bantuan.id} />
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <User className="size-5 text-stone-400" aria-hidden />
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
