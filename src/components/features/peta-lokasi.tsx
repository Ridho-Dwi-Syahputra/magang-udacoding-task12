'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

/*
  Versi baca-saja dari peta: satu pin, nggak bisa digeser, nggak ada kontrol
  pencarian. Cuma nunjukkin di mana titik yang dipilih pemosting saat itu.
*/
export function PetaLokasi({ lat, lng }: { lat: number; lng: number }) {
  const kontainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const kontainer = kontainerRef.current
    if (!kontainer) return

    let peta: import('leaflet').Map | undefined
    let batal = false

    import('leaflet').then((L) => {
      if (batal) return

      peta = L.map(kontainer, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      }).setView([lat, lng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(peta)

      const ikon = L.divIcon({
        className: '',
        html: '<span style="display:block;width:16px;height:16px;border-radius:9999px;background:#6b4a34;border:3px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.25)"></span>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })
      L.marker([lat, lng], { icon: ikon, interactive: false }).addTo(peta)
    })

    return () => {
      batal = true
      peta?.remove()
    }
  }, [lat, lng])

  return (
    <div
      ref={kontainerRef}
      role="img"
      aria-label="Peta lokasi permintaan bantuan"
      className="h-48 w-full rounded-lg border border-line"
    />
  )
}
