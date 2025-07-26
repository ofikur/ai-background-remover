# VanishBG - AI Background Remover v1.0

![VanishBG Showcase](screenshot/VanishBg.jpg)

VanishBG adalah sebuah aplikasi web modern yang memungkinkan pengguna untuk menghapus latar belakang dari gambar secara otomatis menggunakan kekuatan AI. Proyek ini dibangun dengan antarmuka yang bersih, responsif, dan mudah digunakan.

## ✨ Fitur Utama

- **Penghapus Latar Belakang AI**: Menggunakan model `rembg` untuk secara cerdas memisahkan objek dari latar belakang.
- **Latar Belakang Kustom**: Ganti latar belakang dengan warna solid pilihan atau biarkan transparan.
- **Antarmuka Interaktif**: Fitur unggah gambar dengan cara klik atau *drag-and-drop*.
- **Desain Responsif**: Tampilan optimal di perangkat desktop maupun mobile.
- **Download Resolusi Asli**: Unduh hasil editan dalam format PNG dengan kualitas dan resolusi asli.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan arsitektur monorepo sederhana yang terdiri dari frontend dan backend.

### Frontend (Antarmuka Pengguna)
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)

### Backend (API & AI)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Model AI**: [rembg](https://github.com/danielgatis/rembg)
- **Pemrosesan Gambar**: [Pillow](https://python-pillow.org/)

---

## 🚀 Instalasi & Cara Menjalankan

Untuk menjalankan proyek ini di komputermu, pastikan kamu sudah memiliki **Node.js** (v18+) dan **Python** (v3.9-3.11).

### 1. Backend (Server AI)

Buka terminal, lalu jalankan perintah berikut dari direktori utama proyek.

```bash
# Masuk ke direktori backend
cd backend

# Buat dan aktifkan virtual environment
python -m venv venv
.\venv\Scripts\activate

# Instal semua pustaka yang dibutuhkan
pip install -r requirements.txt

# Jalankan server FastAPI
python -m uvicorn main:app --reload
```
> Server backend akan berjalan di `http://localhost:8000`.

### 2. Frontend (Aplikasi Web)

Buka terminal **baru**, lalu jalankan perintah berikut dari direktori utama proyek.

```bash
# Masuk ke direktori frontend
cd frontend

# Instal semua dependensi Node.js
npm install

# Jalankan server pengembangan Next.js
npm run dev
```
> Aplikasi frontend akan berjalan di `http://localhost:3000`. Buka alamat ini di browser.

---

## 📜 Lisensi

Proyek ini dirilis di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

---

### Terima Kasih 
#### ~ Ofikur R.
