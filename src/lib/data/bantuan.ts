import { modeDummy } from '@/lib/env'
import { dataDummy, type BarisDummy } from '@/lib/dummy/data'
import { supabaseServer } from '@/lib/supabase/server'
import { URUTAN_STATUS, type Kategori, type Status } from '@/lib/constants'
import { KOLOM_BANTUAN, type BantuanDenganProfil } from '@/lib/types'

/*
  Data layer buat permintaan bantuan. Tiap fungsi punya dua cabang: ke
  Supabase kalau environment variable-nya ada, ke data di memori kalau
  belum (lihat lib/env.ts). Pemanggilnya (halaman, server action) nggak
  perlu tahu cabang mana yang lagi jalan.

  Alur status: menunggu -> diproses -> selesai.
  - menunggu: baru diposting, belum ada yang nawarin.
  - diproses: relawan udah nawarin (tawarkanBantuan), nunggu pemilik
    postingan konfirmasi beneran kelar (konfirmasiSelesai) atau batalin
    kalau ternyata nggak kunjung dikerjain (batalkanBantuan).
  - selesai: pemilik udah konfirmasi.
*/

// ---------------------------------------------------------------- dummy

function gabung(baris: BarisDummy): BantuanDenganProfil {
  const { pengguna } = dataDummy()
  const cari = (id: string | null) => {
    const p = pengguna.find((x) => x.id === id)
    return p ? { id: p.id, nama: p.nama } : null
  }
  return { ...baris, pemilik: cari(baris.user_id), penolong: cari(baris.helper_id) }
}

function urut(a: { status: Status; created_at: string }, b: { status: Status; created_at: string }) {
  // Yang masih butuh relawan naik ke atas, yang udah kelar turun ke bawah.
  // Bukan urutan alfabetis -- makanya pakai tabel URUTAN_STATUS, bukan
  // bandingin string status-nya langsung.
  const rank = URUTAN_STATUS[a.status] - URUTAN_STATUS[b.status]
  if (rank !== 0) return rank
  return b.created_at.localeCompare(a.created_at)
}

// ---------------------------------------------------------------- baca

export const PER_HALAMAN_PAPAN = 12

export type HasilPapan = {
  data: BantuanDenganProfil[]
  meta: { halaman: number; totalHalaman: number; total: number }
}

