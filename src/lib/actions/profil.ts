'use server'

import { revalidatePath } from 'next/cache'
import { gantiNama, gantiSandi, sesiSekarang } from '@/lib/data/sesi'
import { validasiGantiSandi, validasiProfil } from '@/lib/validasi/auth'

/*
  Lapis orkestrasi buat halaman /profil. Sama polanya kayak lib/actions/auth.ts:
  baca form, validasi, panggil data layer, kasih tahu hasilnya.
*/

export type StatusProfil = { error?: string; sukses?: string } | null

export async function perbaruiNama(
  _sebelumnya: StatusProfil,
  formData: FormData,
): Promise<StatusProfil> {
  const nama = String(formData.get('nama') ?? '').trim()

  const pesanValidasi = validasiProfil({ nama })
  if (pesanValidasi) return { error: pesanValidasi }

  const sesi = await sesiSekarang()
  if (!sesi) return { error: 'Sesi kamu sudah habis. Masuk lagi dulu ya.' }

  const berhasil = await gantiNama(sesi.id, nama)
  if (!berhasil) return { error: 'Gagal menyimpan nama. Coba lagi sebentar lagi.' }

  // Nama tampil di banyak tempat (sidebar, kartu bantuan, dll.) -- segarkan
  // seluruh layout, bukan cuma halaman /profil.
  revalidatePath('/', 'layout')
  return { sukses: 'Nama berhasil diperbarui.' }
}

export async function perbaruiSandi(
  _sebelumnya: StatusProfil,
  formData: FormData,
): Promise<StatusProfil> {
  const sandiSaatIni = String(formData.get('sandiSaatIni') ?? '')
  const sandiBaru = String(formData.get('sandiBaru') ?? '')

  const pesanValidasi = validasiGantiSandi({ sandiSaatIni, sandiBaru })
  if (pesanValidasi) return { error: pesanValidasi }

  const sesi = await sesiSekarang()
  if (!sesi) return { error: 'Sesi kamu sudah habis. Masuk lagi dulu ya.' }

  const hasil = await gantiSandi(sesi.id, sandiSaatIni, sandiBaru)
  if (!hasil.berhasil) return { error: hasil.pesan }

  return { sukses: 'Kata sandi berhasil diganti.' }
}
