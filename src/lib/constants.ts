export const KATEGORI = ['medis', 'sembako', 'alat', 'relawan'] as const
export type Kategori = (typeof KATEGORI)[number]

// diproses = ada yang nawarin bantuan, nunggu dikonfirmasi pemilik postingan.
export const STATUS = ['menunggu', 'diproses', 'selesai'] as const
export type Status = (typeof STATUS)[number]

export const LABEL_KATEGORI: Record<Kategori, string> = {
  medis: 'Medis & Darurat',
  sembako: 'Sembako',
  alat: 'Peminjaman Alat',
  relawan: 'Tenaga Relawan',
}

export const LABEL_STATUS: Record<Status, string> = {
  menunggu: 'Menunggu',
  diproses: 'Diproses',
  selesai: 'Selesai',
}

// Urutan tampil di papan: yang masih butuh relawan duluan, yang udah kelar
// belakangan. Bukan alfabetis -- "diproses" < "menunggu" secara huruf,
// padahal urutan yang bener kebalik.
export const URUTAN_STATUS: Record<Status, number> = {
  menunggu: 0,
  diproses: 1,
  selesai: 2,
}

export function isKategori(nilai: unknown): nilai is Kategori {
  return typeof nilai === 'string' && (KATEGORI as readonly string[]).includes(nilai)
}

export const BATAS_JUDUL = 120
export const BATAS_DESKRIPSI = 1000
export const BATAS_LOKASI = 120
