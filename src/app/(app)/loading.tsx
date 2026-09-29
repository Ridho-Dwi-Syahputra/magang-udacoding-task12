export default function Loading() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-6">
      <div className="h-10 w-48 rounded-lg bg-line/50"></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 w-full rounded-card bg-line/30"></div>
        ))}
      </div>
    </div>
  )
}
