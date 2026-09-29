import { LABEL_KATEGORI, LABEL_STATUS, type Kategori, type Status } from '@/lib/constants'

export function BadgeKategori({ kategori }: { kategori: Kategori }) {
  return <span className="text-xs font-semibold text-ink-muted">{LABEL_KATEGORI[kategori]}</span>
}

/* Beda status kelihatan dari isi vs garis, bukan dari warna lain. */
export function BadgeStatus({ status }: { status: Status }) {
  const selesai = status === 'selesai'
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        selesai ? 'bg-primary text-on-primary' : 'border border-line text-ink-muted'
      }`}
    >
      {LABEL_STATUS[status]}
    </span>
  )
}
