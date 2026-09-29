export const KATEGORI = ['medis', 'sembako', 'alat', 'relawan'] as const
export type Kategori = (typeof KATEGORI)[number]

export const STATUS = ['menunggu', 'selesai'] as const
export type Status = (typeof STATUS)[number]

export const LABEL_KATEGORI: Record<Kategori, string> = {
  medis: 'Medis & Darurat',
  sembako: 'Sembako',
  alat: 'Peminjaman Alat',
  relawan: 'Tenaga Relawan',
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
