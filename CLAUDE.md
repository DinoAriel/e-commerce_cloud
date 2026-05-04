# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an e-commerce platform for ornamental fish (ikan hias) with a monorepo structure:
- **Backend**: Next.js 16 API server with Supabase PostgreSQL database
- **Frontend**: React 19 + Vite SPA with Redux Toolkit and Tailwind CSS 4

## Development Commands

### Backend (Next.js API)
```bash
cd backend
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Frontend (React + Vite)
```bash
cd frontend
npm run dev          # Start dev server on http://localhost:5173
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Architecture

### Backend (Next.js 16 App Router)
- **API Routes**: Located in `backend/app/api/` using Next.js App Router conventions
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) enabled
- **Auth**: Supabase Auth (profiles table extends auth.users)
- **CORS**: Configured in `next.config.ts` and via response helpers

**Key Backend Patterns:**
- API routes use `supabaseAdmin` (service role) from `@/lib/supabase/server`
- Standardized response format via `successResponse()` and `errorResponse()` helpers
- TypeScript types defined in `backend/types/` directory
- Dynamic routes use `[id]` pattern (e.g., `products/[id]/route.ts`)

**API Endpoints:**
- `GET/POST /api/products` - List/create products with filtering (category, search, badge)
- `GET/PUT/DELETE /api/products/[id]` - Product detail, update, delete
- `GET/POST /api/categories` - List/create categories

### Frontend (React + Vite)
- **Routing**: React Router v7 with file-based routes in `src/App.jsx`
- **State**: Redux Toolkit store in `src/store/` (cart management)
- **Styling**: Tailwind CSS 4 with Vite plugin
- **Database Client**: Supabase JS client via `src/lib/supabase.js`

**Frontend Routes:**
- `/` - Home page
- `/freshwater`, `/saltwater`, `/rarefish` - Category pages
- `/product/:id` - Product detail
- `/cart`, `/checkout` - Shopping cart
- `/auctions` - Auction listings
- `/dashboard` - User dashboard
- `/login`, `/signup` - Authentication

**Key Frontend Patterns:**
- Redux slices in `src/store/` for global state (cart)
- Supabase client initialized with anon key for client-side queries
- Components organized by type: `components/` (reusable), `pages/` (routes), `sections/` (page sections)

## Database Schema

Located in `backend/database/schema.sql`. Run this in Supabase SQL Editor to set up tables:

**Core Tables:**
- `categories` - Product categories with slug
- `products` - Products with species, price, badge, stock
- `profiles` - User profiles (extends Supabase Auth)
- `cart_items` - Shopping cart items
- `orders`, `order_items` - Order management
- `auctions`, `bids` - Auction system

**Important Notes:**
- All tables use UUID primary keys
- RLS is enabled but permissive policies allow public read access
- Service role key bypasses RLS for admin operations
- Foreign key cascades are configured appropriately

## Environment Setup

Both backend and frontend require Supabase credentials:

**Backend (`.env.local`):**
```
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**Frontend (`.env`):**
```
VITE_SUPABASE_URL=<your-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## Common Development Tasks

**Adding a new API endpoint:**
1. Create route file in `backend/app/api/`
2. Use `supabaseAdmin` from `@/lib/supabase/server`
3. Return responses using `successResponse()` or `errorResponse()`
4. Export `OPTIONS()` handler for CORS preflight

**Adding a new page:**
1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Use Redux hooks if accessing cart state

**Database modifications:**
1. Update schema in `backend/database/schema.sql`
2. Run changes in Supabase SQL Editor
3. Update TypeScript types in `backend/types/`
4. Update API routes if needed

## Tech Stack Details

- **Next.js 16** - Using new App Router (not Pages Router)
- **React 19** - Latest version with new compiler available
- **Supabase** - Database, Auth, and Storage
- **Redux Toolkit** - State management (cart slice)
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite 8** - Frontend build tool
- **TypeScript 5** - Backend uses TS, frontend uses JSX

## Important Notes

- Backend runs on port 3000, frontend on port 5173 (development)
- Next.js 16 has breaking changes from earlier versions - check `node_modules/next/dist/docs/` for API changes
- Service role key should NEVER be exposed to frontend
- Cart state is client-side only (not persisted to database yet)
- Images are stored as URLs in database (consider Supabase Storage for future)
