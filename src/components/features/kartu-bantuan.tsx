import Link from 'next/link'
import { BadgeKategori, BadgeStatus } from '@/components/ui/badge'
import { waktuRelatif } from '@/lib/format'
import type { BantuanDenganProfil } from '@/lib/types'

export function KartuBantuan({ bantuan }: { bantuan: BantuanDenganProfil }) {
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

      <p className="mt-4 mb-4 line-clamp-1 text-sm text-ink">{bantuan.location}</p>

      <p className="mt-auto border-t border-line pt-3 text-xs text-ink-muted">
        {bantuan.pemilik?.nama ?? 'Warga'} &middot;{' '}
        <span className="tabular">{waktuRelatif(bantuan.created_at)}</span>
      </p>
    </article>
  )
}
