'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, kelasInput } from '@/components/ui/field'
import { LokasiField } from '@/components/features/lokasi-field'
import { buatBantuan, type StatusBantuan } from '@/lib/actions/bantuan'
import { BATAS_DESKRIPSI, BATAS_JUDUL, KATEGORI, LABEL_KATEGORI } from '@/lib/constants'

const AWAL: StatusBantuan = null

export function FormBantuan() {
  const [status, kirim, memproses] = useActionState(buatBantuan, AWAL)
  const [panjangDeskripsi, setPanjangDeskripsi] = useState(0)

  const field = status?.field ?? {}
  const nilai = status?.nilai ?? {}

  return (
    <form action={kirim} className="space-y-5" noValidate>
      {status?.error && (
        <p role="alert" className="mb-4 rounded-lg border border-danger/30 p-3 text-sm text-danger">
          {status.error}
        </p>
      )}

      <Field
        label="Butuh bantuan apa?"
        htmlFor="title"
        bantuan="Tulis singkat dan jelas, seperti judul pengumuman."
        error={field.title}
      >
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={BATAS_JUDUL}
          defaultValue={nilai.title}
          placeholder="Contoh: Butuh pendonor darah O+ untuk operasi besok"
          aria-invalid={Boolean(field.title)}
          className={kelasInput(Boolean(field.title))}
        />
      </Field>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-semibold text-ink">Kategori</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {KATEGORI.map((kategori) => (
            <label
              key={kategori}
              className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink has-checked:border-primary has-checked:bg-primary-soft has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
            >
              <input
                type="radio"
                name="category"
                value={kategori}
                defaultChecked={nilai.category === kategori}
                className="size-4 accent-primary"
              />
              {LABEL_KATEGORI[kategori]}
            </label>
          ))}
        </div>
        <p className={`mt-1.5 text-sm ${field.category ? 'text-danger' : 'text-ink-muted'}`}>
          {field.category ?? '\u00A0'}
        </p>
      </fieldset>

      <Field
        label="Ceritakan detailnya"
        htmlFor="description"
        bantuan={`Semakin jelas, semakin gampang tetangga memutuskan. ${panjangDeskripsi}/${BATAS_DESKRIPSI}`}
        error={field.description}
      >
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={BATAS_DESKRIPSI}
          defaultValue={nilai.description}
          onChange={(e) => setPanjangDeskripsi(e.target.value.length)}
          placeholder="Berapa banyak, dan detail lain yang perlu diketahui calon penolong."
          aria-invalid={Boolean(field.description)}
          className={`${kelasInput(Boolean(field.description))} resize-y`}
        />
      </Field>

      <LokasiField
        error={field.location}
        awal={{
          location: nilai.location ?? '',
          latitude: nilai.latitude ?? '',
          longitude: nilai.longitude ?? '',
        }}
      />

      <Field
        label="Dibutuhkan sebelum"
        htmlFor="dibutuhkan_tanggal"
        bantuan="Opsional. Biar penolong tahu batas waktunya."
        error={field.dibutuhkan_tanggal}
      >
        <input
          id="dibutuhkan_tanggal"
          name="dibutuhkan_tanggal"
          type="date"
          defaultValue={nilai.dibutuhkan_tanggal}
          min={new Date().toISOString().split('T')[0]}
          aria-invalid={Boolean(field.dibutuhkan_tanggal)}
          className={kelasInput(Boolean(field.dibutuhkan_tanggal))}
        />
      </Field>

      <Button
        type="submit"
        memproses={memproses}
        labelProses="Menempel..."
        className="mt-6 w-full sm:w-auto"
      >
        Tempel di Papan
      </Button>
    </form>
  )
}
