import type { Metadata } from 'next'
import Link from 'next/link'
import { FormLogin } from '@/components/features/form-login'
import { TombolGoogle } from '@/components/features/tombol-google'
import { modeDummy } from '@/lib/env'

export const metadata: Metadata = { title: 'Masuk' }

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { lanjut, galat } = await searchParams

  const tujuan = typeof lanjut === 'string' && lanjut.startsWith('/') ? lanjut : '/bantuan'
  const pesanGalat = galat === 'oauth' ? 'Login lewat Google gagal. Coba lagi ya.' : undefined

  return (
    <div className="mx-auto max-w-sm py-4 sm:py-8">
      <h1 className="font-display text-2xl font-extrabold text-ink">Masuk</h1>
      <p className="mt-1 mb-6 text-sm text-ink-muted">
        Masuk dulu untuk menempel permintaan atau menawarkan bantuan.
      </p>

      <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
        <FormLogin lanjut={tujuan} galat={pesanGalat} />

        {/* Google butuh Supabase, jadi di mode dummy nggak ditampilkan
            daripada muncul tombol yang pasti gagal. */}
        {!modeDummy() && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs font-semibold text-ink-muted">
              <span className="h-px flex-1 bg-line" />
              ATAU
              <span className="h-px flex-1 bg-line" />
            </div>

            <TombolGoogle lanjut={tujuan} />
          </>
        )}
      </div>

      <p className="mt-5 text-center text-sm text-ink-muted">
        Belum punya akun?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  )
}
