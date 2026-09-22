'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

/*
  Tanpa ini, koneksi putus kelihatan sama persis dengan aplikasi yang error:
  tombol ditekan, nggak terjadi apa-apa, user nyalahin aplikasinya.

  Status awalnya sengaja "online". navigator cuma ada di browser, dan render
  pertama terjadi di server -- nebak di sana bikin HTML server dan client beda.
*/
export function PenandaOffline() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const perbarui = () => setOffline(!navigator.onLine)
    perbarui()

    window.addEventListener('online', perbarui)
    window.addEventListener('offline', perbarui)
    return () => {
      window.removeEventListener('online', perbarui)
      window.removeEventListener('offline', perbarui)
    }
  }, [])

  if (!offline) return null

  return (
    <p
      role="status"
      className="flex items-center justify-center gap-2 bg-stone-900 px-4 py-2 text-center text-sm font-semibold text-white"
    >
      <WifiOff className="size-4 shrink-0" aria-hidden />
      Koneksi terputus. Data yang tampil mungkin sudah tidak terbaru.
    </p>
  )
}
