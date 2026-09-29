'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { tandaiSelesai } from '@/lib/actions/bantuan'

export function TombolBantu({ id }: { id: string }) {
  const [memproses, mulai] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleBantu() {
    setError(null)
    mulai(async () => {
      const hasil = await tandaiSelesai(id)
      // Kalau gagal gara-gara keduluan orang lain, halamannya tetap disegarin
      // supaya user langsung lihat kondisi terbaru, bukan cuma baca pesan error.
      if (hasil.error) setError(hasil.error)
      router.refresh()
    })
  }

  return (
    <div>
      <Button
        onClick={handleBantu}
        memproses={memproses}
        labelProses="Mengirim..."
        className="w-full sm:w-auto"
      >
        Saya Ingin Membantu
      </Button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
