import type { Metadata } from 'next'
import Link from 'next/link'
import { FormRegister } from '@/components/features/form-register'
import { TombolGoogle } from '@/components/features/tombol-google'
import { modeDummy } from '@/lib/env'

export const metadata: Metadata = { title: 'Daftar' }

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm py-4 sm:py-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Buat Akun</h1>
      <p className="mt-1 mb-6 text-sm text-ink-muted">
        Cukup sekali daftar, setelah itu bisa minta maupun memberi bantuan.
      </p>

      <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
        <FormRegister />

        {!modeDummy() && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs font-semibold text-ink-muted">
              <span className="h-px flex-1 bg-line" />
              ATAU
              <span className="h-px flex-1 bg-line" />
            </div>

            <TombolGoogle lanjut="/bantuan" />
          </>
        )}
      </div>

      <p className="mt-5 text-center text-sm text-ink-muted">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  )
}
