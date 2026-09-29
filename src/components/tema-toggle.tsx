'use client'

import { useSyncExternalStore } from 'react'

const KUNCI = 'tema'
const pendengar = new Set<() => void>()

function baca(): boolean {
  const tersimpan = localStorage.getItem(KUNCI)
  if (tersimpan) return tersimpan === 'gelap'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// null = belum tahu (render pertama di server, localStorage belum kebaca).
// Placeholder-nya dipasang selama ini biar tombol di sebelahnya nggak geser.
function bacaServer(): boolean | null {
  return null
}

function subscribe(callback: () => void) {
  pendengar.add(callback)
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', callback)
  return () => {
    pendengar.delete(callback)
    media.removeEventListener('change', callback)
  }
}

/* Nulis tema itu efek samping (DOM + localStorage), bukan sekadar ganti
   state komponen -- makanya lewat store kecil ini, bukan useState biasa.
   pendengar.forEach di akhir yang bikin label tombol ikut update seketika,
   soalnya nulis localStorage doang nggak otomatis motret ulang komponennya. */
function setTema(gelap: boolean) {
  document.documentElement.setAttribute('data-theme', gelap ? 'dark' : 'light')
  localStorage.setItem(KUNCI, gelap ? 'gelap' : 'terang')
  pendengar.forEach((cb) => cb())
}

/*
  Teks polos ("Mode Gelap" / "Mode Terang"), bukan ikon matahari-bulan --
  konsisten sama sisa halaman yang nggak pakai ikon dekoratif.
*/
export function TemaToggle({ className = '' }: { className?: string }) {
  const gelap = useSyncExternalStore<boolean | null>(subscribe, baca, bacaServer)

  const dasar =
    'min-h-9 rounded-lg border border-line px-3 text-sm font-semibold text-ink hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

  if (gelap === null) {
    return (
      <span className={`${dasar} ${className} invisible`} aria-hidden>
        Mode Gelap
      </span>
    )
  }

  return (
    <button type="button" onClick={() => setTema(!gelap)} className={`${dasar} ${className}`}>
      {gelap ? 'Mode Terang' : 'Mode Gelap'}
    </button>
  )
}
