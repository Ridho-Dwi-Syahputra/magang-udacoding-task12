'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, kelasInput } from '@/components/ui/field'
import { perbaruiNama } from '@/lib/actions/profil'
import type { StatusProfil } from '@/lib/actions/profil'

const AWAL: StatusProfil = null

export function FormNama({ namaSekarang }: { namaSekarang: string }) {
  const [status, kirim, memproses] = useActionState(perbaruiNama, AWAL)

  return (
    <form action={kirim} className="space-y-1" noValidate>
      {status?.error && (
        <p role="alert" className="mb-4 rounded-lg border border-danger/30 p-3 text-sm text-danger">
          {status.error}
        </p>
      )}
      {status?.sukses && (
        <p className="mb-4 rounded-lg bg-primary-soft p-3 text-sm text-ink">{status.sukses}</p>
      )}

      <Field label="Nama" htmlFor="nama" bantuan="Nama ini yang tampil di papan bantuan.">
        <input
          id="nama"
          name="nama"
          type="text"
          required
          minLength={3}
          maxLength={60}
          defaultValue={namaSekarang}
          autoComplete="name"
          className={kelasInput()}
        />
      </Field>

      <Button type="submit" memproses={memproses} labelProses="Menyimpan..." className="mt-2">
        Simpan Nama
      </Button>
    </form>
  )
}
