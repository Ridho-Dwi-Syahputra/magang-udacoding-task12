'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { BATAS_DESKRIPSI, BATAS_JUDUL, BATAS_LOKASI, isKategori } from '@/lib/constants'
import { hapusMilik, selesaikanBantuan, sesiSekarang, simpanBantuan } from '@/lib/repo'

export type StatusBantuan = {
  error?: string
  field?: Record<string, string>
  nilai?: Record<string, string>
} | null

/* Titik dari peta cuma pemanis lokasi, bukan data wajib. Kalau salah satu
   angkanya rusak atau di luar rentang koordinat yang valid, keduanya
   dianggap kosong saja daripada nge-block pengiriman gara-gara ini. */
function bacaKoordinat(formData: FormData): { latitude: number | null; longitude: number | null } {
  const latStr = String(formData.get('latitude') ?? '').trim()
  const lngStr = String(formData.get('longitude') ?? '').trim()
  // Dicek kosong dulu: Number('') hasilnya 0, bukan NaN, jadi tanpa ini
  // lokasi manual (tanpa pin) malah kesimpen sebagai koordinat 0,0.
  if (!latStr || !lngStr) return { latitude: null, longitude: null }

  const lat = Number(latStr)
  const lng = Number(lngStr)
  const valid =
    Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
  return valid ? { latitude: lat, longitude: lng } : { latitude: null, longitude: null }
}

export async function buatBantuan(
  _sebelumnya: StatusBantuan,
  formData: FormData,
): Promise<StatusBantuan> {
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const category = String(formData.get('category') ?? '')
  const location = String(formData.get('location') ?? '').trim()
  const { latitude, longitude } = bacaKoordinat(formData)

  // Dikembalikan ke form kalau ada yang salah, biar ketikan user nggak hangus.
  const nilai = {
    title,
    description,
    category,
    location,
    latitude: latitude !== null ? String(latitude) : '',
    longitude: longitude !== null ? String(longitude) : '',
  }

  const field: Record<string, string> = {}
  if (title.length < 5) field.title = 'Judul minimal 5 huruf.'
  else if (title.length > BATAS_JUDUL) field.title = `Judul maksimal ${BATAS_JUDUL} huruf.`

  if (description.length < 10) field.description = 'Ceritakan sedikit lebih detail, minimal 10 huruf.'
  else if (description.length > BATAS_DESKRIPSI)
    field.description = `Deskripsi maksimal ${BATAS_DESKRIPSI} huruf.`

  if (!isKategori(category)) field.category = 'Pilih salah satu kategori.'

  if (location.length < 3) field.location = 'Tulis lokasinya, minimal 3 huruf.'
  else if (location.length > BATAS_LOKASI) field.location = `Lokasi maksimal ${BATAS_LOKASI} huruf.`

  if (Object.keys(field).length > 0 || !isKategori(category)) return { field, nilai }

  const sesi = await sesiSekarang()
  if (!sesi) return { error: 'Sesi kamu sudah habis. Masuk lagi dulu ya.', nilai }

  const id = await simpanBantuan(sesi.id, { title, description, category, location, latitude, longitude })
  if (!id) return { error: 'Permintaan gagal dikirim. Coba lagi sebentar lagi.', nilai }

  revalidatePath('/bantuan')
  revalidatePath('/bantuan-saya')
  redirect(`/bantuan/${id}`)
}

export async function tandaiSelesai(id: string) {
  const sesi = await sesiSekarang()
  if (!sesi) return { error: 'Login dulu sebelum menawarkan bantuan.' }

  const pesan = await selesaikanBantuan(sesi.id, id)
  if (pesan) return { error: pesan }

  revalidatePath('/bantuan')
  revalidatePath(`/bantuan/${id}`)
  revalidatePath('/bantuan-saya')
  return { sukses: true as const }
}

export async function hapusBantuan(id: string) {
  const sesi = await sesiSekarang()
  if (!sesi) return { error: 'Sesi kamu sudah habis. Masuk lagi dulu ya.' }

  if (!(await hapusMilik(sesi.id, id))) {
    return { error: 'Gagal menghapus. Permintaan ini mungkin bukan punyamu atau sudah terhapus.' }
  }

  revalidatePath('/bantuan')
  revalidatePath('/bantuan-saya')
  return { sukses: true as const }
}
