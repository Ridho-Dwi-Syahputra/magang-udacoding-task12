'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, HandHeart } from 'lucide-react'
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
        <HandHeart className="size-4" aria-hidden />
        Saya Ingin Membantu
      </Button>

      {error && (
        <p role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}
