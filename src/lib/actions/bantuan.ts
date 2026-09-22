'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase/server'
import { BATAS_DESKRIPSI, BATAS_JUDUL, BATAS_LOKASI, isKategori } from '@/lib/constants'

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

  // Dikembalikan ke form kalau ada yang salah, biar ketikan user nggak hangus.
  const nilai = { title, description, category, location }

  const field: Record<string, string> = {}
  if (title.length < 5) field.title = 'Judul minimal 5 huruf.'
  else if (title.length > BATAS_JUDUL) field.title = `Judul maksimal ${BATAS_JUDUL} huruf.`

  if (description.length < 10) field.description = 'Ceritakan sedikit lebih detail, minimal 10 huruf.'
  else if (description.length > BATAS_DESKRIPSI)
    field.description = `Deskripsi maksimal ${BATAS_DESKRIPSI} huruf.`

  if (!isKategori(category)) field.category = 'Pilih salah satu kategori.'

  if (location.length < 3) field.location = 'Tulis lokasinya, minimal 3 huruf.'
  else if (location.length > BATAS_LOKASI) field.location = `Lokasi maksimal ${BATAS_LOKASI} huruf.`

  if (Object.keys(field).length > 0) return { field, nilai }

  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Sesi kamu sudah habis. Masuk lagi dulu ya.', nilai }

  const { data, error } = await supabase
    .from('help_requests')
    .insert({ title, description, category, location, user_id: user.id })
    .select('id')
    .single()

  if (error) {
    return { error: 'Permintaan gagal dikirim. Coba lagi sebentar lagi.', nilai }
  }

  revalidatePath('/bantuan')
  revalidatePath('/bantuan-saya')
  redirect(`/bantuan/${data.id}`)
}

export async function tandaiSelesai(id: string) {
  const supabase = await supabaseServer()

  // Aksinya lewat fungsi database, bukan update langsung: di sana syaratnya
  // ditaruh di WHERE, jadi dua relawan yang mencet barengan nggak saling timpa.
  const { error } = await supabase.rpc('tandai_selesai', { bantuan_id: id })

  if (error) {
    // Cuma pesan yang kita tulis sendiri di fungsi database yang boleh tampil.
    // Error lain (koneksi, sintaks, dll) isinya teknis dan nggak ada gunanya
    // buat user -- itu cukup nyangkut di log.
    const pesanKita = error.code === 'P0001' || error.code === '42501'
    if (!pesanKita) console.error('tandai_selesai gagal', { id, error })

    return {
      error: pesanKita ? error.message : 'Gagal menandai bantuan ini. Coba muat ulang halamannya.',
    }
  }

  revalidatePath('/bantuan')
  revalidatePath(`/bantuan/${id}`)
  revalidatePath('/bantuan-saya')
  return { sukses: true as const }
}

export async function hapusBantuan(id: string) {
  const supabase = await supabaseServer()

  // Nggak perlu ngecek pemilik di sini -- policy DELETE di Supabase yang nolak
  // kalau bukan punyanya. Cukup dicek berapa baris yang beneran kehapus.
  const { data, error } = await supabase.from('help_requests').delete().eq('id', id).select('id')

  if (error || !data?.length) {
    return { error: 'Gagal menghapus. Permintaan ini mungkin bukan punyamu atau sudah terhapus.' }
  }

  revalidatePath('/bantuan')
  revalidatePath('/bantuan-saya')
  return { sukses: true as const }
}
