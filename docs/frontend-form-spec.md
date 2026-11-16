# Spesifikasi Frontend: Halaman, Komponen, & Formulir Lapor

Dokumen ini mencakup perencanaan halaman, daftar komponen antarmuka, sketsa alur formulir (`/lapor`), serta aturan validasi sisi klien (*client-side validation*) untuk aplikasi **Lost & Found Pacil**.

---

## 1. Daftar Halaman & Rute Aplikasi

| Halaman | Rute | Deskripsi & Konten Utama | Endpoint API Terkait |
| :--- | :--- | :--- | :--- |
| **Daftar Laporan** | `/` | Kolom pencarian (`q`), filter (`type`, `categoryId`, `locationId`), daftar kartu laporan (12 per halaman), paginasi, dan tombol **Lapor barang**. | `GET /categories`, `GET /locations`, `GET /reports` |
| **Detail Laporan** | `/laporan/:id` | Menampilkan foto (atau *placeholder* 4:3), status/jenis (`Hilang`/`Ditemukan`), nama barang, deskripsi lengkap, kategori, lokasi & detail lokasi, tanggal kejadian, nama pelapor, dan satu metode kontak publik terpilih. | `GET /reports/:id` |
| **Formulir Lapor** | `/lapor` | Formulir pengiriman laporan barang hilang atau ditemukan beserta opsi unggah foto. | `GET /categories`, `GET /locations`, `POST /reports` |
| **Tidak Ditemukan** | `*` | Halaman fallback ketika URL tidak dikenali atau ID laporan mengembalikan `404 NOT_FOUND`, dilengkapi tautan kembali ke `/`. | — |

---

## 2. Daftar Komponen UI

1. **`Layout`**: Kerangka utama halaman (*Navbar* dengan judul aplikasi & tombol `Lapor barang`, kontainer konten responsif, dan *Footer*).
2. **`ReportCard`**: Kartu ringkasan laporan di halaman utama berisi thumbnail foto rasio 4:3, badge jenis (`Hilang` / `Ditemukan`), judul barang, kategori, lokasi, dan tanggal kejadian.
3. **`ReportGrid`**: Tata letak grid responsif (*mobile-first*: 1 kolom `< 640px`, 2 kolom `>= 640px`, 3 kolom `>= 1024px`).
4. **`FilterBar`**: Bilah pencarian dengan *debounce* 300 ms dan dropdown filter jenis, kategori, serta lokasi (menjadi panel lipat pada layar kecil) yang tersinkronisasi dengan parameter URL.
5. **`Pagination`**: Navigasi perpindahan halaman berdasarkan `page` dan `totalPages` dari respons `meta` API.
6. **`ReportForm`**: Formulir terkendali (*controlled inputs*) untuk membuat laporan baru dengan validasi *on-blur* dan *on-submit*, tombol nonaktif saat mengirim, serta pemetaan pesan galat server (`details`) ke masing-masing kolom.
7. **`PhotoPicker`**: Komponen pemilih file gambar dengan pratinjau lokal, pemeriksaan tipe (`JPEG`, `PNG`, `WebP`) & ukuran maks 5 MB sebelum dikirim, serta tombol hapus pilihan foto.
8. **`ContactInfo`**: Komponen penampil metode kontak terpilih pelapor di halaman detail beserta tombol aksi langsung (tautan `wa.me` atau `mailto`).
9. **`ImageWithFallback`**: Pembungkus tag `<img>` dengan rasio tetap 4:3 dan teks `alt` yang otomatis menampilkan aset gambar *placeholder* bawaan jika `photoUrl` bernilai `null` atau gagal dimuat (`onError`).
10. **`StateMessage`**: Komponen seragam untuk menangani tiga kondisi antarmuka: **Memuat** (*skeleton*/spinner), **Galat** (pesan ramah + tombol `Coba lagi`), dan **Kosong** (pesan informatif + tombol `Reset filter`).

---

## 3. Sketsa Formulir Lapor (`/lapor`)

```text
+-------------------------------------------------------------------+
|  [ <- Kembali ke Daftar ]                                         |
|  Buat Laporan Barang Hilang / Ditemukan                           |
+-------------------------------------------------------------------+
|  1. Jenis Laporan * (Radio / Segmented Button)                    |
|     ( ) Hilang (LOST)          ( ) Ditemukan (FOUND)              |
|                                                                   |
|  2. Nama Barang * (Text Input)                                    |
|     [ Contoh: Tumbler biru Tupperware                           ] |
|                                                                   |
|  3. Kategori * (Select Dropdown dari GET /categories)             |
|     [ Pilih kategori...                                       v ] |
|                                                                   |
|  4. Lokasi Kejadian * (Select Dropdown dari GET /locations)       |
|     [ Pilih lokasi...                                         v ] |
|                                                                   |
|  5. Keterangan Lokasi (Text Input - Opsional)                     |
|     [ Contoh: Ruangan A206 / Meja dekat pintu masuk             ] |
|                                                                   |
|  6. Tanggal Kejadian * (Date Picker)                              |
|     [ YYYY-MM-DD (Maksimal hari ini)                            ] |
|                                                                   |
|  7. Deskripsi & Ciri Barang * (Textarea)                          |
|     [ Jelaskan warna, merek, stiker, atau ciri khusus...        ] |
|                                                                   |
|  8. Foto Barang (PhotoPicker - Opsional)                          |
|     +-----------------------------------------------------------+ |
|     |  [ Pilih Foto (JPEG/PNG/WebP, Maks 5 MB) ]                | |
|     |  (Area Pratinjau Gambar 4:3 jika file dipilih)            | |
|     +-----------------------------------------------------------+ |
|                                                                   |
|  9. Metode Kontak Publik * (Radio Button)                         |
|     ( ) WhatsApp   ( ) LINE   ( ) Instagram   ( ) Email           |
|     Info: "Kontak ini akan tampil untuk semua pengunjung."        |
|                                                                   |
| 10. Detail Kontak * (Text Input - Placeholder dinamis)            |
|     [ Contoh: 08123456789                                       ] |
|                                                                   |
| 11. Nama Pelapor (Text Input - Opsional)                          |
|     [ Contoh: Faris (Kosongkan jika ingin anonim)               ] |
|                                                                   |
|  [                 Kirim Laporan (Submit Button)                ] |
+-------------------------------------------------------------------+