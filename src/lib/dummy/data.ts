import type { Kategori, Status } from '@/lib/constants'

export type PenggunaDummy = { id: string; nama: string; email: string; password: string }

export type BarisDummy = {
  id: string
  title: string
  description: string
  category: Kategori
  location: string
  latitude: number | null
  longitude: number | null
  status: Status
  user_id: string
  helper_id: string | null
  helped_at: string | null
  confirmed_at: string | null
  created_at: string
}

type Isi = { pengguna: PenggunaDummy[]; baris: BarisDummy[] }

export const SANDI_AWAL = 'warga12345'

const jamLalu = (n: number) => new Date(Date.now() - n * 3_600_000).toISOString()

function awal(): Isi {
  const pengguna: PenggunaDummy[] = [
    { id: 'u-sari', nama: 'Sari Wulandari', email: 'sari@email.com', password: SANDI_AWAL },
    { id: 'u-budi', nama: 'Budi Santoso', email: 'budi@email.com', password: SANDI_AWAL },
    { id: 'u-rina', nama: 'Rina Marlina', email: 'rina@email.com', password: SANDI_AWAL },
  ]

  const baris: BarisDummy[] = [
    {
      id: 'b-01',
      title: 'Butuh pendonor darah O+ untuk operasi besok',
      description:
        'Ibu saya dijadwalkan operasi hari Rabu pagi di RSUP M. Djamil dan stok darah O+ di PMI sedang kosong. Butuh 2 kantong.\n\nBiaya transport pendonor kami ganti. Hubungi lewat ketua RT.',
      category: 'medis',
      location: 'RT 03 / RW 05, Kel. Jati, Padang',
      latitude: -0.939,
      longitude: 100.372,
      status: 'menunggu',
      user_id: 'u-sari',
      helper_id: null,
      helped_at: null,
      confirmed_at: null,
      created_at: jamLalu(2),
    },
    {
      id: 'b-02',
      title: 'Pinjam kursi roda untuk seminggu',
      description:
        'Bapak baru jatuh di kamar mandi dan belum bisa jalan jauh. Kalau ada warga yang punya kursi roda nganggur, boleh dipinjam sekitar seminggu. Dijemput sendiri.',
      category: 'alat',
      location: 'Komplek Griya Insani Blok C, Kuranji',
      latitude: -0.901,
      longitude: 100.401,
      // Contoh status "diproses": Rina udah nawarin, tinggal nunggu Budi
      // (pemilik postingan) konfirmasi beneran udah dipinjemin apa belum.
      status: 'diproses',
      user_id: 'u-budi',
      helper_id: 'u-rina',
      helped_at: jamLalu(1),
      confirmed_at: null,
      created_at: jamLalu(9),
    },
    {
      id: 'b-03',
      title: 'Bantuan sembako untuk keluarga Pak Yanto',
      description:
        'Pak Yanto baru kena PHK dan punya tiga anak yang masih sekolah. Warga yang mau nyumbang beras, minyak, atau telur bisa titip ke pos ronda RT 02.',
      category: 'sembako',
      location: 'Pos Ronda RT 02, Kel. Surau Gadang',
      latitude: -0.925,
      longitude: 100.37,
      status: 'menunggu',
      user_id: 'u-rina',
      helper_id: null,
      helped_at: null,
      confirmed_at: null,
      created_at: jamLalu(26),
    },
    {
      id: 'b-04',
      title: 'Cari 5 relawan untuk gotong royong bersihkan drainase',
      description:
        'Drainase depan musala mampet dan tiap hujan air masuk ke rumah warga. Rencana kerja bakti Minggu pagi jam 7. Alat disediakan, konsumsi ditanggung RT.',
      category: 'relawan',
      location: 'Musala Al-Ikhlas, RW 04, Nanggalo',
      latitude: -0.921,
      longitude: 100.373,
      status: 'menunggu',
      user_id: 'u-sari',
      helper_id: null,
      helped_at: null,
      confirmed_at: null,
      created_at: jamLalu(50),
    },
    {
      id: 'b-05',
      title: 'Pinjam tenda dan kursi untuk pengajian',
      description:
        'Butuh 1 tenda ukuran 4x6 dan sekitar 30 kursi plastik untuk pengajian 40 hari, Sabtu malam. Dibongkar pasang sendiri.',
      category: 'alat',
      location: 'Jl. Gajah Mada No. 21, Padang Utara',
      // Sengaja null: contoh permintaan yang lokasinya diketik manual, tanpa peta.
      latitude: null,
      longitude: null,
      status: 'menunggu',
      user_id: 'u-budi',
      helper_id: null,
      helped_at: null,
      confirmed_at: null,
      created_at: jamLalu(74),
    },
    {
      id: 'b-06',
      title: 'Butuh tabung oksigen portabel',
      description:
        'Kakek sesak napas sejak semalam dan belum dapat rujukan rumah sakit. Sudah dibantu warga sebelah, terima kasih banyak.',
      category: 'medis',
      location: 'RT 01 / RW 02, Kel. Alai Parak Kopi',
      latitude: -0.92,
      longitude: 100.362,
      status: 'selesai',
      user_id: 'u-sari',
      helper_id: 'u-budi',
      helped_at: jamLalu(97),
      confirmed_at: jamLalu(96),
      created_at: jamLalu(120),
    },
    {
      id: 'b-07',
      title: 'Sumbangan beras untuk dapur umum posyandu',
      description:
        'Posyandu Melati kekurangan stok beras untuk PMT balita bulan ini. Berapa pun sangat membantu. Sudah terpenuhi berkat warga RT 05.',
      category: 'sembako',
      location: 'Posyandu Melati, Kel. Lolong Belanti',
      latitude: null,
      longitude: null,
      status: 'selesai',
      user_id: 'u-rina',
      helper_id: 'u-sari',
      helped_at: jamLalu(141),
      confirmed_at: jamLalu(140),
      created_at: jamLalu(168),
    },
    // b-08 ke bawah: sengaja ditambah biar total lewat satu halaman papan
    // (12 per halaman) -- tanpa ini, tombol "Berikutnya" nggak akan pernah
    // kelihatan pas dicoba di mode tanpa Supabase.
    {
      id: 'b-08',
      title: 'Cari relawan ngajar les gratis anak RT 07',
      description:
        'Ada 8 anak SD di RT 07 yang ketinggalan pelajaran matematika. Butuh 1-2 relawan buat ngajar les gratis tiap Sabtu sore, sekitar 1 jam.',
      category: 'relawan',
      location: 'Balai RT 07, Kel. Kuranji',
      latitude: null,
      longitude: null,
      status: 'menunggu',
      user_id: 'u-budi',
      helper_id: null,
      helped_at: null,
      confirmed_at: null,
      created_at: jamLalu(4),
    },
    {
      id: 'b-09',
      title: 'Pinjam mesin pemotong rumput',
      description:
        'Halaman masjid mau dibersihin sebelum acara maulid minggu depan. Kalau ada yang punya mesin pemotong rumput, boleh dipinjam sehari.',
      category: 'alat',
      location: 'Masjid Nurul Iman, Kel. Korong Gadang',
      latitude: -0.912,
      longitude: 100.398,
      status: 'menunggu',
      user_id: 'u-rina',
      helper_id: null,
      helped_at: null,
      confirmed_at: null,
      created_at: jamLalu(6),
    },
    {
      id: 'b-10',
      title: 'Titip galon air buat nenek yang nggak bisa angkat',
      description:
        'Nenek tinggal sendirian dan udah nggak sanggup angkat galon dari warung. Kalau ada yang lewat dan bisa titip anter, sangat membantu.',
      category: 'sembako',
      location: 'RT 04 / RW 01, Kel. Ulak Karang',
      latitude: null,
      longitude: null,
      status: 'menunggu',
      user_id: 'u-sari',
      helper_id: null,
      helped_at: null,
      confirmed_at: null,
      created_at: jamLalu(11),
    },
    {
      id: 'b-11',
      title: 'Antar-jemput cuci darah tiap Selasa dan Kamis',
      description:
        'Bapak cuci darah rutin di RS, tapi keluarga lagi gantian kerja jadi kadang nggak ada yang anter. Butuh yang bisa bantu antar-jemput, jam fleksibel.',
      category: 'medis',
      location: 'Jl. S. Parman, Kel. Ulak Karang Selatan',
      latitude: null,
      longitude: null,
      status: 'menunggu',
      user_id: 'u-budi',
      helper_id: null,
      helped_at: null,
      confirmed_at: null,
      created_at: jamLalu(15),
    },
    {
      id: 'b-12',
      title: 'Bantu packing paket sembako akhir bulan',
      description:
        'RW mau bagi paket sembako buat 30 keluarga akhir bulan ini. Butuh beberapa tangan buat bantu packing hari Jumat siang.',
      category: 'relawan',
      location: 'Kantor RW 03, Kel. Ampang',
      latitude: null,
      longitude: null,
      status: 'menunggu',
      user_id: 'u-rina',
      helper_id: null,
      helped_at: null,
      confirmed_at: null,
      created_at: jamLalu(20),
    },
    {
      id: 'b-13',
      title: 'Pinjam tangga buat betulin genteng bocor',
      description:
        'Genteng bocor pas hujan kemarin, butuh tangga yang cukup tinggi buat naik ke atap. Dikembalikan paling lambat 2 hari.',
      category: 'alat',
      location: 'Komplek Wisma Indah, Kel. Lubuk Buaya',
      latitude: null,
      longitude: null,
      // Contoh kedua status "diproses" di data dummy, biar nggak cuma satu.
      status: 'diproses',
      user_id: 'u-sari',
      helper_id: 'u-rina',
      helped_at: jamLalu(2),
      confirmed_at: null,
      created_at: jamLalu(28),
    },
    {
      id: 'b-14',
      title: 'Nyumbang seragam sekolah bekas yang masih layak',
      description:
        'Ada murid baru yang keluarganya belum sanggup beli seragam. Nyari donasi seragam SD bekas ukuran kelas 3-4 yang masih bagus.',
      category: 'sembako',
      location: 'SDN 12 Air Tawar, Kel. Air Tawar Barat',
      latitude: null,
      longitude: null,
      status: 'menunggu',
      user_id: 'u-budi',
      helper_id: null,
      helped_at: null,
      confirmed_at: null,
      created_at: jamLalu(33),
    },
    {
      id: 'b-15',
      title: 'Cari pendonor plasma konvalesen',
      description:
        'Kakak butuh donor plasma dari orang yang pernah kena penyakit sama dan udah sembuh total. Info lengkap dijelasin lewat chat.',
      category: 'medis',
      location: 'RS Siti Rahmah, Kel. Kalumbuk',
      latitude: null,
      longitude: null,
      status: 'selesai',
      user_id: 'u-rina',
      helper_id: 'u-budi',
      helped_at: jamLalu(51),
      confirmed_at: jamLalu(50),
      created_at: jamLalu(72),
    },
  ]

  return { pengguna, baris }
}

/* Ditaruh di globalThis: modul bisa dimuat ulang saat dev (HMR), dan tanpa ini
   datanya ikut reset tiap file disimpan. Reset penuh = restart server. */
const g = globalThis as unknown as { __dataDummy?: Isi }

export function dataDummy(): Isi {
  if (!g.__dataDummy) g.__dataDummy = awal()
  return g.__dataDummy
}
