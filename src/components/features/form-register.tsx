'use client'

import { useActionState } from 'react'
import { AlertCircle, CheckCircle2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, kelasInput } from '@/components/ui/field'
import { register, type StatusForm } from '@/lib/actions/auth'

const AWAL: StatusForm = null

export function FormRegister() {
  const [status, kirim, memproses] = useActionState(register, AWAL)

  // Kalau konfirmasi email masih nyala di Supabase, sesi belum kebentuk.
  // Form-nya diganti kabar ini, bukan cuma toast yang lewat begitu saja.
  if (status?.sukses) {
    return (
      <p className="flex items-start gap-2 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
        {status.sukses}
      </p>
    )
  }

  return (
    <form action={kirim} className="space-y-1" noValidate>
      {status?.error && (
        <p
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {status.error}
        </p>
      )}

      <Field label="Nama" htmlFor="nama" bantuan="Nama ini yang tampil di papan bantuan.">
        <input
          id="nama"
          name="nama"
          type="text"
          required
          minLength={3}
          maxLength={60}
          autoComplete="name"
          placeholder="Ridho Dwi Syahputra"
          className={kelasInput()}
        />
      </Field>

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

      <Field label="Kata sandi" htmlFor="password" bantuan="Minimal 8 karakter.">
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="••••••••"
          className={kelasInput()}
        />
      </Field>

      <Button type="submit" memproses={memproses} labelProses="Mendaftar..." className="mt-2 w-full">
        <UserPlus className="size-4" aria-hidden />
        Buat Akun
      </Button>
    </form>
  )
}
