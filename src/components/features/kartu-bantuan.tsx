import Link from 'next/link'
import { BadgeKategori, BadgeStatus } from '@/components/ui/badge'
import { waktuRelatif, formatTanggalDibutuhkan } from '@/lib/format'
import type { BantuanDenganProfil } from '@/lib/types'

export function KartuBantuan({ bantuan }: { bantuan: BantuanDenganProfil }) {
  // Hitung apakah tanggal deadline sudah dekat (≤ 2 hari) atau sudah lewat
  const deadlineInfo = (() => {
    if (!bantuan.dibutuhkan_tanggal) return null
    const tgl = new Date(bantuan.dibutuhkan_tanggal + 'T00:00:00')
    const hari_ini = new Date()
    hari_ini.setHours(0, 0, 0, 0)
    const selisihHari = Math.ceil((tgl.getTime() - hari_ini.getTime()) / (1000 * 60 * 60 * 24))
    if (selisihHari < 0) return { label: formatTanggalDibutuhkan(bantuan.dibutuhkan_tanggal), urgen: 'lewat' as const }
    if (selisihHari <= 2) return { label: formatTanggalDibutuhkan(bantuan.dibutuhkan_tanggal), urgen: 'segera' as const }
    return { label: formatTanggalDibutuhkan(bantuan.dibutuhkan_tanggal), urgen: 'normal' as const }
  })()

  return (
    <article className="group relative flex w-full flex-col rounded-card border border-line bg-surface p-5 transition-colors hover:border-primary/50">
      <div className="flex items-center justify-between gap-3">
        <BadgeKategori kategori={bantuan.category} />
        <BadgeStatus status={bantuan.status} />
      </div>

      <h3 className="mt-3 font-display text-lg leading-snug font-bold text-ink">
        <Link
          href={`/bantuan/${bantuan.id}`}
          className="after:absolute after:inset-0 group-hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {bantuan.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
        {bantuan.description}
      </p>

      <p className="mt-4 mb-2 line-clamp-1 text-sm text-ink">{bantuan.location}</p>

      {deadlineInfo && (
        <p className={`mb-2 text-xs font-medium ${
          deadlineInfo.urgen === 'lewat'
            ? 'text-danger'
            : deadlineInfo.urgen === 'segera'
              ? 'text-orange-500'
              : 'text-ink-muted'
        }`}>
          ⏰ Dibutuhkan: {deadlineInfo.label}
          {deadlineInfo.urgen === 'segera' && ' · Segera!'}
          {deadlineInfo.urgen === 'lewat' && ' · Sudah lewat'}
        </p>
      )}

      <p className="mt-auto border-t border-line pt-3 text-xs text-ink-muted">
        {bantuan.pemilik?.nama ?? 'Warga'} &middot;{' '}
        <span className="tabular">{waktuRelatif(bantuan.created_at)}</span>
      </p>
    </article>
  )
}
