# AquaMarket - E-Commerce Ikan Hias

Platform e-commerce cloud untuk jual beli ikan hias (ornamental fish) dengan arsitektur monorepo. Dibangun sebagai project mata kuliah menggunakan tech stack modern.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Redux Toolkit, Tailwind CSS 4, React Router v7 |
| **Backend** | Next.js 16 (App Router), TypeScript 5 |
| **Database** | Supabase (PostgreSQL + Auth + Storage) |
| **State Management** | Redux Toolkit (cart) + Supabase Auth |

## Arsitektur Project

```
e-commerce_cloud/
├── backend/               # Next.js 16 API Server
│   ├── app/api/           # API Routes (App Router)
│   │   ├── products/      # Product CRUD endpoints
│   │   └── categories/    # Category endpoints
│   ├── database/          # Schema & seed files
│   ├── lib/               # Supabase client & helpers
│   └── types/             # TypeScript type definitions
│
├── frontend/              # React + Vite SPA
   ├── src/
   │   ├── components/    # Navbar, Footer, ProductCard
   │   ├── pages/         # Halaman-halaman aplikasi
   │   ├── sections/      # Section komponen homepage
   │   ├── store/         # Redux store & cart slice
   │   ├── data/          # Static data produk
   │   └── lib/           # Supabase client
   └── public/            # Assets & gambar produk


```

## Fitur

### Sudah Diimplementasi

- **Katalog Produk** - Listing produk dengan filter kategori, search, dan badge (Hot/Rare)
- **Kategori** - Freshwater, Saltwater, Rare Fish
- **Autentikasi** - Login, Sign Up via Supabase Auth + Google OAuth
- **Shopping Cart** - Add to cart, update quantity, remove item (Redux state)
- **Checkout** - Form alamat pengiriman, pilihan pembayaran, order summary
- **Dashboard** - Admin dashboard dengan statistik dan quick actions
- **Responsive Design** - Mobile-friendly layout dengan Tailwind CSS
- **API Backend** - RESTful API untuk products & categories dengan filtering & pagination

### Belum Selesai

- **Auction System** - Database schema sudah ada, frontend belum
- **Payment Gateway** - UI sudah ada, integrasi belum
- **Order History** - Tracking pesanan di dashboard
- **Search Backend** - UI search bar ada, backend integration belum
- **User Profile Management** - Edit profil pengguna
- **Inventory Management** - Manajemen stok barang

## Database Schema

8 tabel utama di Supabase PostgreSQL:

| Tabel | Fungsi |
|-------|--------|
| `categories` | Kategori produk dengan slug |
| `products` | Data produk (species, harga, stok, badge) |
| `profiles` | Profil user (extend auth.users) |
| `cart_items` | Item keranjang belanja |
| `orders` | Header pesanan |
| `order_items` | Detail item pesanan |
| `auctions` | Lelang ikan hias |
| `bids` | History penawaran lelang |

## Setup & Jalankan

### Prerequisites

- Node.js 18+
- npm
- Supabase account & project

### 1. Clone Repository

```bash
git clone https://github.com/DinoAriel/e-commerce_cloud.git
cd e-commerce_cloud
```

### 2. Setup Database

Buka Supabase SQL Editor, jalankan file:
```
backend/database/schema.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Buat file `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

```bash
npm run dev    # Server berjalan di http://localhost:3000
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Buat file `.env`:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

```bash
npm run dev    # Server berjalan di http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/products` | List produk (filter: category, search, badge, pagination) |
| `POST` | `/api/products` | Tambah produk baru |
| `GET` | `/api/products/[id]` | Detail produk |
| `PUT` | `/api/products/[id]` | Update produk |
| `DELETE` | `/api/products/[id]` | Hapus produk |
| `GET` | `/api/categories` | List kategori |
| `POST` | `/api/categories` | Tambah kategori baru |

## Frontend Routes

| Path | Halaman |
|------|---------|
| `/` | Home |
| `/freshwater` | Ikan Air Tawar |
| `/saltwater` | Ikan Air Laut |
| `/rarefish` | Ikan Langka |
| `/product/:id` | Detail Produk |
| `/cart` | Keranjang Belanja |
| `/checkout` | Checkout |
| `/auctions` | Lelang |
| `/dashboard` | Dashboard User |
| `/login` | Login |
| `/signup` | Daftar |

## Progress Overall

| Komponen | Status | Keterangan |
|----------|--------|------------|
| Database Schema | ✅ Selesai | 8 tabel dengan RLS |
| API Products | ✅ Selesai | CRUD + filtering |
| API Categories | ✅ Selesai | GET + POST |
| Homepage | ✅ Selesai | Hero, kategori, produk, testimoni |
| Auth (Login/Signup) | ✅ Selesai | Email + Google OAuth |
| Product Detail | ✅ Selesai | Detail + add to cart |
| Shopping Cart | ✅ Selesai | Redux state management |
| Checkout | ✅ Selesai | Form + order summary |
| Dashboard | ✅ Selesai | Stats + quick actions |
| Navbar & Footer | ✅ Selesai | Responsive navigation |
| Category Pages | ⚠️ Partial | Route ada, konten perlu diperkaya |
| Auction Page | ❌ Belum | Schema ada, frontend belum |
| Order API | ❌ Belum | Backend endpoint belum dibuat |
| Payment Integration | ❌ Belum | UI ada, integrasi belum |

## Kontributor

- [DinoAriel](https://github.com/DinoAriel)

## Lisensi

Project ini dibuat untuk keperluan tugas kuliah.
