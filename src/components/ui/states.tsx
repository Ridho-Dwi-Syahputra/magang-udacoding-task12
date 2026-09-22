import Link from 'next/link'
import { gayaTombol } from './button'

export function EmptyState({
  judul,
  pesan,
  aksi,
}: {
  judul: string
  pesan: string
  aksi?: { label: string; href: string }
}) {
  return (
    <div className="rounded-card border border-dashed border-stone-300 bg-surface px-6 py-14 text-center">
      <p className="font-display text-lg font-bold text-ink">{judul}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">{pesan}</p>
      {aksi && (
        <Link href={aksi.href} className={`${gayaTombol('primary')} mt-6`}>
          {aksi.label}
        </Link>
      )}
    </div>
  )
}

export function SkeletonKartu() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="h-1.5 bg-stone-200" />
      <div className="animate-pulse space-y-3 p-5">
        <div className="h-5 w-28 rounded bg-stone-200" />
        <div className="h-5 w-4/5 rounded bg-stone-200" />
        <div className="h-4 w-full rounded bg-stone-100" />
        <div className="h-4 w-2/3 rounded bg-stone-100" />
        <div className="h-4 w-1/2 rounded bg-stone-100" />
      </div>
    </div>
  )
}
