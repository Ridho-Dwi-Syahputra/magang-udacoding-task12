'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { modeDummy } from '@/lib/env'
import { dataDummy } from '@/lib/dummy/data'
import { COOKIE_DEMO } from '@/lib/repo'
import { supabaseServer } from '@/lib/supabase/server'

export type StatusForm = { error?: string; sukses?: string } | null

const PANJANG_PASSWORD_MIN = 8

/* Cuma path relatif yang diterima, biar nggak bisa dipakai buat mental ke
   domain lain lewat ?lanjut=https://... */
function tujuanAman(nilai: FormDataEntryValue | null) {
  const path = typeof nilai === 'string' ? nilai : ''
  return path.startsWith('/') && !path.startsWith('//') ? path : '/bantuan'
}

async function mulaiSesiDemo(id: string) {
  const jar = await cookies()
  jar.set(COOKIE_DEMO, id, { httpOnly: true, sameSite: 'lax', path: '/' })
}

export async function login(_sebelumnya: StatusForm, formData: FormData): Promise<StatusForm> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const lanjut = tujuanAman(formData.get('lanjut'))

  if (!email || !password) {
    return { error: 'Email dan kata sandi wajib diisi.' }
  }

  // Sengaja nggak dibedain antara "email nggak terdaftar" dan "sandi salah":
  // pesan yang terlalu jujur di sini bisa dipakai nebak-nebak akun mana yang ada.
  const pesanSalah = 'Email atau kata sandi salah. Coba periksa lagi.'

  if (modeDummy()) {
    const p = dataDummy().pengguna.find(
      (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password,
    )
    if (!p) return { error: pesanSalah }
    await mulaiSesiDemo(p.id)
  } else {
    const supabase = await supabaseServer()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: pesanSalah }
  }

  revalidatePath('/', 'layout')
  redirect(lanjut)
}

export async function register(_sebelumnya: StatusForm, formData: FormData): Promise<StatusForm> {
  const nama = String(formData.get('nama') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (nama.length < 3) return { error: 'Nama minimal 3 huruf.' }
  if (!email.includes('@')) return { error: 'Format email belum benar.' }
  if (password.length < PANJANG_PASSWORD_MIN) {
    return { error: `Kata sandi minimal ${PANJANG_PASSWORD_MIN} karakter.` }
  }

  if (modeDummy()) {
    const { pengguna } = dataDummy()
    if (pengguna.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'Email ini sudah terdaftar. Silakan masuk saja.' }
    }
    const id = `u-${crypto.randomUUID().slice(0, 8)}`
    pengguna.push({ id, nama, email, password })
    await mulaiSesiDemo(id)
  } else {
    const supabase = await supabaseServer()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Nama nyangkut di metadata user; trigger di database yang nyalin ke profiles.
      options: { data: { nama } },
    })

    if (error) {
      if (error.message.toLowerCase().includes('already')) {
        return { error: 'Email ini sudah terdaftar. Silakan masuk saja.' }
      }
      return { error: 'Pendaftaran gagal. Coba beberapa saat lagi.' }
    }

    // Kalau konfirmasi email masih aktif di Supabase, sesi belum langsung jadi.
    if (!data.session) {
      return { sukses: 'Akun dibuat. Cek kotak masuk email kamu untuk konfirmasi, lalu masuk.' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/bantuan')
}

export async function logout() {
  if (modeDummy()) {
    const jar = await cookies()
    jar.delete(COOKIE_DEMO)
  } else {
    const supabase = await supabaseServer()
    await supabase.auth.signOut()
  }
  revalidatePath('/', 'layout')
  redirect('/')
}
