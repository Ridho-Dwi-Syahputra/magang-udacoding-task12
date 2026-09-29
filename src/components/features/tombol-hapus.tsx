'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { hapusBantuan } from '@/lib/actions/bantuan'

export function TombolHapus({ id, judul }: { id: string; judul: string }) {
  const [memproses, mulai] = useTransition()
  const [konfirmasi, setKonfirmasi] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleHapus() {
    setError(null)
    mulai(async () => {
      const hasil = await hapusBantuan(id)
      if (hasil.error) {
        setError(hasil.error)
        setKonfirmasi(false)
        return
      }
      router.push('/bantuan-saya')
      router.refresh()
    })
  }

  // Hapus itu nggak bisa di-undo, jadi wajib ada satu langkah antara.
  // Konfirmasinya inline, bukan modal: pertanyaannya kecil, nggak perlu
  // menghentikan seisi halaman buat jawabannya.
  if (!konfirmasi) {
    return (
      <div>
        <Button varian="danger" ukuran="sm" onClick={() => setKonfirmasi(true)}>
          Hapus
        </Button>
        {error && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-danger/30 p-3">
      <p className="text-sm text-ink">
        Hapus permintaan &ldquo;<span className="font-semibold">{judul}</span>&rdquo;? Tindakan ini
        tidak bisa dibatalkan.
      </p>
      <div className="mt-3 flex gap-2">
        <Button
          varian="danger"
          ukuran="sm"
          onClick={handleHapus}
          memproses={memproses}
          labelProses="Menghapus..."
        >
          Ya, hapus
        </Button>
        <Button
          varian="secondary"
          ukuran="sm"
          onClick={() => setKonfirmasi(false)}
          disabled={memproses}
        >
          Batal
        </Button>
      </div>
    </div>
  )
}
