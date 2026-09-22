import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { BadgeKategori, BadgeStatus } from '@/components/ui/badge'
import { TombolHapus } from '@/components/features/tombol-hapus'
import { EmptyState } from '@/components/ui/states'
import { INFO_KATEGORI } from '@/lib/constants'
import { waktuRelatif } from '@/lib/format'
import { supabaseServer } from '@/lib/supabase/server'
import { KOLOM_BANTUAN, type BantuanDenganProfil } from '@/lib/types'

export const metadata: Metadata = { title: 'Bantuan Saya' }

export default async function BantuanSayaPage() {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Middleware sudah nendang tamu dari sini. Pengecekan ini jaring kedua,
  // sekalian bikin TypeScript yakin user-nya nggak null di bawah.
  if (!user) redirect('/login?lanjut=/bantuan-saya')

  const { data, error } = await supabase
    .from('help_requests')
    .select(KOLOM_BANTUAN)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Gagal memuat riwayat: ${error.message}`)

  const daftar = (data ?? []) as unknown as BantuanDenganProfil[]
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
            <li
              key={bantuan.id}
              className="overflow-hidden rounded-card border border-line bg-surface"
            >
              <div className={`h-1.5 ${INFO_KATEGORI[bantuan.category].strip}`} aria-hidden />
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgeKategori kategori={bantuan.category} />
                  <BadgeStatus status={bantuan.status} />
                </div>

                <h2 className="mt-2.5 font-display leading-snug font-bold text-ink">
                  <Link href={`/bantuan/${bantuan.id}`} className="hover:text-primary">
                    {bantuan.title}
                  </Link>
                </h2>

                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
                  <MapPin className="size-4 shrink-0" aria-hidden />
                  <span className="line-clamp-1">{bantuan.location}</span>
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                  <p className="text-xs text-ink-muted">
                    <span className="tabular">{waktuRelatif(bantuan.created_at)}</span>
                    {bantuan.status === 'selesai' && (
                      <> &middot; dibantu {bantuan.penolong?.nama ?? 'warga'}</>
                    )}
                  </p>
                  <TombolHapus id={bantuan.id} judul={bantuan.title} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
