import { cookies } from 'next/headers'
import { modeDummy } from '@/lib/env'
import { dataDummy, type BarisDummy } from '@/lib/dummy/data'
import { supabaseServer } from '@/lib/supabase/server'
import type { Kategori } from '@/lib/constants'
import { KOLOM_BANTUAN, type BantuanDenganProfil } from '@/lib/types'

/*
  Satu pintu akses data. Halaman dan server action cuma kenal fungsi-fungsi di
  sini, jadi pindah dari data dummy ke Supabase nggak nyentuh satu halaman pun.
*/

export const COOKIE_DEMO = 'demo_user'

export type Sesi = { id: string; nama: string }


// ---------------------------------------------------------------- dummy

function gabung(baris: BarisDummy): BantuanDenganProfil {
  const { pengguna } = dataDummy()
  const cari = (id: string | null) => {
    const p = pengguna.find((x) => x.id === id)
    return p ? { id: p.id, nama: p.nama } : null
  }
  return { ...baris, pemilik: cari(baris.user_id), penolong: cari(baris.helper_id) }
}

function urut(a: BarisDummy, b: BarisDummy) {
  // Sama seperti query Supabase: "menunggu" di atas "selesai", lalu terbaru dulu.
  if (a.status !== b.status) return a.status < b.status ? -1 : 1
  return b.created_at.localeCompare(a.created_at)
}

// ---------------------------------------------------------------- sesi

export async function sesiSekarang(): Promise<Sesi | null> {
  if (modeDummy()) {
    const id = (await cookies()).get(COOKIE_DEMO)?.value
    const p = dataDummy().pengguna.find((x) => x.id === id)
    return p ? { id: p.id, nama: p.nama } : null
  }

  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase.from('profiles').select('nama').eq('id', user.id).single()
  return { id: user.id, nama: data?.nama ?? user.email?.split('@')[0] ?? 'warga' }
}

// ---------------------------------------------------------------- baca

export async function daftarBantuan(kategori: Kategori | null): Promise<BantuanDenganProfil[]> {
  if (modeDummy()) {
    return dataDummy()
      .baris.filter((b) => !kategori || b.category === kategori)
      .sort(urut)
      .map(gabung)
  }

  const supabase = await supabaseServer()
  let query = supabase
    .from('help_requests')
    .select(KOLOM_BANTUAN)
    // "menunggu" < "selesai" secara alfabet, jadi yang belum tertangani
    // otomatis naik ke atas tanpa kolom prioritas tambahan.
    .order('status', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(60)
  if (kategori) query = query.eq('category', kategori)

  const { data, error } = await query
  if (error) throw new Error(`Gagal memuat papan bantuan: ${error.message}`)
  return (data ?? []) as unknown as BantuanDenganProfil[]
}

export async function ambilBantuan(id: string): Promise<BantuanDenganProfil | null> {
  if (modeDummy()) {
    const baris = dataDummy().baris.find((b) => b.id === id)
    return baris ? gabung(baris) : null
  }

  const supabase = await supabaseServer()
  const { data, error } = await supabase
    .from('help_requests')
    .select(KOLOM_BANTUAN)
    .eq('id', id)
    .maybeSingle()
  // maybeSingle() balikin data null tanpa error kalau barisnya nggak ada.
  if (error) throw new Error(`Gagal memuat permintaan: ${error.message}`)
  return data as unknown as BantuanDenganProfil | null
}

export async function bantuanMilik(userId: string): Promise<BantuanDenganProfil[]> {
  if (modeDummy()) {
    return dataDummy()
      .baris.filter((b) => b.user_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(gabung)
  }

  const supabase = await supabaseServer()
  const { data, error } = await supabase
    .from('help_requests')
    .select(KOLOM_BANTUAN)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Gagal memuat riwayat: ${error.message}`)
  return (data ?? []) as unknown as BantuanDenganProfil[]
}

export async function ringkasan() {
  if (modeDummy()) {
    const { baris } = dataDummy()
    return { total: baris.length, selesai: baris.filter((b) => b.status === 'selesai').length }
  }

  const supabase = await supabaseServer()
  // Berangkat bareng, bukan antre: dua query kecil yang saling bebas.
  const [semua, selesai] = await Promise.all([
    supabase.from('help_requests').select('id', { count: 'exact', head: true }),
    supabase
      .from('help_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'selesai'),
  ])
  return { total: semua.count ?? 0, selesai: selesai.count ?? 0 }
}

// ---------------------------------------------------------------- tulis

type Isian = {
  title: string
  description: string
  category: Kategori
  location: string
  latitude: number | null
  longitude: number | null
}

export async function simpanBantuan(userId: string, isian: Isian): Promise<string | null> {
  if (modeDummy()) {
    const id = `b-${crypto.randomUUID().slice(0, 8)}`
    dataDummy().baris.push({
      id,
      ...isian,
      status: 'menunggu',
      user_id: userId,
      helper_id: null,
      helped_at: null,
      created_at: new Date().toISOString(),
    })
    return id
  }

  const supabase = await supabaseServer()
  const { data, error } = await supabase
    .from('help_requests')
    .insert({ ...isian, user_id: userId })
    .select('id')
    .single()
  return error ? null : data.id
}

export async function selesaikanBantuan(userId: string, id: string): Promise<string | null> {
  if (modeDummy()) {
    const baris = dataDummy().baris.find((b) => b.id === id)
    if (!baris || baris.status !== 'menunggu' || baris.user_id === userId) {
      return 'Permintaan ini sudah ditangani orang lain, atau ini postinganmu sendiri.'
    }
    baris.status = 'selesai'
    baris.helper_id = userId
    baris.helped_at = new Date().toISOString()
    return null
  }

  const supabase = await supabaseServer()
  // Lewat fungsi database, bukan update langsung: syaratnya ditaruh di WHERE,
  // jadi dua relawan yang mencet barengan nggak saling timpa.
  const { error } = await supabase.rpc('tandai_selesai', { bantuan_id: id })
  if (!error) return null

  // Cuma pesan yang kita tulis sendiri di fungsi database yang boleh tampil.
  const pesanKita = error.code === 'P0001' || error.code === '42501'
  if (!pesanKita) console.error('tandai_selesai gagal', { id, error })
  return pesanKita ? error.message : 'Gagal menandai bantuan ini. Coba muat ulang halamannya.'
}

export async function hapusMilik(userId: string, id: string): Promise<boolean> {
  if (modeDummy()) {
    const { baris } = dataDummy()
    const idx = baris.findIndex((b) => b.id === id && b.user_id === userId)
    if (idx === -1) return false
    baris.splice(idx, 1)
    return true
  }

  const supabase = await supabaseServer()
  // Policy DELETE di Supabase yang nolak kalau bukan punyanya; cukup dicek
  // berapa baris yang beneran kehapus.
  const { data, error } = await supabase.from('help_requests').delete().eq('id', id).select('id')
  return !error && Boolean(data?.length)
}

