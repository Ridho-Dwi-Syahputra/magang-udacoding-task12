'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, kelasInput } from '@/components/ui/field'
import { login, type StatusForm } from '@/lib/actions/auth'

const AWAL: StatusForm = null

export function FormLogin({ lanjut, galat }: { lanjut: string; galat?: string }) {
  const [status, kirim, memproses] = useActionState(login, AWAL)
  const pesan = status?.error ?? galat

  return (
    <form action={kirim} className="space-y-1" noValidate>
      <input type="hidden" name="lanjut" value={lanjut} />

      {pesan && (
        <p role="alert" className="mb-4 rounded-lg border border-danger/30 p-3 text-sm text-danger">
          {pesan}
        </p>
      )}

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="nama@email.com"
          className={kelasInput()}
        />
      </Field>

      <Field label="Kata sandi" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={kelasInput()}
        />
      </Field>

      <Button type="submit" memproses={memproses} labelProses="Masuk..." className="mt-2 w-full">
        Masuk
      </Button>
    </form>
  )
}
