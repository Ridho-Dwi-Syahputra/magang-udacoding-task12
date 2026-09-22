import { SkeletonKartu } from '@/components/ui/states'

/* Skeleton-nya sengaja niru bentuk kartu asli (strip warna, judul, dua baris
   teks) supaya pas datanya datang, layoutnya nggak bergeser. */
export default function Loading() {
  return (
    <div>
      <div className="mb-5 h-9 w-56 animate-pulse rounded bg-stone-200" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-28 animate-pulse rounded-full bg-stone-200" />
        ))}
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i}>
            <SkeletonKartu />
          </li>
        ))}
      </ul>
    </div>
  )
}
