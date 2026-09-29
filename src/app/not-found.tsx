import Link from 'next/link'
import { gayaTombol } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="max-w-md py-12">
      <h1 className="font-display text-xl font-extrabold text-ink">Halamannya tidak ada</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Permintaan yang kamu cari mungkin sudah dihapus pemiliknya, atau alamatnya salah ketik.
      </p>
      <Link href="/bantuan" className={`${gayaTombol('primary')} mt-6`}>
        Kembali ke papan
      </Link>
    </div>
  )
}
