-- Supabase Schema for AquaMarket

-- Drop tables if exist
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS auctions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    description TEXT,
    image_url TEXT,
    badge TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Profiles Table (assuming it links to Supabase auth.users or just standalone for now)
CREATE TABLE profiles (
    id UUID PRIMARY KEY, -- In Supabase, this usually matches auth.users.id
    full_name TEXT,
    avatar_url TEXT,
    phone_number TEXT,
    address TEXT,
    role TEXT DEFAULT 'buyer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Cart Items Table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- references profiles(id)
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, product_id)
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price INTEGER NOT NULL CHECK (price >= 0)
);

-- Auctions Table
CREATE TABLE auctions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    starting_price INTEGER NOT NULL CHECK (starting_price >= 0),
    current_bid INTEGER NOT NULL DEFAULT 0 CHECK (current_bid >= 0),
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Bids Table
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    bid_amount INTEGER NOT NULL CHECK (bid_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert Initial Categories
INSERT INTO categories (name, slug) VALUES 
('Freshwater', 'freshwater'),
('Saltwater', 'saltwater'),
('Rare', 'rare');

-- Insert Initial Products (Mock Data)
INSERT INTO products (name, species, price, description, image_url, badge, category_id, stock, is_active)
SELECT 
    'Symphysodon aequifasciatus', 'Discus Fish', 150000, 'Ikan Discus warna-warni yang indah untuk akuarium air tawar.', '/images/discus.png', 'Best Seller', c.id, 50, true
FROM categories c WHERE c.slug = 'freshwater';

INSERT INTO products (name, species, price, description, image_url, badge, category_id, stock, is_active)
SELECT 
    'Betta splendens', 'Ikan Cupang', 50000, 'Ikan cupang dengan ekor lebar yang cantik.', '/images/cupang.png', 'New', c.id, 100, true
FROM categories c WHERE c.slug = 'freshwater';

INSERT INTO products (name, species, price, description, image_url, badge, category_id, stock, is_active)
SELECT 
    'Amphiprioninae', 'Clownfish', 250000, 'Ikan badut yang populer seperti Nemo. Cocok untuk air laut.', '/images/clownfish.png', 'Hot', c.id, 20, true
FROM categories c WHERE c.slug = 'saltwater';

INSERT INTO products (name, species, price, description, image_url, badge, category_id, stock, is_active)
SELECT 
    'Pterois volitans', 'Lionfish', 850000, 'Ikan predator air laut yang elegan dan berbahaya.', '/images/lionfish.png', 'Rare', c.id, 5, true
FROM categories c WHERE c.slug = 'rare';


-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'buyer'
  );
  RETURN new;
END;
$$;

-- Drop trigger if exists and create it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
