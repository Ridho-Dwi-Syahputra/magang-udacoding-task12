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
