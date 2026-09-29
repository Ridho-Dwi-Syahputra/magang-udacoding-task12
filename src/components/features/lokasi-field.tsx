'use client'

import { useState } from 'react'
import { kelasInput } from '@/components/ui/field'
import { PetaPilih, type HasilLokasi } from '@/components/features/peta-pilih'
import { BATAS_LOKASI } from '@/lib/constants'

type Props = {
  error?: string
  awal: { location: string; latitude: string; longitude: string }
}

/*
  Satu kolom "Lokasi", dua cara ngisi. Keduanya ngirim field yang sama
  (location, latitude, longitude) lewat form yang sama -- yang beda cuma
  input mana yang kelihatan.
*/
export function LokasiField({ error, awal }: Props) {
  // Kalau submit sebelumnya gagal validasi field lain sementara peta sudah
  // dipilih, jangan hilangkan pin-nya -- balik ke mode peta bawa titik lama.
  const [mode, setMode] = useState<'manual' | 'peta'>(awal.latitude ? 'peta' : 'manual')
  const [alamat, setAlamat] = useState(awal.location)
  const [koordinat, setKoordinat] = useState({ lat: awal.latitude, lng: awal.longitude })

  function pindahManual() {
    setMode('manual')
    setKoordinat({ lat: '', lng: '' })
  }

  function pilihDiPeta(hasil: HasilLokasi) {
    setAlamat(hasil.alamat)
    setKoordinat({ lat: String(hasil.lat), lng: String(hasil.lng) })
  }

  const dasarToggle =
    'min-h-8 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
  const kelasToggle = (aktif: boolean) =>
    `${dasarToggle} ${
      aktif
        ? 'border-primary bg-primary text-on-primary'
        : 'border-line bg-surface text-ink-muted hover:bg-primary-soft'
    }`

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor="location" className="text-sm font-semibold text-ink">
          Lokasi
        </label>
        <div className="flex gap-1.5">
          <button type="button" onClick={pindahManual} className={kelasToggle(mode === 'manual')}>
            Isi manual
          </button>
          <button type="button" onClick={() => setMode('peta')} className={kelasToggle(mode === 'peta')}>
            Pilih dari peta
          </button>
        </div>
      </div>

      {mode === 'manual' ? (
        <input
          id="location"
          name="location"
          type="text"
          required
          maxLength={BATAS_LOKASI}
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          placeholder="Contoh: RT 03 / RW 05, Kel. Jati, Padang"
          aria-invalid={Boolean(error)}
          className={kelasInput(Boolean(error))}
        />
      ) : (
        <>
          <input type="hidden" name="location" value={alamat} />
          <PetaPilih onPilih={pilihDiPeta} />
        </>
      )}

      <input type="hidden" name="latitude" value={koordinat.lat} />
      <input type="hidden" name="longitude" value={koordinat.lng} />

      <p className={`mt-1.5 text-sm ${error ? 'text-danger' : 'text-ink-muted'}`}>
        {error ?? (mode === 'manual' ? 'RT/RW, kelurahan, atau patokan yang gampang dicari.' : ' ')}
      </p>
    </div>
  )
}
