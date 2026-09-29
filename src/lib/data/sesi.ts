import { cookies } from 'next/headers'
import { modeDummy } from '@/lib/env'
import { dataDummy } from '@/lib/dummy/data'
import { supabaseServer } from '@/lib/supabase/server'

/*
  Data layer buat sesi: baca siapa yang lagi login, dan tiga cara ngubahnya
  (masuk, daftar, keluar). Server action di lib/actions/auth.ts cuma manggil
  fungsi-fungsi ini -- nggak ada satu pun cookie atau panggilan Supabase yang
  ditulis langsung di sana.
*/

const COOKIE_DEMO = 'demo_user'

export type Sesi = { id: string; nama: string }

async function mulaiSesiDemo(id: string) {
  const jar = await cookies()
  jar.set(COOKIE_DEMO, id, { httpOnly: true, sameSite: 'lax', path: '/' })
}

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

export async function loginDenganSandi(email: string, password: string): Promise<boolean> {
  if (modeDummy()) {
    const p = dataDummy().pengguna.find(
      (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password,
    )
    if (!p) return false
    await mulaiSesiDemo(p.id)
    return true
  }

  const supabase = await supabaseServer()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return !error
}

export type HasilDaftar =
  | { status: 'masuk' }
  // Kalau konfirmasi email masih aktif di Supabase, akun kebentuk tapi
  // sesinya belum langsung ada.
  | { status: 'perlu_konfirmasi' }
  | { status: 'gagal'; pesan: string }

export async function daftarAkun(nama: string, email: string, password: string): Promise<HasilDaftar> {
  if (modeDummy()) {
    const { pengguna } = dataDummy()
    if (pengguna.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
      return { status: 'gagal', pesan: 'Email ini sudah terdaftar. Silakan masuk saja.' }
    }
    const id = `u-${crypto.randomUUID().slice(0, 8)}`
    pengguna.push({ id, nama, email, password })
    await mulaiSesiDemo(id)
    return { status: 'masuk' }
  }

  const supabase = await supabaseServer()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Nama nyangkut di metadata user; trigger di database yang nyalin ke profiles.
    options: { data: { nama } },
  })

  if (error) {
    if (error.message.toLowerCase().includes('already')) {
      return { status: 'gagal', pesan: 'Email ini sudah terdaftar. Silakan masuk saja.' }
    }
    return { status: 'gagal', pesan: 'Pendaftaran gagal. Coba beberapa saat lagi.' }
  }

  return data.session ? { status: 'masuk' } : { status: 'perlu_konfirmasi' }
}

export async function gantiNama(userId: string, nama: string): Promise<boolean> {
  if (modeDummy()) {
    const p = dataDummy().pengguna.find((x) => x.id === userId)
    if (!p) return false
    p.nama = nama
    return true
  }

  const supabase = await supabaseServer()
  const { error } = await supabase.from('profiles').update({ nama }).eq('id', userId)
  return !error
}

export type HasilGantiSandi = { berhasil: true } | { berhasil: false; pesan: string }

export async function gantiSandi(
  userId: string,
  sandiSaatIni: string,
  sandiBaru: string,
): Promise<HasilGantiSandi> {
  if (modeDummy()) {
    const p = dataDummy().pengguna.find((x) => x.id === userId)
    if (!p) return { berhasil: false, pesan: 'Sesi tidak valid.' }
    if (p.password !== sandiSaatIni) return { berhasil: false, pesan: 'Kata sandi saat ini salah.' }
    p.password = sandiBaru
    return { berhasil: true }
  }

  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return { berhasil: false, pesan: 'Sesi tidak valid.' }

  // Verifikasi sandi lama dulu sebelum ganti -- signInWithPassword yang gagal
  // berarti sandinya salah, tanpa perlu implementasi cek password sendiri.
  const cekLama = await supabase.auth.signInWithPassword({ email: user.email, password: sandiSaatIni })
  if (cekLama.error) return { berhasil: false, pesan: 'Kata sandi saat ini salah.' }

  const { error } = await supabase.auth.updateUser({ password: sandiBaru })
  if (error) return { berhasil: false, pesan: 'Gagal mengganti kata sandi. Coba lagi sebentar lagi.' }
  return { berhasil: true }
}

export async function keluar(): Promise<void> {
  if (modeDummy()) {
    const jar = await cookies()
    jar.delete(COOKIE_DEMO)
  } else {
    const supabase = await supabaseServer()
    await supabase.auth.signOut()
  }
}
