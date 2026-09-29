'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { kelasInput } from '@/components/ui/field'

type Props = {
  id: string
  name: string
  autoComplete?: string
  minLength?: number
  required?: boolean
}

/* Satu-satunya ikon yang dipertahankan di seluruh form -- fungsinya nyata
   (nunjukkin/nyembunyiin ketikan), bukan pemanis. */
export function InputSandi({ id, name, autoComplete, minLength, required = true }: Props) {
  const [terlihat, setTerlihat] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={terlihat ? 'text' : 'password'}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className={`${kelasInput()} pr-11`}
      />
      <button
        type="button"
        onClick={() => setTerlihat((v) => !v)}
        aria-label={terlihat ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
      >
        {terlihat ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  )
}
