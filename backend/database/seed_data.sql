-- =====================================================
-- SEED DATA: Data awal untuk testing
-- Jalankan SETELAH schema.sql di Supabase SQL Editor
-- =====================================================

-- 1. Insert Categories
INSERT INTO categories (name, slug, description) VALUES
  ('Saltwater', 'saltwater', 'Ikan hias air laut yang indah dan eksotis'),
  ('Freshwater', 'freshwater', 'Ikan hias air tawar yang mudah dipelihara'),
  ('Rare Fish', 'rare-fish', 'Koleksi ikan langka dan premium'),
  ('Invertebrates', 'invertebrates', 'Udang, kerang, dan invertebrata laut lainnya');

-- 2. Insert Products
-- Ambil category IDs
DO $$
DECLARE
  saltwater_id UUID;
  freshwater_id UUID;
  rare_id UUID;
BEGIN
  SELECT id INTO saltwater_id FROM categories WHERE slug = 'saltwater';
  SELECT id INTO freshwater_id FROM categories WHERE slug = 'freshwater';
  SELECT id INTO rare_id FROM categories WHERE slug = 'rare-fish';

  INSERT INTO products (name, species, price, description, image_url, badge, category_id, stock, is_active) VALUES
    ('Blue Tang', 'Paracanthurus hepatus', 450000, 'Ikan hias ikonik dengan warna biru dan kuning cerah. Memerlukan akuarium air laut.', '/images/blue-tang.avif', NULL, saltwater_id, 15, true),
    ('Discus Red Dragon', 'Symphysodon aequifasciatus', 1200000, 'Raja akuarium air tawar dengan pola merah menyala, butuh parameter air stabil.', '/images/discus.avif', 'Hot', freshwater_id, 8, true),
    ('Emperor Angelfish', 'Pomacanthus imperator', 2800000, 'Ikan bidadari kaisar yang megah, menampilkan perubahan pola warna dramatis dari remaja ke dewasa.', '/images/angelfish.avif', 'Rare', rare_id, 3, true),
    ('Cream Mandarin', 'Synchiropus splendidus', 650000, 'Ikan pemakan copepoda yang damai dan pemalu, cocok untuk akuarium karang yang sudah matang.', '/images/mandarin.avif', NULL, saltwater_id, 10, true),
    ('Clownfish', 'Amphiprioninae', 200000, 'Ikan badut populer yang hidup bersimbiosis dengan anemon laut. Mudah dipelihara untuk pemula.', '/images/clownfish.avif', NULL, saltwater_id, 25, true),
    ('Arowana Silver', 'Osteoglossum bicirrhosum', 5000000, 'Ikan predator premium yang anggun, simbol keberuntungan dan prestise.', '/images/arowana.avif', 'Rare', rare_id, 2, true),
    ('Betta Halfmoon', 'Betta splendens', 150000, 'Ikan cupang halfmoon dengan sirip yang lebar dan warna cerah menawan.', '/images/betta.avif', 'Hot', freshwater_id, 30, true),
    ('Yellow Tang', 'Zebrasoma flavescens', 550000, 'Ikan tang kuning cerah yang aktif berenang, cocok untuk akuarium reef.', '/images/yellow-tang.avif', NULL, saltwater_id, 12, true),
    ('Flowerhorn', 'Hybrid Cichlid', 3500000, 'Ikan hias hybrid dengan tonjolan kepala yang unik, dipercaya membawa keberuntungan.', '/images/flowerhorn.avif', 'Hot', freshwater_id, 5, true),
    ('Moorish Idol', 'Zanclus cornutus', 1800000, 'Ikan ikonik dengan pola hitam-putih-kuning yang elegan. Salah satu ikan laut terindah.', '/images/moorish-idol.avif', 'Rare', rare_id, 4, true);
END $$;

-- =====================================================
-- DONE! Data awal sudah dimasukkan.
-- =====================================================
