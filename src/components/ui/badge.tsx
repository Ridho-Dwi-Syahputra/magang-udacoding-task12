import { LABEL_KATEGORI, LABEL_STATUS, type Kategori, type Status } from '@/lib/constants'

export function BadgeKategori({ kategori }: { kategori: Kategori }) {
  return <span className="text-xs font-semibold text-ink-muted">{LABEL_KATEGORI[kategori]}</span>
}

const GAYA_STATUS: Record<Status, string> = {
  menunggu: 'border border-line text-ink-muted',
  diproses: 'bg-primary-soft text-primary',
  selesai: 'bg-primary text-white',
}

/* Tiga status, tiga tingkat keterisian visual: garis polos (belum ada yang
   nawarin) -> latar lembut (lagi diproses) -> latar penuh (kelar). Bedanya
   kelihatan dari isi/garis, bukan dari ganti-ganti warna. */
export function BadgeStatus({ status }: { status: Status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${GAYA_STATUS[status]}`}>
      {LABEL_STATUS[status]}
    </span>
  )
}
