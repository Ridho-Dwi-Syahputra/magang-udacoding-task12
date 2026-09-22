'use client'

import { useEffect } from 'react'
import { RotateCcw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Detail teknisnya tinggal di console/log, bukan di layar user.
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <TriangleAlert className="mx-auto size-10 text-danger" aria-hidden />
      <h1 className="mt-4 font-display text-xl font-extrabold text-ink">Papannya lagi gangguan</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Datanya gagal dimuat. Biasanya cukup dicoba sekali lagi. Kalau masih bandel, coba beberapa
        menit lagi.
      </p>
      <Button onClick={reset} className="mt-6">
        <RotateCcw className="size-4" aria-hidden />
        Coba Lagi
      </Button>
    </div>
  )
}
