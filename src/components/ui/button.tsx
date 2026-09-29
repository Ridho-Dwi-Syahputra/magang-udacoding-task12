import { Loader2 } from 'lucide-react'

type Varian = 'primary' | 'secondary' | 'ghost' | 'danger'
type Ukuran = 'md' | 'sm'

const VARIAN: Record<Varian, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary',
  secondary:
    'bg-surface text-ink border border-line hover:bg-primary-soft focus-visible:outline-primary',
  ghost: 'text-primary hover:bg-primary-soft focus-visible:outline-primary',
  danger: 'text-danger border border-danger/30 hover:bg-danger/5 focus-visible:outline-danger',
}

// min-h 44px: target sentuh di HP.
const UKURAN: Record<Ukuran, string> = {
  md: 'min-h-11 px-5 text-[0.9375rem]',
  sm: 'min-h-9 px-3 text-sm',
}

export function gayaTombol(varian: Varian = 'primary', ukuran: Ukuran = 'md') {
  return [
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
    'transition-colors duration-150 active:scale-[0.98]',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100',
    VARIAN[varian],
    UKURAN[ukuran],
  ].join(' ')
}

type Props = React.ComponentProps<'button'> & {
  varian?: Varian
  ukuran?: Ukuran
  memproses?: boolean
  labelProses?: string
}

export function Button({
  varian = 'primary',
  ukuran = 'md',
  memproses = false,
  labelProses,
  className = '',
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || memproses}
      aria-busy={memproses || undefined}
      className={`${gayaTombol(varian, ukuran)} ${className}`}
    >
      {memproses && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {memproses && labelProses ? labelProses : children}
    </button>
  )
}
