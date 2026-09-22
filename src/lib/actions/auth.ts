'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase/server'

export type StatusForm = { error?: string; sukses?: string } | null

const PANJANG_PASSWORD_MIN = 8

/* Cuma path relatif yang diterima, biar nggak bisa dipakai buat mental ke
   domain lain lewat ?lanjut=https://... */
function tujuanAman(nilai: FormDataEntryValue | null) {
  const path = typeof nilai === 'string' ? nilai : ''
  return path.startsWith('/') && !path.startsWith('//') ? path : '/bantuan'
}

export async function login(_sebelumnya: StatusForm, formData: FormData): Promise<StatusForm> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const lanjut = tujuanAman(formData.get('lanjut'))

  if (!email || !password) {
    return { error: 'Email dan kata sandi wajib diisi.' }
  }

  const supabase = await supabaseServer()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Sengaja nggak dibedain antara "email nggak terdaftar" dan "sandi salah":
    // pesan yang terlalu jujur di sini bisa dipakai nebak-nebak akun mana yang ada.
    return { error: 'Email atau kata sandi salah. Coba periksa lagi.' }
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

  revalidatePath('/', 'layout')
  redirect('/bantuan')
}

export async function logout() {
  const supabase = await supabaseServer()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
