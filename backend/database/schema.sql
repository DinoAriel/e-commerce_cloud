-- =====================================================
-- DATABASE SCHEMA: E-Commerce Ikan Hias
-- Jalankan script ini di Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run
-- =====================================================

-- 1. Tabel Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  badge TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Profiles (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY, -- sama dengan auth.users.id
  full_name TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- 5. Tabel Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'done', 'cancelled')),
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabel Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price INTEGER NOT NULL CHECK (price > 0)
);

-- 7. Tabel Auctions
CREATE TABLE IF NOT EXISTS auctions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  start_price INTEGER NOT NULL CHECK (start_price > 0),
  current_bid INTEGER,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Tabel Bids
CREATE TABLE IF NOT EXISTS bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES untuk performa query
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_badge ON products(badge);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_bids_auction ON bids(auction_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Untuk saat ini, disable RLS agar API bisa akses bebas
-- Nanti saat Auth diimplementasi, enable dan buat policies
-- =====================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Policy: Semua orang bisa READ categories dan products (public)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Auctions are viewable by everyone" ON auctions FOR SELECT USING (true);
CREATE POLICY "Bids are viewable by everyone" ON bids FOR SELECT USING (true);

-- Policy: Service role (backend) bisa melakukan semua operasi
-- (Service role key secara otomatis bypass RLS, jadi ini untuk anon key)
CREATE POLICY "Allow all for service role on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on cart_items" ON cart_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on auctions" ON auctions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on bids" ON bids FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- DONE! Semua tabel sudah dibuat.
-- Lanjut jalankan file seed_data.sql untuk data awal.
-- =====================================================
