const RELATIF = new Intl.RelativeTimeFormat('id', { numeric: 'auto' })
const TANGGAL_PANJANG = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta',
})

const SATUAN: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 1000 * 60 * 60 * 24 * 365],
  ['month', 1000 * 60 * 60 * 24 * 30],
  ['day', 1000 * 60 * 60 * 24],
  ['hour', 1000 * 60 * 60],
  ['minute', 1000 * 60],
]

/** "2 jam lalu". Dirender di server, jadi zona waktunya dipaksa ke WIB. */
export function waktuRelatif(iso: string) {
  const selisih = Date.now() - new Date(iso).getTime()

  for (const [satuan, ms] of SATUAN) {
    if (Math.abs(selisih) >= ms) {
      return RELATIF.format(-Math.round(selisih / ms), satuan)
    }
  }
  return 'baru saja'
}

export function tanggalLengkap(iso: string) {
  return `${TANGGAL_PANJANG.format(new Date(iso))} WIB`
}

/** Format date YYYY-MM-DD menjadi "Senin, 5 Oktober 2026" */
export function formatTanggalDibutuhkan(tanggal: string): string {
  const fmt = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
  return fmt.format(new Date(tanggal + 'T00:00:00'))
}
