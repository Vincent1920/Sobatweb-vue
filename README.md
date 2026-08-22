# SobatWeb

**School Website Builder**

SobatWeb adalah platform website builder dan content management yang membantu sekolah membuat, mengelola, mengedit, dan mempublikasikan website sekolah melalui visual editor.

## About

SobatWeb menyediakan dashboard terpusat untuk mengelola identitas dan konten website sekolah. Pengguna sekolah dapat menyusun halaman dan section, menyesuaikan tema serta metadata SEO, melihat hasilnya dalam beberapa ukuran perangkat, lalu mempublikasikan website melalui backend SobatBE.

## Features

- Autentikasi pengguna dengan registrasi, login, pemulihan sesi, refresh token, logout, serta pembatasan rute berdasarkan peran sekolah atau admin.
- Dashboard sekolah dan dashboard admin.
- Visual website editor dengan preview langsung.
- Pengelolaan halaman: membuat, mengubah, menghapus, memilih, dan menetapkan halaman utama.
- Pengelolaan section: menambah dari preset, mengubah, menduplikasi, mengurutkan, menyembunyikan, dan menghapus.
- Penyesuaian tema website, termasuk palet warna, tipografi, dan radius sudut.
- Pengaturan metadata SEO dan Open Graph image.
- Pengaturan profil sekolah dan zona waktu.
- Preview website publik berdasarkan subdomain dan slug halaman.
- Preview responsif untuk desktop, tablet, dan mobile.
- Publikasi website melalui SobatBE API.
- Penyimpanan manual dan autosave untuk perubahan editor, disertai status kegagalan dan mekanisme retry.
- Integrasi REST API terpusat menggunakan Axios dan state management Pinia.

## Tech Stack

Frontend:

- Vue 3 (`^3.5.40`)
- TypeScript (`~6.0.2`)
- Vite (`^8.2.0`)
- Tailwind CSS (`^4.3.3`)
- Pinia (`^4.0.3`)
- Axios (`^1.19.0`)
- Vue Router (`^5.2.0`)

Backend menggunakan aplikasi terpisah bernama **SobatBE**.

## Project Structure

```text
src/
├── assets/       # Gambar dan stylesheet global
├── components/   # Komponen UI umum, layout, dan visual editor
├── data/         # Preset section dan data mock pengembangan
├── layouts/      # Shell halaman untuk auth, dashboard, admin, editor, dan situs publik
├── router/       # Definisi rute, metadata, dan navigation guards
├── services/     # Client Axios dan akses endpoint SobatBE
├── stores/       # State dan aksi aplikasi berbasis Pinia
├── types/        # Tipe dan interface TypeScript
├── utils/        # Utilitas storage, tanggal, dan penanganan error
└── views/        # Halaman auth, dashboard, admin, editor, onboarding, dan situs publik
```

## Installation

```bash
git clone https://github.com/Vincent1920/Sobatweb-vue.git
cd Sobatweb-vue
npm install
```

## Environment Configuration

Salin konfigurasi contoh sebelum menjalankan aplikasi:

```bash
cp .env.example .env
```

Variabel yang tersedia di `.env.example`:

- `VITE_API_BASE_URL` — base URL REST API SobatBE.
- `VITE_USE_MOCKS` — mengaktifkan atau menonaktifkan data mock untuk pengembangan.

Sesuaikan nilainya dengan environment lokal. Jangan commit file `.env` atau kredensial ke repository.

## Development

```bash
npm run dev
```

Vite menggunakan alamat development standar yang ditampilkan di terminal saat server berjalan.

Pemeriksaan TypeScript dapat dijalankan dengan:

```bash
npm run type-check
```

## Production Build

```bash
npm run build
```

Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

## Frontend-Backend Architecture

```text
Sobatweb-vue
     │
     │ REST API
     ▼
   SobatBE
     │
     ▼
    MySQL
```

Alur akses data utama:

```text
Vue Component → Pinia Store → Service → Axios → SobatBE API → Database
```

## Data Persistence

Perubahan pada state lokal atau Pinia belum berarti data sudah tersimpan secara permanen. Penyimpanan mengikuti alur berikut:

```text
User Edit
    ↓
Local / Pinia State
    ↓
Save / Autosave
    ↓
REST API
    ↓
SobatBE
    ↓
MySQL
```

Data hanya dapat dianggap tersimpan setelah request API berhasil. Jika request gagal, editor mempertahankan status error atau perubahan yang belum tersimpan dan tidak mengklaim bahwa data sudah masuk ke database.

## Documentation

Product requirements tersedia di [PRD.md](./PRD.md).

## Copyright

Copyright © 2026 Vincent Luhulima.  
All Rights Reserved.

This project and its source code are proprietary. Unauthorized copying, modification, distribution, publication, or commercial use is prohibited without prior written permission from the copyright holder.
