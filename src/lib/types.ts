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
  status: Status
  user_id: string
  helper_id: string | null
  helped_at: string | null
  created_at: string
}

/* Hasil join ke tabel profiles. Supabase balikin relasi sebagai objek
   (atau null kalau profilnya belum kebentuk), jadi dibikin nullable. */
export type BantuanDenganProfil = Bantuan & {
  pemilik: Profil | null
  penolong: Profil | null
}

export const KOLOM_BANTUAN =
  'id, title, description, category, location, status, user_id, helper_id, helped_at, created_at, pemilik:profiles!help_requests_user_id_fkey(id, nama), penolong:profiles!help_requests_helper_id_fkey(id, nama)'
