'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'

// Padang: kota yang dipakai di semua contoh lokasi pada data awal aplikasi.
// Cuma titik awal peta dibuka, bukan batasan wilayah.
const LAT_AWAL = -0.9471
const LNG_AWAL = 100.4172

export type HasilLokasi = { alamat: string; lat: number; lng: number }

/*
  Pemilih lokasi lewat peta: klik atau geser pin, cari alamat, atau pakai GPS.
  Semuanya lewat OpenStreetMap + Nominatim -- gratis, tanpa API key.

  Leaflet nyentuh `window` dan `document` langsung, jadi library-nya diimpor
  di dalam useEffect (cuma jalan di browser), bukan di top-level file.
*/
export function PetaPilih({ onPilih }: { onPilih: (hasil: HasilLokasi) => void }) {
  const kontainerRef = useRef<HTMLDivElement>(null)
  const petaRef = useRef<import('leaflet').Map | null>(null)
  const pinRef = useRef<import('leaflet').Marker | null>(null)

  const [memuat, setMemuat] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alamat, setAlamat] = useState<string | null>(null)
  const [kueri, setKueri] = useState('')
  const [hasilCari, setHasilCari] = useState<{ display_name: string; lat: string; lon: string }[]>([])
  const [mencari, setMencari] = useState(false)

  useEffect(() => {
    const kontainer = kontainerRef.current
    if (!kontainer || petaRef.current) return

    let batal = false

    import('leaflet').then((L) => {
      if (batal || petaRef.current) return

      const peta = L.map(kontainer).setView([LAT_AWAL, LNG_AWAL], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(peta)

      // Pin bulat polos warna coklat, bukan ilustrasi -- konsisten sama
      // sisa halaman yang sengaja nggak pakai ikon dekoratif.
      const ikon = L.divIcon({
        className: '',
        html: '<span style="display:block;width:16px;height:16px;border-radius:9999px;background:#6b4a34;border:3px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.25)"></span>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const pin = L.marker([LAT_AWAL, LNG_AWAL], { icon: ikon, draggable: true }).addTo(peta)
      petaRef.current = peta
      pinRef.current = pin

      const pindah = (lat: number, lng: number) => {
        pin.setLatLng([lat, lng])
        peta.panTo([lat, lng])
        cariAlamatDari(lat, lng)
      }

      peta.on('click', (e) => pindah(e.latlng.lat, e.latlng.lng))
      pin.on('dragend', () => {
        const { lat, lng } = pin.getLatLng()
        cariAlamatDari(lat, lng)
      })
    })

    return () => {
      batal = true
      petaRef.current?.remove()
      petaRef.current = null
      pinRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function cariAlamatDari(lat: number, lng: number) {
    setMemuat(true)
    setError(null)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=id`,
      )
      if (!res.ok) throw new Error()
      const data = await res.json()
      const nama = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setAlamat(nama)
      onPilih({ alamat: nama, lat, lng })
    } catch {
      setError('Gagal mengambil nama alamat dari titik ini. Koordinatnya tetap tersimpan.')
      const nama = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setAlamat(nama)
      onPilih({ alamat: nama, lat, lng })
    } finally {
      setMemuat(false)
    }
  }

  async function cariLokasi() {
    if (!kueri.trim()) return
    setMencari(true)
    setError(null)
    setHasilCari([])
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(kueri)}&limit=5&accept-language=id&countrycodes=id`,
      )
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.length === 0) setError('Lokasi tidak ditemukan. Coba kata kunci lain.')
      setHasilCari(data)
    } catch {
      setError('Pencarian gagal. Periksa koneksi internetmu.')
    } finally {
      setMencari(false)
    }
  }

  function pilihHasil(r: { display_name: string; lat: string; lon: string }) {
    const lat = Number(r.lat)
    const lng = Number(r.lon)
    setHasilCari([])
    setKueri('')
    setAlamat(r.display_name)
    onPilih({ alamat: r.display_name, lat, lng })
    petaRef.current?.setView([lat, lng], 16)
    pinRef.current?.setLatLng([lat, lng])
  }

  function pakaiGps() {
    if (!navigator.geolocation) {
      setError('Perangkat ini tidak mendukung layanan lokasi.')
      return
    }
    setMemuat(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (posisi) => {
        const { latitude, longitude } = posisi.coords
        petaRef.current?.setView([latitude, longitude], 16)
        pinRef.current?.setLatLng([latitude, longitude])
        cariAlamatDari(latitude, longitude)
      },
      (err) => {
        setMemuat(false)
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Izin lokasi ditolak. Aktifkan izin lokasi di browser untuk pakai GPS.'
            : 'Gagal mendeteksi lokasi perangkat.',
        )
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={kueri}
          onChange={(e) => setKueri(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), cariLokasi())}
          placeholder="Cari nama jalan atau kelurahan"
          className="min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-muted/60 focus:outline-2 focus:outline-offset-0 focus:outline-primary"
        />
        <Button type="button" varian="secondary" ukuran="sm" onClick={cariLokasi} memproses={mencari}>
          Cari
        </Button>
      </div>

      {hasilCari.length > 0 && (
        <ul className="max-h-40 overflow-y-auto rounded-lg border border-line bg-surface text-sm">
          {hasilCari.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => pilihHasil(r)}
                className="block w-full truncate px-3 py-2 text-left text-ink hover:bg-primary-soft"
                title={r.display_name}
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        ref={kontainerRef}
        role="application"
        aria-label="Peta pemilih lokasi. Klik atau geser pin untuk mengubah titik."
        className="h-56 w-full rounded-lg border border-line"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="button" varian="secondary" ukuran="sm" onClick={pakaiGps} memproses={memuat}>
          Gunakan Lokasi Saya
        </Button>
        <p className="text-xs text-ink-muted">Klik peta atau geser pin untuk pindah titik.</p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {alamat && (
        <p className="rounded-lg bg-primary-soft p-3 text-xs leading-relaxed text-ink">{alamat}</p>
      )}
    </div>
  )
}
