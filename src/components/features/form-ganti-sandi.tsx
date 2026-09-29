'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { InputSandi } from '@/components/ui/input-sandi'
import { perbaruiSandi } from '@/lib/actions/profil'
import type { StatusProfil } from '@/lib/actions/profil'

const AWAL: StatusProfil = null

export function FormGantiSandi() {
  const [status, kirim, memproses] = useActionState(perbaruiSandi, AWAL)
  const formRef = useRef<HTMLFormElement>(null)

  // Berhasil ganti sandi: kosongin lagi field-nya, jangan biarin sandi lama
  // tetap keketik di layar.
  useEffect(() => {
    if (status?.sukses) formRef.current?.reset()
  }, [status])

  return (
    <form ref={formRef} action={kirim} className="space-y-1" noValidate>
      {status?.error && (
        <p role="alert" className="mb-4 rounded-lg border border-danger/30 p-3 text-sm text-danger">
          {status.error}
        </p>
      )}
      {status?.sukses && (
        <p className="mb-4 rounded-lg bg-primary-soft p-3 text-sm text-ink">{status.sukses}</p>
      )}

      <Field label="Kata Sandi Saat Ini" htmlFor="sandiSaatIni">
        <InputSandi id="sandiSaatIni" name="sandiSaatIni" autoComplete="current-password" />
      </Field>

      <Field label="Kata Sandi Baru" htmlFor="sandiBaru" bantuan="Minimal 8 karakter.">
        <InputSandi id="sandiBaru" name="sandiBaru" autoComplete="new-password" minLength={8} />
      </Field>

      <Button type="submit" memproses={memproses} labelProses="Mengganti..." className="mt-2">
        Ganti Kata Sandi
      </Button>
    </form>
  )
}
