import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../lib/api'
import { useAddToCart } from '../lib/useAddToCart'

const formatPrice = (p) => `Rp ${Number(p).toLocaleString('id-ID')}`

const badgeColors = {
  Hot: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
  Rare: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
  New: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
}

export default function RareFishPage() {
  const navigate = useNavigate()
  const addToCart = useAddToCart()
  const [addedId, setAddedId] = useState(null)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [featured, setFeatured] = useState(null)
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ category: 'rare', limit: 50 })
      .then(data => {
        const products = data.products || []
        if (products.length > 0) {
          setFeatured(products[0])
          setGallery(products.slice(1))
        }
      })
      .catch((err) => console.error("Gagal mengambil produk langka:", err))
      .finally(() => setLoading(false))
  }, [])

  const handleAcquire = async (e, fish) => {
    e.stopPropagation()
    await addToCart(fish)
    setAddedId(fish.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[400px] overflow-hidden flex items-center bg-gradient-to-b from-[#031525] to-slate-950 border-b border-slate-900">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_40%,#0e7490_0%,transparent_60%)]" />
        
        <div className="max-w-4xl mx-auto px-6 md:px-12 w-full text-center relative z-20 py-20 space-y-6">
          <span className="inline-flex items-center gap-2 border border-teal-500/30 bg-teal-500/10 text-teal-400 text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Koleksi Eksklusif Terbatas
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Spesimen Langka <br />Untuk Kolektor <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Berkelas</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Akses eksklusif ke harta karun laut yang paling langka di dunia. Dikurasi langsung, dipantau medis, dan diperoleh secara etis dan bertanggung jawab.
          </p>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featured && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-white">Mahakarya Akuatik</h2>
            <p className="text-slate-400 text-sm mt-2">Spesimen unggulan teratas dengan kelangkaan tingkat tinggi yang siap diadopsi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Featured Card 1 */}
            <div onClick={() => navigate(`/product/${featured.id}`)} className="group bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 cursor-pointer flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img
                    src={featured.image_url}
                    alt={featured.name}
                    onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/placeholder.avif' }}}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                  />
                  {featured.badge && (
                    <span className={`absolute top-4 left-4 ${badgeColors[featured.badge] || 'bg-slate-800 text-slate-300'} text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-xl border border-white/5`}>
                      {featured.badge}
                    </span>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">{featured.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{featured.description}</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Spesies: <span className="text-slate-300 font-mono normal-case">{featured.species}</span></p>
                </div>
              </div>
              <div className="px-8 pb-8 pt-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">{formatPrice(featured.price)}</span>
                  <button
                    onClick={(e) => handleAcquire(e, featured)}
                    className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 whitespace-nowrap shadow-lg
                      ${addedId === featured.id ? 'bg-emerald-500 text-white shadow-emerald-950/20' : 'bg-teal-500 text-slate-950 hover:bg-teal-400 hover:shadow-teal-500/20'}`}
                  >
                    {addedId === featured.id ? 'Ditambahkan ✓' : 'Beli Spesimen'}
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Card 2 (First Gallery Item) */}
            {gallery[0] ? (
              <div onClick={() => navigate(`/product/${gallery[0].id}`)} className="group bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 cursor-pointer flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    <img
                      src={gallery[0].image_url}
                      alt={gallery[0].name}
                      onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/placeholder.avif' }}}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    {gallery[0].badge && (
                      <span className={`absolute top-4 left-4 ${badgeColors[gallery[0].badge] || 'bg-slate-800 text-slate-300'} text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-xl border border-white/5`}>
                        {gallery[0].badge}
                      </span>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">{gallery[0].name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{gallery[0].description}</p>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Spesies: <span className="text-slate-300 font-mono normal-case">{gallery[0].species}</span></p>
                  </div>
                </div>
                <div className="px-8 pb-8 pt-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">{formatPrice(gallery[0].price)}</span>
                    <button
                      onClick={(e) => handleAcquire(e, gallery[0])}
                      className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 whitespace-nowrap shadow-lg
                        ${addedId === gallery[0].id ? 'bg-emerald-500 text-white shadow-emerald-950/20' : 'bg-teal-500 text-slate-950 hover:bg-teal-400 hover:shadow-teal-500/20'}`}
                    >
                      {addedId === gallery[0].id ? 'Ditambahkan ✓' : 'Beli Spesimen'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-800 rounded-3xl flex items-center justify-center p-8 text-slate-600 font-medium">
                Belum ada spesimen langka lainnya.
              </div>
            )}

          </div>
        </section>
      )}

      {/* ── GALLERY GRID ── */}
      {gallery.length > 1 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 border-t border-slate-900">
          <div className="mb-10">
            <h3 className="text-2xl font-extrabold text-white">Galeri Koleksi Langka</h3>
            <p className="text-slate-500 text-sm mt-1">Jelajahi spesimen kolektor eksotis lainnya.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gallery.slice(1).map((fish) => (
              <div 
                key={fish.id} 
                onClick={() => navigate(`/product/${fish.id}`)} 
                className="group cursor-pointer bg-slate-900/20 border border-slate-800/80 hover:border-slate-700/60 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/10"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 mb-4">
                  <img
                    src={fish.image_url}
                    alt={fish.name}
                    onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/placeholder.avif' }}}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                </div>
                <h4 className="font-bold text-white text-sm truncate group-hover:text-teal-400 transition-colors">{fish.name}</h4>
                <p className="text-slate-500 text-xs truncate mb-2">{fish.species}</p>
                <p className="font-extrabold text-teal-400 text-sm">{formatPrice(fish.price)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── JOIN NEWSLETTER ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="relative bg-gradient-to-br from-[#0c2438] to-[#04111d] rounded-[2.5rem] overflow-hidden px-8 md:px-16 py-16 text-center border border-slate-800">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_50%_100%,#0e7490_0%,transparent_60%)]" />
          <div className="relative z-10 max-w-lg mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Bergabung dengan Lingkaran Dalam.</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Daftar untuk pemberitahuan pribadi tentang kedatangan spesimen langka baru sebelum dirilis ke publik.
            </p>
            {joined ? (
              <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 px-6 py-4 rounded-2xl text-sm font-semibold backdrop-blur-md">
                Anda berhasil bergabung! Selamat datang di Lingkaran Dalam.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Email eksekutif Anda"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 bg-slate-950/60 border border-slate-800/80 text-white placeholder-slate-500 text-sm px-4 py-3.5 rounded-xl outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all"
                />
                <button
                  onClick={() => { if (email) setJoined(true) }}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-all active:scale-95 text-sm whitespace-nowrap"
                >
                  Minta Keanggotaan
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
