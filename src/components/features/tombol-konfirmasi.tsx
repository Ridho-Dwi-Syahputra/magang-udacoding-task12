'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { batalkanBantuanAction, konfirmasiSelesaiAction } from '@/lib/actions/bantuan'

/*
  Muncul cuma buat pemilik postingan, pas status "diproses" -- relawan udah
  menawarkan diri, tapi belum tentu beneran udah ngerjain. Dua pilihan:
  konfirmasi beneran kelar, atau batalin kalau ternyata nggak kunjung
  dikerjain (dibuka lagi jadi "menunggu" buat relawan lain).
*/
export function TombolKonfirmasi({ id }: { id: string }) {
  const [memproses, mulai] = useTransition()
  const [aksi, setAksi] = useState<'konfirmasi' | 'batal' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function konfirmasi() {
    setError(null)
    setAksi('konfirmasi')
    mulai(async () => {
      const hasil = await konfirmasiSelesaiAction(id)
      if (hasil.error) setError(hasil.error)
      router.refresh()
    })
  }

  function batalkan() {
    setError(null)
    setAksi('batal')
    mulai(async () => {
      const hasil = await batalkanBantuanAction(id)
      if (hasil.error) setError(hasil.error)
      router.refresh()
    })
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={konfirmasi}
          memproses={memproses && aksi === 'konfirmasi'}
          disabled={memproses && aksi !== 'konfirmasi'}
          labelProses="Mengonfirmasi..."
        >
          Tandai Selesai
        </Button>
        <Button
          varian="secondary"
          onClick={batalkan}
          memproses={memproses && aksi === 'batal'}
          disabled={memproses && aksi !== 'batal'}
          labelProses="Membatalkan..."
        >
          Batalkan, Masih Butuh Bantuan
        </Button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
