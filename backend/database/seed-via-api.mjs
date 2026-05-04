/**
 * Script untuk seed data awal melalui API backend
 * Jalankan: node database/seed-via-api.mjs
 */

const API_URL = 'http://localhost:3000/api'

async function seedCategories() {
  console.log('📂 Seeding categories...')
  
  const categories = [
    { name: 'Saltwater', slug: 'saltwater', description: 'Ikan hias air laut yang indah dan eksotis' },
    { name: 'Freshwater', slug: 'freshwater', description: 'Ikan hias air tawar yang mudah dipelihara' },
    { name: 'Rare Fish', slug: 'rare-fish', description: 'Koleksi ikan langka dan premium' },
    { name: 'Invertebrates', slug: 'invertebrates', description: 'Udang, kerang, dan invertebrata laut lainnya' },
  ]

  const createdCategories = {}

  for (const cat of categories) {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    })
    const result = await res.json()
    if (result.success) {
      createdCategories[cat.slug] = result.data.id
      console.log(`  ✅ ${cat.name} (${result.data.id})`)
    } else {
      console.log(`  ❌ ${cat.name}: ${result.error}`)
    }
  }

  return createdCategories
}

async function seedProducts(categoryIds) {
  console.log('\n🐠 Seeding products...')

  const products = [
    { name: 'Blue Tang', species: 'Paracanthurus hepatus', price: 450000, description: 'Ikan hias ikonik dengan warna biru dan kuning cerah. Memerlukan akuarium air laut.', image_url: '/images/blue-tang.avif', badge: null, category_id: categoryIds['saltwater'], stock: 15 },
    { name: 'Discus Red Dragon', species: 'Symphysodon aequifasciatus', price: 1200000, description: 'Raja akuarium air tawar dengan pola merah menyala, butuh parameter air stabil.', image_url: '/images/discus.avif', badge: 'Hot', category_id: categoryIds['freshwater'], stock: 8 },
    { name: 'Emperor Angelfish', species: 'Pomacanthus imperator', price: 2800000, description: 'Ikan bidadari kaisar yang megah, menampilkan perubahan pola warna dramatis dari remaja ke dewasa.', image_url: '/images/angelfish.avif', badge: 'Rare', category_id: categoryIds['rare-fish'], stock: 3 },
    { name: 'Cream Mandarin', species: 'Synchiropus splendidus', price: 650000, description: 'Ikan pemakan copepoda yang damai dan pemalu, cocok untuk akuarium karang yang sudah matang.', image_url: '/images/mandarin.avif', badge: null, category_id: categoryIds['saltwater'], stock: 10 },
    { name: 'Clownfish', species: 'Amphiprioninae', price: 200000, description: 'Ikan badut populer yang hidup bersimbiosis dengan anemon laut. Mudah dipelihara untuk pemula.', image_url: '/images/clownfish.avif', badge: null, category_id: categoryIds['saltwater'], stock: 25 },
    { name: 'Arowana Silver', species: 'Osteoglossum bicirrhosum', price: 5000000, description: 'Ikan predator premium yang anggun, simbol keberuntungan dan prestise.', image_url: '/images/arowana.avif', badge: 'Rare', category_id: categoryIds['rare-fish'], stock: 2 },
    { name: 'Betta Halfmoon', species: 'Betta splendens', price: 150000, description: 'Ikan cupang halfmoon dengan sirip yang lebar dan warna cerah menawan.', image_url: '/images/betta.avif', badge: 'Hot', category_id: categoryIds['freshwater'], stock: 30 },
    { name: 'Yellow Tang', species: 'Zebrasoma flavescens', price: 550000, description: 'Ikan tang kuning cerah yang aktif berenang, cocok untuk akuarium reef.', image_url: '/images/yellow-tang.avif', badge: null, category_id: categoryIds['saltwater'], stock: 12 },
    { name: 'Flowerhorn', species: 'Hybrid Cichlid', price: 3500000, description: 'Ikan hias hybrid dengan tonjolan kepala yang unik, dipercaya membawa keberuntungan.', image_url: '/images/flowerhorn.avif', badge: 'Hot', category_id: categoryIds['freshwater'], stock: 5 },
    { name: 'Moorish Idol', species: 'Zanclus cornutus', price: 1800000, description: 'Ikan ikonik dengan pola hitam-putih-kuning yang elegan. Salah satu ikan laut terindah.', image_url: '/images/moorish-idol.avif', badge: 'Rare', category_id: categoryIds['rare-fish'], stock: 4 },
  ]

  for (const product of products) {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
    const result = await res.json()
    if (result.success) {
      console.log(`  ✅ ${product.name} — Rp ${product.price.toLocaleString('id-ID')}`)
    } else {
      console.log(`  ❌ ${product.name}: ${result.error}`)
    }
  }
}

async function main() {
  console.log('🌱 Starting seed...\n')
  
  // Check if data already exists
  const checkRes = await fetch(`${API_URL}/products`)
  const checkData = await checkRes.json()
  
  if (checkData.success && checkData.data.total > 0) {
    console.log(`⚠️  Database sudah ada ${checkData.data.total} produk. Skip seeding.`)
    return
  }

  const categoryIds = await seedCategories()
  await seedProducts(categoryIds)
  
  console.log('\n✅ Seed complete!')
  
  // Verify
  const verifyRes = await fetch(`${API_URL}/products`)
  const verifyData = await verifyRes.json()
  console.log(`\n📊 Total products: ${verifyData.data.total}`)
}

main().catch(console.error)
