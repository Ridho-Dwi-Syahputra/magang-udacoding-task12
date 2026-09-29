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
        {!memproses && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="mr-2 h-5 w-5 shrink-0"
            aria-hidden="true"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        )}
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

