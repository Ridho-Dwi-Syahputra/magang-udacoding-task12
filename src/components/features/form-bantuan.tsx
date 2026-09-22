'use client'

import { useActionState, useState } from 'react'
import { AlertCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, kelasInput } from '@/components/ui/field'
import { buatBantuan, type StatusBantuan } from '@/lib/actions/bantuan'
import { BATAS_DESKRIPSI, BATAS_JUDUL, BATAS_LOKASI, INFO_KATEGORI, KATEGORI } from '@/lib/constants'

const AWAL: StatusBantuan = null

export function FormBantuan() {
  const [status, kirim, memproses] = useActionState(buatBantuan, AWAL)
  const [panjangDeskripsi, setPanjangDeskripsi] = useState(0)

  const field = status?.field ?? {}
  const nilai = status?.nilai ?? {}

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
        <legend className="mb-1.5 block text-sm font-semibold text-stone-700">Kategori</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {KATEGORI.map((kategori) => {
            const { label, ikon: Ikon, teks } = INFO_KATEGORI[kategori]
            return (
              <label
                key={kategori}
                className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-stone-300 bg-surface px-3 text-sm font-medium text-stone-700 has-checked:border-primary has-checked:bg-primary-soft has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
              >
                <input
                  type="radio"
                  name="category"
                  value={kategori}
                  defaultChecked={nilai.category === kategori}
                  className="size-4 accent-teal-700"
                />
                <Ikon className={`size-4 ${teks}`} aria-hidden />
                {label}
              </label>
            )
          })}
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
          placeholder="Kapan dibutuhkan, berapa banyak, dan hal lain yang perlu diketahui calon penolong."
          aria-invalid={Boolean(field.description)}
          className={`${kelasInput(Boolean(field.description))} resize-y`}
        />
      </Field>

      <Field
        label="Lokasi"
        htmlFor="location"
        bantuan="RT/RW, kelurahan, atau patokan yang gampang dicari."
        error={field.location}
      >
        <input
          id="location"
          name="location"
          type="text"
          required
          maxLength={BATAS_LOKASI}
          defaultValue={nilai.location}
          placeholder="Contoh: RT 03 / RW 05, Kel. Jati, Padang"
          aria-invalid={Boolean(field.location)}
          className={kelasInput(Boolean(field.location))}
        />
      </Field>

      <Button
        type="submit"
        memproses={memproses}
        labelProses="Menempel..."
        className="mt-2 w-full sm:w-auto"
      >
        <Send className="size-4" aria-hidden />
        Tempel di Papan
      </Button>
    </form>
  )
}
