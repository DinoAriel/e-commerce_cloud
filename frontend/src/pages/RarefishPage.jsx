import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../lib/api'
import { useAddToCart } from '../lib/useAddToCart'

const formatPrice = (p) => `Rp ${Number(p).toLocaleString('id-ID')}`

const badgeColors = {
  Hot: 'bg-orange-500',
  Rare: 'bg-purple-600',
  New: 'bg-green-500',
  Kuat: 'bg-teal-500',
  Aktif: 'bg-blue-500',
  Langka: 'bg-red-500',
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
    getProducts({ category: 'rare-fish', limit: 50 })
      .then(data => {
        const products = data.products || []
        if (products.length > 0) setFeatured(products[0])
        setGallery(products.slice(1, 5))
      })
      .catch(() => {})
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative min-h-[420px] md:min-h-[500px] bg-[#051c2c] overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 60% 40%, #1a6a8a 0%, transparent 55%)' }} />
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice">
          {[0, 50, 100, 150, 200].map((o, i) => (
            <path key={i} d={`M0 ${200 + o} Q450 ${150 + o} 900 ${200 + o}`} fill="none" stroke="#89d4ff" strokeWidth="1" />
          ))}
        </svg>

        <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-end pr-8 opacity-90 pointer-events-none">
          {featured && (
            <img
              src={featured.image_url}
              alt=""
              onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}}
              className="h-full max-h-[480px] object-contain object-right"
            />
          )}
        </div>

        <div className="relative z-10 px-8 md:px-16 max-w-2xl py-16">
          <span className="inline-block border border-teal-500/50 text-teal-400 text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Koleksi Eksklusif
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            Spesimen langka untuk<br />
            Kolektor <span className="text-teal-400">Berkelas</span>.
          </h1>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md mb-8">
            Akses eksklusif ke harta karun laut yang paling langka. Dikurasi langsung, diseleksi medis, dan diperoleh secara etis.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="px-6 md:px-16 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-dark">Ikan Langka</h2>
              <p className="text-gray-400 text-sm mt-1">Spesimen sangat langka yang tersedia saat ini.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div onClick={() => navigate(`/product/${featured.id}`)} className="border border-gray-100 rounded-3xl overflow-hidden hover:border-primary-border hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <img
                  src={featured.image_url}
                  alt={featured.name}
                  onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}}
                  className="w-full h-full object-cover opacity-90"
                />
                {featured.badge && (
                  <span className={`absolute top-3 left-3 ${badgeColors[featured.badge] || 'bg-gray-500'} text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full`}>
                    {featured.badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-dark mb-2">{featured.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{featured.description}</p>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl font-bold text-dark">{formatPrice(featured.price)}</span>
                </div>
                <button
                  onClick={(e) => handleAcquire(e, featured)}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95
                    ${addedId === featured.id ? 'bg-green-500 text-white' : 'bg-[#0f2744] text-white hover:bg-[#1a3a5c]'}`}
                >
                  {addedId === featured.id ? 'Ditambahkan ✓' : 'Beli Spesimen'}
                </button>
              </div>
            </div>

            {gallery[0] && (
              <div onClick={() => navigate(`/product/${gallery[0].id}`)} className="border border-gray-100 rounded-3xl overflow-hidden hover:border-primary-border hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer">
                <div className="relative flex-1 min-h-[200px] bg-gray-900 overflow-hidden">
                  <img
                    src={gallery[0].image_url}
                    alt={gallery[0].name}
                    onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}}
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-dark">{gallery[0].name}</h3>
                    <p className="text-right text-lg font-bold text-dark mt-1">{formatPrice(gallery[0].price)}</p>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{gallery[0].description}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/product/${gallery[0].id}`) }}
                    className="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                  >
                    Lihat Detail
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      {gallery.length > 1 && (
        <section className="px-6 md:px-16 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.slice(1).map((fish) => (
              <div key={fish.id} onClick={() => navigate(`/product/${fish.id}`)} className="group cursor-pointer">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={fish.image_url}
                    alt={fish.name}
                    onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-dark text-sm">{fish.name}</h4>
                <p className="text-gray-400 text-xs mb-1">{fish.species}</p>
                <p className="font-bold text-dark text-sm">{formatPrice(fish.price)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Join */}
      <section className="px-6 md:px-16 py-6 pb-16">
        <div className="relative bg-[#0a2744] rounded-3xl overflow-hidden px-8 md:px-16 py-14 text-center">
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at 50% 100%, #1a6a8a 0%, transparent 60%)' }} />
          <div className="relative z-10 max-w-lg mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Bergabung dengan Lingkaran Dalam.</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Daftar untuk pemberitahuan pribadi tentang kedatangan langka baru sebelum masuk ke galeri publik.
            </p>
            {joined ? (
              <div className="bg-teal-500/20 border border-teal-500/30 text-teal-400 px-6 py-3 rounded-xl text-sm font-medium">
                Anda berhasil bergabung! Selamat datang di Lingkaran Dalam.
              </div>
            ) : (
              <div className="flex gap-3 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="Email eksekutif Anda"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm px-4 py-3 rounded-xl outline-none focus:border-teal-400 transition-colors"
                />
                <button
                  onClick={() => { if (email) setJoined(true) }}
                  className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95 text-sm whitespace-nowrap"
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
