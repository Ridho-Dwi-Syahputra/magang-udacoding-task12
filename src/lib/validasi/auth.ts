const PANJANG_PASSWORD_MIN = 8

export type IsianLogin = { email: string; password: string }
export type IsianRegister = { nama: string; email: string; password: string }

/* Semua fungsi di sini murni: nerima nilai, ngembaliin pesan error atau
   null, nggak nyentuh cookie/Supabase/apa pun. Yang megang itu lib/data/sesi.ts. */

export function validasiLogin({ email, password }: IsianLogin): string | null {
  if (!email || !password) return 'Email dan kata sandi wajib diisi.'
  return null
}

export function validasiRegister({ nama, email, password }: IsianRegister): string | null {
  if (nama.length < 3) return 'Nama minimal 3 huruf.'
  if (!email.includes('@')) return 'Format email belum benar.'
  if (password.length < PANJANG_PASSWORD_MIN) {
    return `Kata sandi minimal ${PANJANG_PASSWORD_MIN} karakter.`
  }
  return null
}

export type IsianProfil = { nama: string }

export function validasiProfil({ nama }: IsianProfil): string | null {
  if (nama.length < 3) return 'Nama minimal 3 huruf.'
  if (nama.length > 60) return 'Nama maksimal 60 huruf.'
  return null
}

export type IsianGantiSandi = { sandiSaatIni: string; sandiBaru: string }

export function validasiGantiSandi({ sandiSaatIni, sandiBaru }: IsianGantiSandi): string | null {
  if (!sandiSaatIni) return 'Masukkan kata sandi kamu saat ini.'
  if (sandiBaru.length < PANJANG_PASSWORD_MIN) {
    return `Kata sandi baru minimal ${PANJANG_PASSWORD_MIN} karakter.`
  }
  return null
}

/* Cuma path relatif yang diterima, biar nggak bisa dipakai buat mental ke
   domain lain lewat ?lanjut=https://... */
export function tujuanAman(nilai: string | null): string {
  const path = nilai ?? ''
  return path.startsWith('/') && !path.startsWith('//') ? path : '/bantuan'
}
