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
