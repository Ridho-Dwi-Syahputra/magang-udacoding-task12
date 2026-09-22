import Link from 'next/link'
import { MapPinOff } from 'lucide-react'
import { gayaTombol } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <MapPinOff className="mx-auto size-10 text-stone-400" aria-hidden />
      <h1 className="mt-4 font-display text-xl font-extrabold text-ink">Halamannya tidak ada</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Permintaan yang kamu cari mungkin sudah dihapus pemiliknya, atau alamatnya salah ketik.
      </p>
      <Link href="/bantuan" className={`${gayaTombol('primary')} mt-6`}>
        Kembali ke papan
      </Link>
    </div>
  )
}
