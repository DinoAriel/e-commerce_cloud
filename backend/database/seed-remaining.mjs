/**
 * Tambah sisa produk yang belum masuk
 */
const API_URL = 'http://localhost:3000/api'

async function main() {
  // Get category IDs
  const catRes = await fetch(`${API_URL}/categories`)
  const catData = await catRes.json()
  const cats = {}
  for (const c of catData.data) {
    cats[c.slug] = c.id
  }
  console.log('Categories:', Object.keys(cats).join(', '))

  // Check existing products
  const prodRes = await fetch(`${API_URL}/products`)
  const prodData = await prodRes.json()
  const existingNames = prodData.data.products.map(p => p.name)
  console.log(`Existing products (${existingNames.length}):`, existingNames.join(', '))

  const allProducts = [
    { name: 'Blue Tang', species: 'Paracanthurus hepatus', price: 450000, description: 'Ikan hias ikonik dengan warna biru dan kuning cerah. Memerlukan akuarium air laut.', image_url: '/images/blue-tang.avif', badge: null, category_id: cats['saltwater'], stock: 15 },
    { name: 'Discus Red Dragon', species: 'Symphysodon aequifasciatus', price: 1200000, description: 'Raja akuarium air tawar dengan pola merah menyala, butuh parameter air stabil.', image_url: '/images/discus.avif', badge: 'Hot', category_id: cats['freshwater'], stock: 8 },
    { name: 'Emperor Angelfish', species: 'Pomacanthus imperator', price: 2800000, description: 'Ikan bidadari kaisar yang megah, menampilkan perubahan pola warna dramatis dari remaja ke dewasa.', image_url: '/images/angelfish.avif', badge: 'Rare', category_id: cats['rare-fish'], stock: 3 },
    { name: 'Cream Mandarin', species: 'Synchiropus splendidus', price: 650000, description: 'Ikan pemakan copepoda yang damai dan pemalu, cocok untuk akuarium karang yang sudah matang.', image_url: '/images/mandarin.avif', badge: null, category_id: cats['saltwater'], stock: 10 },
    { name: 'Clownfish', species: 'Amphiprioninae', price: 200000, description: 'Ikan badut populer yang hidup bersimbiosis dengan anemon laut. Mudah dipelihara untuk pemula.', image_url: '/images/clownfish.avif', badge: null, category_id: cats['saltwater'], stock: 25 },
    { name: 'Arowana Silver', species: 'Osteoglossum bicirrhosum', price: 5000000, description: 'Ikan predator premium yang anggun, simbol keberuntungan dan prestise.', image_url: '/images/arowana.avif', badge: 'Rare', category_id: cats['rare-fish'], stock: 2 },
    { name: 'Betta Halfmoon', species: 'Betta splendens', price: 150000, description: 'Ikan cupang halfmoon dengan sirip yang lebar dan warna cerah menawan.', image_url: '/images/betta.avif', badge: 'Hot', category_id: cats['freshwater'], stock: 30 },
    { name: 'Yellow Tang', species: 'Zebrasoma flavescens', price: 550000, description: 'Ikan tang kuning cerah yang aktif berenang, cocok untuk akuarium reef.', image_url: '/images/yellow-tang.avif', badge: null, category_id: cats['saltwater'], stock: 12 },
    { name: 'Flowerhorn', species: 'Hybrid Cichlid', price: 3500000, description: 'Ikan hias hybrid dengan tonjolan kepala yang unik, dipercaya membawa keberuntungan.', image_url: '/images/flowerhorn.avif', badge: 'Hot', category_id: cats['freshwater'], stock: 5 },
    { name: 'Moorish Idol', species: 'Zanclus cornutus', price: 1800000, description: 'Ikan ikonik dengan pola hitam-putih-kuning yang elegan. Salah satu ikan laut terindah.', image_url: '/images/moorish-idol.avif', badge: 'Rare', category_id: cats['rare-fish'], stock: 4 },
  ]

  // Only insert missing products
  const missing = allProducts.filter(p => !existingNames.includes(p.name))
  console.log(`\nInserting ${missing.length} missing products...`)

  for (const product of missing) {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      const result = await res.json()
      if (result.success) {
        console.log(`  ✅ ${product.name}`)
      } else {
        console.log(`  ❌ ${product.name}: ${result.error}`)
      }
    } catch (e) {
      console.log(`  ❌ ${product.name}: ${e.message}`)
    }
  }

  // Final count
  const finalRes = await fetch(`${API_URL}/products`)
  const finalData = await finalRes.json()
  console.log(`\n📊 Total products now: ${finalData.data.total}`)
}

main().catch(console.error)
