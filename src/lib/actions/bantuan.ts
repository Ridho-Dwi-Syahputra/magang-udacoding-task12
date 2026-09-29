'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Kategori } from '@/lib/constants'
import {
  batalkanBantuan,
  hapusMilik,
  konfirmasiSelesai,
  simpanBantuan,
  tawarkanBantuan,
} from '@/lib/data/bantuan'
import { sesiSekarang } from '@/lib/data/sesi'
import { bacaKoordinat, validasiBantuan } from '@/lib/validasi/bantuan'

/*
  Lapis orkestrasi: baca FormData, validasi, panggil data layer, putuskan
  respons/redirect. Aturan "judul minimal 5 huruf" dkk. ada di
  lib/validasi/bantuan.ts, cara nyimpennya ada di lib/data/bantuan.ts --
  file ini cuma yang nyambungin keduanya.
*/

export type StatusBantuan = {
  error?: string
  field?: Record<string, string>
  nilai?: Record<string, string>
} | null

export async function buatBantuan(
  _sebelumnya: StatusBantuan,
  formData: FormData,
): Promise<StatusBantuan> {
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const category = String(formData.get('category') ?? '')
  const location = String(formData.get('location') ?? '').trim()
  const { latitude, longitude } = bacaKoordinat(
    String(formData.get('latitude') ?? ''),
    String(formData.get('longitude') ?? ''),
  )

  // Dikembalikan ke form kalau ada yang salah, biar ketikan user nggak hangus.
  const nilai = {
    title,
    description,
    category,
    location,
    latitude: latitude !== null ? String(latitude) : '',
    longitude: longitude !== null ? String(longitude) : '',
  }

  const field = validasiBantuan({ title, description, category, location })
  if (Object.keys(field).length > 0) return { field, nilai }

  const sesi = await sesiSekarang()
  if (!sesi) return { error: 'Sesi kamu sudah habis. Masuk lagi dulu ya.', nilai }

  const id = await simpanBantuan(sesi.id, {
    title,
    description,
    // validasiBantuan() di atas udah mastiin category ini salah satu Kategori
    // yang sah (kalau enggak, field.category bakal keisi dan udah return duluan).
    // TypeScript nggak bisa nurunin itu dari objek error yang balik dari fungsi
    // lain, jadi di-assert manual di sini.
    category: category as Kategori,
    location,
    latitude,
    longitude,
  })
  if (!id) return { error: 'Permintaan gagal dikirim. Coba lagi sebentar lagi.', nilai }

  revalidatePath('/bantuan')
  revalidatePath('/bantuan-saya')
  redirect(`/bantuan/${id}`)
}

/* Relawan menawarkan diri. Status jadi "diproses", BUKAN langsung "selesai" --
   pemilik postingan yang berhak mastiin lewat konfirmasiSelesaiAction(). */
export async function tawarkanBantuanAction(id: string) {
  const sesi = await sesiSekarang()
  if (!sesi) return { error: 'Login dulu sebelum menawarkan bantuan.' }

  const pesan = await tawarkanBantuan(sesi.id, id)
  if (pesan) return { error: pesan }

  revalidatePath('/bantuan')
  revalidatePath(`/bantuan/${id}`)
  revalidatePath('/bantuan-saya')
  return { sukses: true as const }
}

/* Cuma pemilik postingan yang boleh manggil ini (dicek juga di data layer). */
export async function konfirmasiSelesaiAction(id: string) {
  const sesi = await sesiSekarang()
  if (!sesi) return { error: 'Sesi kamu sudah habis. Masuk lagi dulu ya.' }

  const pesan = await konfirmasiSelesai(sesi.id, id)
  if (pesan) return { error: pesan }

  revalidatePath('/bantuan')
  revalidatePath(`/bantuan/${id}`)
  revalidatePath('/bantuan-saya')
  return { sukses: true as const }
}

/* Pemilik postingan batalin tawaran yang lagi diproses -- misalnya relawannya
   nggak kunjung ngerjain. Dibuka lagi jadi "menunggu". */
export async function batalkanBantuanAction(id: string) {
  const sesi = await sesiSekarang()
  if (!sesi) return { error: 'Sesi kamu sudah habis. Masuk lagi dulu ya.' }

  const pesan = await batalkanBantuan(sesi.id, id)
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
