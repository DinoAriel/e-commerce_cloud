import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddToCart } from '../lib/useAddToCart'

const ITEMS_PER_PAGE = 6

const badgeColors = {
  Hot: 'bg-orange-500',
  Rare: 'bg-purple-600',
  New: 'bg-green-500',
  Kuat: 'bg-teal-500',
  Aktif: 'bg-blue-500',
  Langka: 'bg-red-500',
}

export default function CategoryPageLayout({ products, loading, hero, theme, sidebarExtra, filterFn, filterKey }) {
  const navigate = useNavigate()
  const addToCart = useAddToCart()
  const [sortBy, setSortBy] = useState('Terpopuler')
  const [currentPage, setCurrentPage] = useState(1)
  const [addedId, setAddedId] = useState(null)

  useEffect(() => { setCurrentPage(1) }, [filterKey])

  let filtered = filterFn ? products.filter(filterFn) : [...products]
  if (sortBy === 'Harga Terendah') filtered.sort((a, b) => a.price - b.price)
  if (sortBy === 'Harga Tertinggi') filtered.sort((a, b) => b.price - a.price)

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

  const handleAddToCart = async (e, fish) => {
    e.stopPropagation()
    await addToCart(fish)
    setAddedId(fish.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const sortOptions = ['Terpopuler', 'Harga Terendah', 'Harga Tertinggi', 'Terbaru']

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Banner */}
      <div className={`relative mx-4 md:mx-8 mt-4 rounded-3xl overflow-hidden min-h-[220px] md:min-h-[280px] flex items-end p-8 md:p-12 ${hero.bg}`}>
        <div className="absolute inset-0 opacity-30" style={{ background: hero.gradient }} />
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
          {[0, 40, 80, 120, 160].map((offset, i) => (
            <path key={i} d={`M0 ${100 + offset} Q200 ${60 + offset} 400 ${100 + offset} T800 ${100 + offset}`}
              fill="none" stroke={hero.waveColor} strokeWidth="1.5" />
          ))}
        </svg>
        <div className="relative z-10 max-w-xl">
          <span className={`inline-block ${hero.badgeBg} text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase`}>
            {hero.tag}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {hero.title}
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            {hero.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8 px-4 md:px-8 py-10">

        {/* Sidebar Filter */}
        <aside className="hidden md:block w-52 shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zM6 12a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zM9 19a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
            </svg>
            <span className="font-bold text-dark text-sm">Filter Hasil</span>
          </div>

          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Urutkan</p>
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setCurrentPage(1) }}
              className="w-full text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none"
            >
              {sortOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {sidebarExtra}

          <div className={`${theme.sidebarCard} rounded-2xl p-4 text-white`}>
            <div className="flex items-center gap-2 mb-2">
              <svg className={`w-4 h-4 ${theme.sidebarAccent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="font-bold text-sm">Garansi DOA</p>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-3">
              Garansi ikan sampai tujuan dalam keadaan sehat atau uang kembali.
            </p>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-bold text-dark">{filtered.length} {hero.unit}</span>
            </p>
            <div className="flex items-center gap-2 md:hidden">
              <span className="text-sm text-gray-500">Urutkan:</span>
              <select
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setCurrentPage(1) }}
                className="text-sm font-semibold text-dark bg-transparent border-none outline-none cursor-pointer"
              >
                {sortOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {paginated.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Belum ada produk untuk kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map(fish => (
                <div key={fish.id} onClick={() => navigate(`/product/${fish.id}`)} className={`group bg-white border border-gray-100 hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${theme.hoverBorder || 'hover:border-primary-border hover:shadow-primary/5'}`}>
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={fish.image_url}
                      alt={fish.name}
                      onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {fish.badge && (
                      <span className={`absolute top-3 left-3 ${badgeColors[fish.badge] || 'bg-gray-500'} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
                        {fish.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 italic mb-0.5">{fish.species}</p>
                    <h3 className="font-bold text-dark text-base">{fish.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <p className={`text-lg font-bold ${theme.priceColor}`}>
                        {formatPrice(fish.price)}
                      </p>
                      <button
                        onClick={(e) => handleAddToCart(e, fish)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90
                          ${addedId === fish.id ? 'bg-green-500 text-white' : `${theme.cartBtn} text-white hover:opacity-90`}`}
                      >
                        {addedId === fish.id ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 disabled:opacity-30 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all
                    ${currentPage === p ? `${theme.activePage} text-white` : 'border border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 disabled:opacity-30 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
