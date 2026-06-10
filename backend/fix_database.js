process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:Aquamarket123!@ecommerce-db.cxakyk44ej9y.ap-southeast-2.rds.amazonaws.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
})

async function fixDatabase() {
  try {
    console.log("Memperbaiki skema tabel orders dan order_items...")
    
    await pool.query(`DROP TABLE IF EXISTS order_items CASCADE;`)
    await pool.query(`DROP TABLE IF EXISTS orders CASCADE;`)
    
    await pool.query(`
      CREATE TABLE orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
          status TEXT NOT NULL DEFAULT 'pending',
          shipping_address TEXT NOT NULL,
          snap_token TEXT,
          rating INT,
          review TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `)
    
    await pool.query(`
      CREATE TABLE order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          price INTEGER NOT NULL CHECK (price >= 0)
      );
    `)
    
    console.log("✅ Berhasil! Skema database pesanan Anda kini sudah 100% sempurna.")
    process.exit(0)
  } catch (err) {
    console.error("❌ Gagal memperbaiki database:", err)
    process.exit(1)
  }
}

fixDatabase()
