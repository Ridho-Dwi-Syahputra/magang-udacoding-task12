import type { Kategori, Status } from './constants'

export type Profil = {
  id: string
  nama: string
}

export type Bantuan = {
  id: string
  title: string
  description: string
  category: Kategori
  location: string
  // Opsional: cuma keisi kalau pemosting milih lokasi lewat peta.
  // Permintaan lama (dibuat sebelum fitur peta ada) nilainya null.
  latitude: number | null
  longitude: number | null
  status: Status
  user_id: string
  helper_id: string | null
  // Kapan bantuan ini dibutuhkan (opsional, diisi pemosting).
  dibutuhkan_tanggal: string | null
  // Kapan relawan menawarkan diri (status jadi "diproses").
  helped_at: string | null
  // Kapan PEMILIK postingan mengonfirmasi bantuannya beneran kelar. Cuma
  // keisi kalau status "selesai" -- itu yang bedain "diproses" vs "selesai".
  confirmed_at: string | null
  created_at: string
}

/* Hasil join ke tabel profiles. Supabase balikin relasi sebagai objek
   (atau null kalau profilnya belum kebentuk), jadi dibikin nullable. */
export type BantuanDenganProfil = Bantuan & {
  pemilik: Profil | null
  penolong: Profil | null
}

export const KOLOM_BANTUAN =
  'id, title, description, category, location, latitude, longitude, status, user_id, helper_id, dibutuhkan_tanggal, helped_at, confirmed_at, created_at, pemilik:profiles!help_requests_user_id_fkey(id, nama), penolong:profiles!help_requests_helper_id_fkey(id, nama)'
