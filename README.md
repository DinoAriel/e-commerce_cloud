# AquaMarket - E-Commerce Ikan Hias

Platform e-commerce cloud untuk jual beli ikan hias (ornamental fish) dengan arsitektur monorepo. Dibangun sebagai project mata kuliah menggunakan tech stack modern.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Redux Toolkit, Tailwind CSS 4, React Router v7 |
| **Backend** | Go (Fiber v2), PostgreSQL via pgx |
| **Database & Auth** | Supabase (PostgreSQL + Auth + Storage) |
| **State Management** | Redux Toolkit (cart) + Supabase Auth |

## Arsitektur Project

```
e-commerce_cloud/
├── backend/                    # Go API Server (Fiber v2)
│   ├── main.go                 # Entry point
│   ├── config/                 # Environment config
│   ├── database/               # PostgreSQL connection (pgxpool)
│   ├── handlers/               # Request handlers
│   │   ├── product_handler.go
│   │   ├── category_handler.go
│   │   ├── cart_handler.go
│   │   ├── order_handler.go
│   │   ├── auction_handler.go
│   │   └── profile_handler.go
│   ├── middleware/              # JWT auth, CORS, validation
│   ├── models/                 # Data models & response helpers
│   ├── routes/                 # Route definitions
│   └── database/               # Schema & seed files
│
├── frontend/                   # React + Vite SPA
   ├── src/
   │   ├── components/         # Navbar, Footer, ProductCard, CategoryPageLayout
   │   ├── pages/              # Halaman-halaman aplikasi
   │   ├── sections/           # Section komponen homepage
   │   ├── store/              # Redux store & cart slice
   │   └── lib/                # API client, Supabase client, auth context, hooks
   └── public/                 # Assets & gambar produk


```

## Fitur

### Sudah Diimplementasi

- **Katalog Produk** — Listing produk dengan filter kategori, search, badge, dan pagination
- **Halaman Kategori** — Freshwater, Saltwater (dengan sidebar filter: Specie Type, Vibrant Colors, Temperament/Care Level), Rare Fish
- **Autentikasi** — Login, Sign Up via Supabase Auth + Google OAuth, JWT token management
- **Shopping Cart** — Add to cart dengan Redux + API sync, quantity control, order summary (subtotal, shipping, taxes)
- **Product Detail** — Detail produk dengan gambar, deskripsi, harga, add to cart
- **Dashboard** — User dashboard dengan statistik dan quick actions
- **Responsive Design** — Mobile-friendly layout dengan hamburger menu dan Tailwind CSS
- **API Backend** — RESTful API dengan JWT auth middleware, input validation, CORS, dan error handling
- **Search** — Search bar di navbar dengan backend integration
- **Auction System** — Database schema dan API endpoints untuk lelang ikan hias
- **Order Management** — Create order, view order history, cancel order

### Belum Selesai

- **Payment Gateway** — UI sudah ada, integrasi belum
- **User Profile Management** — API endpoint sudah ada, frontend edit profil belum lengkap
- **Inventory Management** — Manajemen stok barang otomatis

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

- Go 1.23+
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

### 3. Backend Setup (Go)

```bash
cd backend
go mod download
```

Buat file `.env`:
```
DB_HOST=<your-db-host>
DB_PORT=5432
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=<your-db-name>
DB_SSLMODE=require
JWT_SECRET=<your-supabase-jwt-secret>
PORT=8080
```

```bash
go run main.go    # Server berjalan di http://localhost:8080
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
VITE_API_BASE=http://localhost:8080
```

```bash
npm run dev    # Server berjalan di http://localhost:5173
```

## API Endpoints

### Products
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/products` | Public | List produk (filter: category, search, badge, pagination) |
| `GET` | `/api/products/:id` | Public | Detail produk |
| `POST` | `/api/products` | Required | Tambah produk baru |
| `PUT` | `/api/products/:id` | Required | Update produk |
| `DELETE` | `/api/products/:id` | Required | Hapus produk |

### Categories
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/categories` | Public | List kategori |
| `POST` | `/api/categories` | Required | Tambah kategori |
| `DELETE` | `/api/categories/:id` | Required | Hapus kategori |

### Cart
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/cart/:userId` | Required | Ambil item keranjang |
| `POST` | `/api/cart` | Required | Tambah ke keranjang |
| `PUT` | `/api/cart/:id` | Required | Update quantity |
| `DELETE` | `/api/cart/:id` | Required | Hapus item |

### Orders
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/api/orders` | Required | Buat pesanan |
| `GET` | `/api/orders/user/:userId` | Required | Riwayat pesanan |
| `GET` | `/api/orders/:id` | Required | Detail pesanan |
| `PUT` | `/api/orders/:id/status` | Required | Update status |
| `PUT` | `/api/orders/:id/cancel` | Required | Batalkan pesanan |

### Profiles
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/profiles/:id` | Required | Ambil profil |
| `PUT` | `/api/profiles/:id` | Required | Update profil |

### Auctions
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/auctions` | Public | List lelang |
| `GET` | `/api/auctions/:id` | Public | Detail lelang |
| `GET` | `/api/auctions/:id/bids` | Public | History penawaran |
| `POST` | `/api/auctions` | Required | Buat lelang |
| `POST` | `/api/auctions/:id/bids` | Required | Pasang penawaran |

## Frontend Routes

| Path | Halaman |
|------|---------|
| `/` | Home |
| `/freshwater` | Ikan Air Tawar (dengan sidebar filter) |
| `/saltwater` | Ikan Air Laut (dengan sidebar filter) |
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
| Database Schema | Selesai | 8 tabel dengan RLS |
| API Backend (Go) | Selesai | 6 handler groups, JWT auth, validation, CORS |
| API Products | Selesai | CRUD + filtering + pagination |
| API Categories | Selesai | GET + POST + DELETE |
| API Cart | Selesai | CRUD dengan auth |
| API Orders | Selesai | Create, list, detail, status update, cancel |
| API Auctions | Selesai | CRUD bids dengan auth |
| API Profiles | Selesai | GET + PUT dengan auth |
| Homepage | Selesai | Hero, kategori, produk, search |
| Auth (Login/Signup) | Selesai | Email + Google OAuth via Supabase |
| Product Detail | Selesai | Detail + add to cart |
| Shopping Cart | Selesai | Redux + API sync, order summary + taxes |
| Category Pages | Selesai | Sidebar filter (species, colors, temperament/care level) |
| Checkout | Selesai | Form + order summary |
| Dashboard | Selesai | Stats + quick actions |
| Navbar & Footer | Selesai | Responsive + search + mobile menu |
| Auction Page | Selesai | Listing + bidding UI |
| Payment Integration | Belum | UI ada, integrasi belum |

## Lisensi

Project ini dibuat untuk keperluan tugas kuliah.
