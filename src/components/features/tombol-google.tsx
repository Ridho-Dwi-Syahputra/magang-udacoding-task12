'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabaseBrowser } from '@/lib/supabase/client'

/* Harus jalan di browser: alamat callback-nya diambil dari window.location,
   dan redirect ke Google berangkat dari tab user, bukan dari server. */
export function TombolGoogle({ lanjut }: { lanjut: string }) {
  const [memproses, setMemproses] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function masukGoogle() {
    setMemproses(true)
    setError(null)

    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?lanjut=${encodeURIComponent(lanjut)}`,
      },
    })

    if (error) {
      setError('Login Google belum bisa dipakai. Coba pakai email dan kata sandi dulu.')
      setMemproses(false)
    }
    // Kalau berhasil, browser langsung pindah ke Google -- nggak ada yang
    // perlu di-reset, komponennya keburu dibongkar.
  }

  return (
    <div>
      <Button
        type="button"
        varian="secondary"
        onClick={masukGoogle}
        memproses={memproses}
        labelProses="Menghubungkan..."
        className="w-full"
      >
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
          />
        </svg>
        Masuk dengan Google
      </Button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
