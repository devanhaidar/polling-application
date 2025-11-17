# PMI Awards 2025 - Polling Application

Aplikasi polling internal yang interaktif dan menyenangkan untuk PMI Awards 2025, dibangun dengan React, Vite, Framer Motion, dan Tailwind CSS.

## 🚀 Fitur

- ✨ Animasi halus dengan Framer Motion
- 🎨 UI modern dengan Tailwind CSS
- 🎵 Dukungan audio (use-sound)
- 📱 Responsive design
- 🎯 Voting system yang interaktif
- 📊 Halaman Results dengan animasi bar chart
- ⚙️ Halaman Customize untuk edit kategori dan kandidat
- 🔌 Backend Express.js dengan API endpoints
- 💾 Data persistence dengan file JSON

## 📦 Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan aplikasi (Frontend + Backend):
```bash
npm run dev:all
```

Atau jalankan terpisah:
- Frontend saja: `npm run dev`
- Backend saja: `npm run dev:server`

3. Build untuk production:
```bash
npm run build
```

## 📁 Struktur Project

```
/
  /server              - Backend Express.js
    /data
      categories.json  - Data kategori (server-side)
      votes.json       - Data voting (server-side)
    server.js         - Express server dengan API endpoints
  /src
    /components
      /CategoryCard    - Komponen kartu kategori dengan animasi hover
      /VotingModal     - Modal untuk voting dengan animasi konfirmasi
      /ResultsChart    - Chart hasil voting dengan animasi bar chart
      /Layout          - Layout wrapper dengan header dan navigation
    /pages
      HomePage.jsx     - Halaman utama dengan grid kategori
      ResultsPage.jsx  - Halaman hasil voting dengan chart animasi
      CustomizePage.jsx - Halaman untuk edit kategori dan kandidat
    /hooks
      useVoteData.js   - Hook untuk mengelola data voting (API integration)
      useAudioPlayer.js - Hook untuk mengelola audio player
    /services
      api.js           - Service layer untuk semua API calls
    /assets
      /sounds          - File audio (award_reveal.mp3, vote_click.mp3)
      /images          - File gambar
```

## 🎨 Customisasi Data

Ada 2 cara untuk customisasi:

1. **Via UI (Recommended)**: 
   - Buka halaman `/customize` di aplikasi
   - Edit kategori dan kandidat langsung dari UI
   - Klik "Simpan Perubahan" untuk menyimpan

2. **Via File**:
   - Edit file `/server/data/categories.json` secara manual
   - Restart server untuk menerapkan perubahan

## 🛠️ Tech Stack

**Frontend:**
- **React 18** - UI Framework
- **Vite** - Build tool
- **Framer Motion** - Animasi
- **Tailwind CSS** - Styling
- **use-sound** - Audio player
- **React Router DOM** - Navigation

**Backend:**
- **Express.js** - Server framework
- **CORS** - Cross-origin resource sharing
- **File System** - Data storage (JSON files)

## 🔌 API Endpoints

- `GET /api/categories` - Ambil semua kategori
- `GET /api/results` - Ambil semua hasil voting
- `GET /api/results/:categoryId` - Ambil hasil per kategori
- `POST /api/vote` - Submit vote (body: { categoryId, candidateName })
- `PUT /api/categories` - Update kategori (untuk customisasi)
- `GET /api/votes` - Ambil semua data vote (untuk admin)
- `GET /api/health` - Health check

## 📝 Catatan

- Backend berjalan di port **3001** (default)
- Frontend berjalan di port **5173** (Vite default)
- Data voting disimpan di `/server/data/votes.json`
- Data kategori disimpan di `/server/data/categories.json`
- File audio perlu ditambahkan di `/public/sounds/` untuk sound effects
- Semua komponen sudah siap dengan animasi dasar

## 🚀 Cara Menjalankan

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan Frontend + Backend bersamaan:**
   ```bash
   npm run dev:all
   ```

3. **Atau jalankan terpisah:**
   - Terminal 1 (Backend): `npm run dev:server`
   - Terminal 2 (Frontend): `npm run dev`

4. **Akses aplikasi:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

