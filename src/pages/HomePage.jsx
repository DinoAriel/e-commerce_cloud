import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import TopBreederSection from '../sections/TopBreederSection'
import TestimonialSection from '../sections/TestimonialSection'
import ConsultSection from '../sections/ConsultSection'
import AuctionSection from '../sections/AuctionSection'

import { products } from '../data/products'

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

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans overflow-x-hidden">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light to-white min-h-[480px] flex flex-col md:flex-row items-center px-8 md:px-20 py-12 md:py-0">
        <div className="z-10 max-w-lg flex-1 mb-10 md:mb-0">
          <span className="bg-primary-lighter text-primary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-primary-border">
            Koleksi Premium 2024
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 leading-[1.15] text-dark">
            Jelajahi Dunia <br className="hidden md:block" />Bawah Laut yang <br className="hidden md:block" />
            <span className="text-primary relative inline-block">
              Menakjubkan
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
              </svg>
            </span>
          </h1>
          <p className="text-gray-500 mt-6 text-base leading-relaxed max-w-md">
            Kami menyediakan ekosistem akuatik ke dalam rumah Anda dengan koleksi ikan hias dan peternak terbaik dunia.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => navigate('/cart')}
              className="bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all duration-200"
            >
              Mulai Belanja
            </button>
            <button
              onClick={() => navigate('/auctions')}
              className="border-2 border-primary-border text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-lighter active:scale-95 transition-all duration-200 bg-white"
            >
              Lihat Lelang
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center z-10 w-full relative">
          <div className="relative w-full max-w-[420px] aspect-[5/4]">
            <div className="absolute top-[5%] right-[5%] w-[85%] h-[90%] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 backdrop-blur-sm"></div>
            <img
              src="/images/betta.avif"
              alt="Ikan hias premium"
              className="absolute top-0 right-0 w-[95%] h-[90%] object-cover rounded-3xl shadow-[0_20px_60px_rgba(137,212,255,0.3)] z-10 border-4 border-white"
            />
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-primary-border flex items-center gap-4 z-20 animate-bounce cursor-default" style={{ animationDuration: '3s' }}>
              <span className="text-3xl bg-primary-lighter p-2 rounded-xl">🐠</span>
              <div>
                <div className="text-sm font-bold text-dark">500+ Spesies</div>
                <div className="text-xs font-medium text-primary">Tersedia sekarang</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="px-8 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => {
                if (cat.name === 'Saltwater') navigate('/saltwater')
                if (cat.name === 'Freshwater') navigate('/')
                if (cat.name === 'Rare Fish') navigate('/rarefish')
                if (cat.name === 'Auction') navigate('/auctions')
              }}
              className="bg-white border text-center md:text-left border-gray-100 hover:border-primary-border hover:shadow-xl hover:shadow-primary/5 rounded-3xl p-8 cursor-pointer transition-all duration-300 group transform hover:-translate-y-1"
            >
              <div className="bg-primary/10 text-primary w-14 h-14 rounded-2xl mb-6 mx-auto md:mx-0 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">{cat.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Breeder Section */}
      <TopBreederSection />

      {/* Produk Terpopuler Section */}
      <section className="px-8 md:px-20 py-10 bg-gray-50 rounded-t-[3rem]">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-dark">Koleksi Terpopuler</h2>
            <p className="text-gray-500 text-sm mt-2">Pilihan terbaik untuk akuarium Anda minggu ini</p>
          </div>
          <button className="text-dark font-semibold text-sm hover:text-primary transition-colors flex items-center gap-1 group">
            Lihat Semua
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Lelang Langsung */}
      <AuctionSection />

      {/* Testimoni */}
      <TestimonialSection />

      {/* Konsultasi */}
      <ConsultSection />

      {/* Banner Garansi */}
      <section className="px-8 md:px-20 py-16 bg-gray-50">
        <div className="bg-gradient-to-br from-primary-light to-white border border-primary-border shadow-md rounded-[2.5rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-dark/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-6 inline-block bg-white p-4 rounded-2xl shadow-sm border border-primary-border">🛡️</div>
            <h2 className="text-3xl font-bold text-dark mb-4">100% Garansi Sampai Tujuan</h2>
            <p className="text-gray-500 mt-2 text-base max-w-xl mx-auto leading-relaxed">
              Dead on Arrival (DOA) Guarantee. Jika ikan datang dalam keadaan tidak normal, kami memberikan garansi uang kembali atau penggantian produk secara gratis.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}