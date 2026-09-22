import type { LucideIcon } from 'lucide-react'
import { Boxes, HandHeart, HeartPulse, ShoppingBasket } from 'lucide-react'

export const KATEGORI = ['medis', 'sembako', 'alat', 'relawan'] as const
export type Kategori = (typeof KATEGORI)[number]

export const STATUS = ['menunggu', 'selesai'] as const
export type Status = (typeof STATUS)[number]

type InfoKategori = {
  label: string
  ikon: LucideIcon
  /* Kelas ditulis utuh, bukan dirangkai `text-kat-${slug}`.
     Tailwind cuma baca kelas yang literal ada di file. */
  teks: string
  latar: string
  strip: string
}

export const INFO_KATEGORI: Record<Kategori, InfoKategori> = {
  medis: {
    label: 'Medis & Darurat',
    ikon: HeartPulse,
    teks: 'text-kat-medis',
    latar: 'bg-red-50',
    strip: 'bg-kat-medis',
  },
  sembako: {
    label: 'Sembako',
    ikon: ShoppingBasket,
    teks: 'text-kat-sembako',
    latar: 'bg-amber-50',
    strip: 'bg-kat-sembako',
  },
  alat: {
    label: 'Peminjaman Alat',
    ikon: Boxes,
    teks: 'text-kat-alat',
    latar: 'bg-blue-50',
    strip: 'bg-kat-alat',
  },
  relawan: {
    label: 'Tenaga Relawan',
    ikon: HandHeart,
    teks: 'text-kat-relawan',
    latar: 'bg-teal-50',
    strip: 'bg-kat-relawan',
  },
}

export const LABEL_STATUS: Record<Status, string> = {
  menunggu: 'Menunggu',
  selesai: 'Selesai',
}

export function isKategori(nilai: unknown): nilai is Kategori {
  return typeof nilai === 'string' && (KATEGORI as readonly string[]).includes(nilai)
}

export const BATAS_JUDUL = 120
export const BATAS_DESKRIPSI = 1000
export const BATAS_LOKASI = 120
