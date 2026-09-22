import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { BadgeKategori, BadgeStatus } from '@/components/ui/badge'
import { INFO_KATEGORI } from '@/lib/constants'
import { waktuRelatif } from '@/lib/format'
import type { BantuanDenganProfil } from '@/lib/types'

/*
  Strip warna di atas kartu = kategorinya. Ini satu-satunya "gaya khas" papan
  ini: warga bisa mindai satu layar penuh dan langsung tahu mana yang medis
  tanpa baca satu badge pun.
*/
export function KartuBantuan({ bantuan }: { bantuan: BantuanDenganProfil }) {
  const { strip } = INFO_KATEGORI[bantuan.category]

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-md">
      <div className={`h-1.5 shrink-0 ${strip}`} aria-hidden />
      <div className="flex grow flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
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

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">
          {bantuan.description}
        </p>

        <div className="mt-4 mb-4 flex items-start gap-1.5 text-sm text-ink-muted">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span className="line-clamp-1">{bantuan.location}</span>
        </div>

        <p className="mt-auto border-t border-line pt-3 text-xs text-ink-muted">
          Diposting {bantuan.pemilik?.nama ?? 'warga'} &middot;{' '}
          <span className="tabular">{waktuRelatif(bantuan.created_at)}</span>
        </p>
      </div>
    </article>
  )
}
