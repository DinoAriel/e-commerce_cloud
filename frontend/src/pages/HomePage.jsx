import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import TopBreederSection from '../sections/TopBreederSection'
import TestimonialSection from '../sections/TestimonialSection'
import ConsultSection from '../sections/ConsultSection'
import AuctionSection from '../sections/AuctionSection'
import { getProducts } from '../lib/api'

const categories = [
  {
    name: 'Freshwater',
    desc: 'Ikan air tawar eksotis',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3C7 3 3 8 3 12s4 9 9 9 9-4 9-9c0-2-1-4-2-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9c0 1.657-1.343 3-3 3S9 10.657 9 9s1.343-3 3-3 3 1.343 3 3z" />
      </svg>
    ),
  },
  {
    name: 'Saltwater',
    desc: 'Ikan laut premium',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15c0 0 2-3 4-3s3 3 5 3 3-3 5-3 4 3 4 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10c0 0 2-3 4-3s3 3 5 3 3-3 5-3 4 3 4 3" />
      </svg>
    ),
  },
  {
    name: 'Rare Fish',
    desc: 'Koleksi langka dunia',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const params = searchQuery ? { search: searchQuery, limit: 50 } : { limit: 4 }
    getProducts(params)
      .then(data => setProducts(data.products || []))
      .catch(() => setError('Gagal memuat produk'))
      .finally(() => setLoading(false))
  }, [searchQuery])

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans overflow-x-hidden">

      {/* Search Results Header */}
      {searchQuery && (
        <div className="px-8 md:px-20 pt-8 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Hasil pencarian untuk "{searchQuery}"
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {loading ? 'Mencari...' : `${products.length} produk ditemukan`}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-teal-400 hover:underline text-sm font-medium cursor-pointer"
            >
              Hapus pencarian
            </button>
          </div>
        </div>
      )}

      {/* Hero Section - hide when searching */}
      {!searchQuery && (
        <section className="relative min-h-[480px] overflow-hidden flex flex-col md:flex-row items-center px-8 md:px-20 py-12 md:py-0 bg-gradient-to-b from-[#031525] to-slate-950 border-b border-slate-900/60">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_40%,#0e7490_0%,transparent_60%)]" />
          
          <div className="z-10 max-w-lg flex-1 mb-10 md:mb-0 relative">
            <span className="inline-flex items-center gap-2 border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Koleksi Premium 2026
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-6 leading-tight text-white">
              Jelajahi Dunia <br className="hidden md:block" />Bawah Laut yang <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 relative inline-block">
                Menakjubkan
              </span>
            </h1>
            <p className="text-slate-400 mt-6 text-base leading-relaxed max-w-md">
              Kami menyediakan ekosistem akuatik ke dalam rumah Anda dengan koleksi ikan hias dan peternak terbaik dunia.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => navigate('/freshwater')}
                className="bg-teal-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Mulai Belanja
              </button>
              <button
                onClick={() => navigate('/auctions')}
                className="border border-slate-800 text-slate-300 font-semibold px-8 py-3.5 rounded-xl hover:bg-slate-900/60 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Lihat Lelang
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center z-10 w-full relative py-8 md:py-0">
            <div className="relative w-full max-w-[440px] aspect-[1.2/1] group">
              {/* Subtle background glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/10 to-teal-500/5 blur-2xl group-hover:scale-105 transition-transform duration-500"></div>
              
              {/* Glassmorphic Image Frame */}
              <div className="relative w-full h-full bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-10 border border-slate-800 p-3 overflow-hidden">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950">
                  <img 
                    src="/images/single_fish_hero.png" 
                    alt="Single Premium Fish Specimen" 
                    className="w-full h-full object-cover scale-102 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Floating Badge - Top Right */}
              <div className="absolute -top-4 -right-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-2.5 shadow-2xl z-20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <div className="text-[10px] font-extrabold tracking-widest text-teal-400 uppercase">
                  Premium Collection
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && !searchQuery && (
        <div className="px-8 md:px-20 py-6">
          <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Search Results Loading */}
      {searchQuery && loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Search Results Grid */}
      {searchQuery && !loading && products.length === 0 && (
        <div className="px-8 md:px-20 py-20 text-center">
          <p className="text-slate-500 text-lg">Tidak ada produk yang cocok dengan pencarian Anda.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-teal-400 hover:underline font-medium cursor-pointer"
          >
            Kembali ke beranda
          </button>
        </div>
      )}

      {searchQuery && !loading && products.length > 0 && (
        <section className="px-8 md:px-20 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={{ ...product, image: product.image_url }} />
            ))}
          </div>
        </section>
      )}

      {/* Category Section - hide when searching */}
      {!searchQuery && (
        <section className="px-8 md:px-20 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => {
                  if (cat.name === 'Saltwater') navigate('/saltwater')
                  if (cat.name === 'Freshwater') navigate('/freshwater')
                  if (cat.name === 'Rare Fish') navigate('/rarefish')
                  if (cat.name === 'Auction') navigate('/auctions')
                }}
                className="bg-slate-900/40 border text-center md:text-left border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-cyan-950/20 rounded-3xl p-8 cursor-pointer transition-all duration-300 group transform hover:-translate-y-1"
              >
                <div className="bg-teal-500/10 text-teal-400 w-14 h-14 rounded-2xl mb-6 mx-auto md:mx-0 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Breeder Section */}
      {!searchQuery && <TopBreederSection />}

      {/* Produk Terpopuler Section */}
      {!searchQuery && (
        <section className="px-8 md:px-20 py-16 bg-slate-900/20 rounded-t-[3rem] border-t border-slate-900">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white">Koleksi Terpopuler</h2>
              <p className="text-slate-400 text-sm mt-2">Pilihan terbaik untuk akuarium Anda minggu ini</p>
            </div>
            <button
              onClick={() => navigate('/freshwater')}
              className="text-slate-300 font-semibold text-sm hover:text-teal-400 transition-colors flex items-center gap-1 group cursor-pointer"
            >
              Lihat Semua
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={{ ...product, image: product.image_url }} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Lelang Langsung */}
      {!searchQuery && <AuctionSection />}

      {/* Testimoni */}
      {!searchQuery && <TestimonialSection />}

      {/* Konsultasi */}
      {!searchQuery && <ConsultSection />}

      {/* Banner Garansi */}
      {!searchQuery && (
        <section className="px-8 md:px-20 py-16 bg-slate-950">
          <div className="bg-gradient-to-br from-[#0c2438] to-[#04111d] border border-slate-800 shadow-md rounded-[2.5rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-6 inline-block bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-800">🛡️</div>
              <h2 className="text-3xl font-bold text-white mb-4">100% Garansi Sampai Tujuan</h2>
              <p className="text-slate-400 mt-2 text-base max-w-xl mx-auto leading-relaxed">
                Dead on Arrival (DOA) Guarantee. Jika ikan datang dalam keadaan tidak normal, kami memberikan garansi uang kembali atau penggantian produk secara gratis.
              </p>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
