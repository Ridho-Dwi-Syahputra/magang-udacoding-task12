import { CheckCircle2, Clock } from 'lucide-react'
import { INFO_KATEGORI, LABEL_STATUS, type Kategori, type Status } from '@/lib/constants'

export function BadgeKategori({ kategori }: { kategori: Kategori }) {
  const { label, ikon: Ikon, teks, latar } = INFO_KATEGORI[kategori]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${latar} ${teks}`}
    >
      <Ikon className="size-3.5" aria-hidden />
      {label}
    </span>
  )
}

/* Warna nggak pernah jadi satu-satunya pembawa arti -- tiap badge bawa ikon
   dan teks, jadi tetap kebaca buat yang buta warna. */
export function BadgeStatus({ status }: { status: Status }) {
  const selesai = status === 'selesai'
  const Ikon = selesai ? CheckCircle2 : Clock
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${
        selesai ? 'bg-teal-100 text-teal-800' : 'bg-stone-100 text-stone-600'
      }`}
    >
      <Ikon className="size-3.5" aria-hidden />
      {LABEL_STATUS[status]}
    </span>
  )
}
