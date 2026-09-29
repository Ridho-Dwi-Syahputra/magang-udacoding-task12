import { BATAS_DESKRIPSI, BATAS_JUDUL, BATAS_LOKASI, isKategori } from '@/lib/constants'

export type IsianBantuan = {
  title: string
  description: string
  category: string
  location: string
}

export type ErrorBantuan = Partial<Record<keyof IsianBantuan, string>>

/*
  Fungsi murni: cuma nerima nilai dan ngembaliin nilai, nggak nyentuh
  FormData, database, atau apa pun di luar argumennya sendiri. Bisa ditest
  sendirian tanpa perlu jalanin server action yang makai dia
  (lib/actions/bantuan.ts).
*/
export function validasiBantuan(isian: IsianBantuan): ErrorBantuan {
  const error: ErrorBantuan = {}

  if (isian.title.length < 5) error.title = 'Judul minimal 5 huruf.'
  else if (isian.title.length > BATAS_JUDUL) error.title = `Judul maksimal ${BATAS_JUDUL} huruf.`

  if (isian.description.length < 10) {
    error.description = 'Ceritakan sedikit lebih detail, minimal 10 huruf.'
  } else if (isian.description.length > BATAS_DESKRIPSI) {
    error.description = `Deskripsi maksimal ${BATAS_DESKRIPSI} huruf.`
  }

  if (!isKategori(isian.category)) error.category = 'Pilih salah satu kategori.'

  if (isian.location.length < 3) error.location = 'Tulis lokasinya, minimal 3 huruf.'
  else if (isian.location.length > BATAS_LOKASI) {
    error.location = `Lokasi maksimal ${BATAS_LOKASI} huruf.`
  }

  return error
}

export type Koordinat = { latitude: number | null; longitude: number | null }

/* Titik dari peta cuma pemanis lokasi, bukan data wajib. Kalau salah satu
   angkanya rusak atau di luar rentang koordinat yang valid, keduanya
   dianggap kosong saja daripada nge-block pengiriman gara-gara ini. */
export function bacaKoordinat(latStr: string, lngStr: string): Koordinat {
  // Dicek kosong dulu: Number('') hasilnya 0, bukan NaN, jadi tanpa ini
  // lokasi manual (tanpa pin) malah kesimpen sebagai koordinat 0,0.
  if (!latStr.trim() || !lngStr.trim()) return { latitude: null, longitude: null }

  const lat = Number(latStr)
  const lng = Number(lngStr)
  const valid =
    Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
  return valid ? { latitude: lat, longitude: lng } : { latitude: null, longitude: null }
}
