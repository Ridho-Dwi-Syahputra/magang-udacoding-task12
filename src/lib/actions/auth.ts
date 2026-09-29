'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { daftarAkun, keluar, loginDenganSandi } from '@/lib/data/sesi'
import { tujuanAman, validasiLogin, validasiRegister } from '@/lib/validasi/auth'

/*
  Lapis orkestrasi: baca FormData, validasi, panggil data layer, putuskan
  respons/redirect. Nggak ada cookie atau panggilan Supabase yang ditulis
  langsung di sini -- itu semua di lib/data/sesi.ts.
*/

export type StatusForm = { error?: string; sukses?: string } | null

export async function login(_sebelumnya: StatusForm, formData: FormData): Promise<StatusForm> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const lanjutRaw = formData.get('lanjut')
  const lanjut = tujuanAman(typeof lanjutRaw === 'string' ? lanjutRaw : null)

  const pesanValidasi = validasiLogin({ email, password })
  if (pesanValidasi) return { error: pesanValidasi }

  const berhasil = await loginDenganSandi(email, password)
  // Sengaja nggak dibedain antara "email nggak terdaftar" dan "sandi salah":
  // pesan yang terlalu jujur di sini bisa dipakai nebak-nebak akun mana yang ada.
  if (!berhasil) return { error: 'Email atau kata sandi salah. Coba periksa lagi.' }

  revalidatePath('/', 'layout')
  redirect(lanjut)
}

export async function register(_sebelumnya: StatusForm, formData: FormData): Promise<StatusForm> {
  const nama = String(formData.get('nama') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  const pesanValidasi = validasiRegister({ nama, email, password })
  if (pesanValidasi) return { error: pesanValidasi }

  const hasil = await daftarAkun(nama, email, password)

  if (hasil.status === 'gagal') return { error: hasil.pesan }
  if (hasil.status === 'perlu_konfirmasi') {
    return { sukses: 'Akun dibuat. Cek kotak masuk email kamu untuk konfirmasi, lalu masuk.' }
  }

  revalidatePath('/', 'layout')
  redirect('/bantuan')
}

export async function logout() {
  await keluar()
  revalidatePath('/', 'layout')
  redirect('/')
}