/*
  Pagination beneran, bukan cuma "mentok di N baris". Kalau permintaan udah
  ratusan, sisanya nggak boleh ilang gitu aja -- harus ada halaman berikutnya
  buat lihatnya.

  Dipanggil juga sama landing page buat pratinjau (halaman=1, perHalaman=3),
  jadi urutan prioritasnya (menunggu dulu, baru diproses, baru selesai) harus
  konsisten di kedua pemakaian.
*/
export async function daftarBantuan(
  kategori: Kategori | null,
  halaman = 1,
  perHalaman = PER_HALAMAN_PAPAN,
): Promise<HasilPapan> {
  if (modeDummy()) {
    const semua = dataDummy()
      .baris.filter((b) => !kategori || b.category === kategori)
      .sort(urut)

    const total = semua.length
    const totalHalaman = Math.max(1, Math.ceil(total / perHalaman))
    const mulai = (halaman - 1) * perHalaman
    const data = semua.slice(mulai, mulai + perHalaman).map(gabung)

    return { data, meta: { halaman, totalHalaman, total } }
  }

  const supabase = await supabaseServer()
  const mulai = (halaman - 1) * perHalaman
  const akhir = mulai + perHalaman - 1

  // Diurut lewat status_urutan (kolom generated di database, lihat
  // schema.sql), bukan .order('status') -- alfabetis "diproses" < "menunggu"
  // nggak sama dengan urutan prioritas yang kita mau. Urutannya harus bener
  // di level query, bukan diurut ulang di JS abis di-.range(), soalnya
  // .range() motong per halaman SEBELUM sempat diurut ulang di sini.
  let query = supabase
    .from('help_requests')
    .select(KOLOM_BANTUAN, { count: 'exact' })
    .order('status_urutan', { ascending: true })
    .order('created_at', { ascending: false })
    .range(mulai, akhir)
  if (kategori) query = query.eq('category', kategori)

  const { data, error, count } = await query
  if (error) throw new Error(`Gagal memuat papan bantuan: ${error.message}`)

  const total = count ?? 0
  const totalHalaman = Math.max(1, Math.ceil(total / perHalaman))

  return {
    data: (data ?? []) as unknown as BantuanDenganProfil[],
    meta: { halaman, totalHalaman, total },
  }
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
  dibutuhkan_tanggal: string | null
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
      confirmed_at: null,
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

/* Relawan menawarkan diri: menunggu -> diproses. Bukan langsung "selesai" --
   pemilik postingan yang berhak mastiin bantuannya beneran kelar lewat
   konfirmasiSelesai(), atau batalin lewat batalkanBantuan() kalau ternyata
   nggak kunjung dikerjain. */
export async function tawarkanBantuan(userId: string, id: string): Promise<string | null> {
  if (modeDummy()) {
    const baris = dataDummy().baris.find((b) => b.id === id)
    if (!baris || baris.status !== 'menunggu' || baris.user_id === userId) {
      return 'Permintaan ini sudah ditangani orang lain, atau ini postinganmu sendiri.'
    }
    baris.status = 'diproses'
    baris.helper_id = userId
    baris.helped_at = new Date().toISOString()
    return null
  }

  const supabase = await supabaseServer()
  // Lewat fungsi database, bukan update langsung: syaratnya ditaruh di WHERE,
  // jadi dua relawan yang mencet barengan nggak saling timpa.
  const { error } = await supabase.rpc('tawarkan_bantuan', { bantuan_id: id })
  if (!error) return null

  // Cuma pesan yang kita tulis sendiri di fungsi database yang boleh tampil.
  const pesanKita = error.code === 'P0001' || error.code === '42501'
  if (!pesanKita) console.error('tawarkan_bantuan gagal', { id, error })
  return pesanKita ? error.message : 'Gagal menawarkan bantuan. Coba muat ulang halamannya.'
}

/* Cuma boleh dipanggil pemilik postingan. diproses -> selesai. */
export async function konfirmasiSelesai(userId: string, id: string): Promise<string | null> {
  if (modeDummy()) {
    const baris = dataDummy().baris.find((b) => b.id === id)
    if (!baris || baris.status !== 'diproses' || baris.user_id !== userId) {
      return 'Nggak bisa dikonfirmasi. Coba muat ulang halamannya.'
    }
    baris.status = 'selesai'
    baris.confirmed_at = new Date().toISOString()
    return null
  }

  const supabase = await supabaseServer()
  const { error } = await supabase.rpc('konfirmasi_selesai', { bantuan_id: id })
  if (!error) return null

  const pesanKita = error.code === 'P0001' || error.code === '42501'
  if (!pesanKita) console.error('konfirmasi_selesai gagal', { id, error })
  return pesanKita ? error.message : 'Gagal mengonfirmasi. Coba muat ulang halamannya.'
}

/* Cuma boleh dipanggil pemilik postingan. diproses -> menunggu lagi (dibuka
   ulang), buat kasus relawannya ternyata nggak kunjung ngerjain. */
export async function batalkanBantuan(userId: string, id: string): Promise<string | null> {
  if (modeDummy()) {
    const baris = dataDummy().baris.find((b) => b.id === id)
    if (!baris || baris.status !== 'diproses' || baris.user_id !== userId) {
      return 'Nggak bisa dibatalkan. Coba muat ulang halamannya.'
    }
    baris.status = 'menunggu'
    baris.helper_id = null
    baris.helped_at = null
    return null
  }

  const supabase = await supabaseServer()
  const { error } = await supabase.rpc('batalkan_bantuan', { bantuan_id: id })
  if (!error) return null

  const pesanKita = error.code === 'P0001' || error.code === '42501'
  if (!pesanKita) console.error('batalkan_bantuan gagal', { id, error })
  return pesanKita ? error.message : 'Gagal membatalkan. Coba muat ulang halamannya.'
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
