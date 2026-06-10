const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:Aquamarket123!@ecommerce-db.cxakyk44ej9y.ap-southeast-2.rds.amazonaws.com:5432/postgres?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
})

async function resetProducts() {
  try {
    console.log("Menghapus semua produk dari database...")
    await pool.query('TRUNCATE TABLE products CASCADE')
    console.log("✅ Berhasil! Semua produk telah dihapus dari database.")
    process.exit(0)
  } catch (err) {
    console.error("❌ Gagal menghapus produk:", err)
    process.exit(1)
  }
}

resetProducts()
