const DASAR_INPUT = [
  'w-full rounded-lg border bg-surface px-3 py-2.5',
  // 16px: di bawah itu iOS otomatis nge-zoom pas field disentuh.
  'text-base text-ink placeholder:text-ink-muted/60',
  'focus:outline-2 focus:outline-offset-0 focus:outline-primary',
].join(' ')

type Props = {
  label: string
  htmlFor: string
  /* Satu baris pesan, satu tempat: bantuan diganti error waktu salah,
     jadi layout nggak melompat pas error muncul. */
  bantuan?: string
  error?: string
  children: React.ReactNode
}

export function Field({ label, htmlFor, bantuan, error, children }: Props) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      <p className={`mt-1.5 text-sm ${error ? 'text-danger' : 'text-ink-muted'}`}>
        {error ?? bantuan ?? '\u00A0'}
      </p>
    </div>
  )
}

export function kelasInput(adaError?: boolean) {
  return `${DASAR_INPUT} ${adaError ? 'border-danger' : 'border-line'}`
}
