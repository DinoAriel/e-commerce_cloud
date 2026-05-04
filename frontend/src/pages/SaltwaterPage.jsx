import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

const allFish = [
  { id: 1, name: 'Percula Clownfish', species: 'Amphiprion percula', price: 34.99 * 15000, badge: 'Kuat', image: '/images/flowerhorn.png', type: 'Clownfish', color: 'orange', temperament: 'Damai' },
  { id: 2, name: 'Royal Blue Tang', species: 'Paracanthurus hepatus', price: 89.00 * 15000, badge: 'Aktif', image: '/images/blue-tang.avif', type: 'Tangs & Surgeons', color: 'blue', temperament: 'Semi-Agresif' },
  { id: 3, name: 'Flame Angelfish', species: 'Centropyge loricula', price: 120.00 * 15000, badge: 'Langka', image: '/images/angelfish.avif', type: 'Angelfish', color: 'orange', temperament: 'Semi-Agresif' },
  { id: 4, name: 'Mandarin Dragonet', species: 'Synchiropus splendidus', price: 45.50 * 15000, badge: null, image: '/images/mandarin.avif', type: 'Godies', color: 'green', temperament: 'Damai' },
  { id: 5, name: 'Yellow Tang', species: 'Zebrasoma flavescens', price: 180.00 * 15000, badge: null, image: '/images/blue-tang.avif', type: 'Tangs & Surgeons', color: 'yellow', temperament: 'Semi-Agresif' },
  { id: 6, name: 'Copperband Butterfly', species: 'Chelmon rostratus', price: 62.99 * 15000, badge: null, image: '/images/angelfish.avif', type: 'Angelfish', color: 'yellow', temperament: 'Damai' },
  { id: 7, name: 'Ocellaris Clownfish', species: 'Amphiprion ocellaris', price: 28.99 * 15000, badge: 'Kuat', image: '/images/flowerhorn.png', type: 'Clownfish', color: 'orange', temperament: 'Damai' },
  { id: 8, name: 'Purple Tang', species: 'Zebrasoma xanthurum', price: 220.00 * 15000, badge: 'Langka', image: '/images/blue-tang.avif', type: 'Tangs & Surgeons', color: 'purple', temperament: 'Agresif' },
  { id: 9, name: 'Koran Angelfish', species: 'Pomacanthus semicirculatus', price: 95.00 * 15000, badge: null, image: '/images/angelfish.avif', type: 'Angelfish', color: 'blue', temperament: 'Semi-Agresif' },
]

const ITEMS_PER_PAGE = 6
const specieTypes = ['Angelfish', 'Clownfish', 'Tangs & Surgeons', 'Godies']
const colorOptions = [
  { name: 'orange', hex: '#F97316' },
  { name: 'blue', hex: '#3B82F6' },
  { name: 'yellow', hex: '#EAB308' },
  { name: 'green', hex: '#22C55E' },
  { name: 'purple', hex: '#A855F7' },
]
const temperaments = ['Damai', 'Semi-Agresif', 'Agresif']
const sortOptions = ['Paling Populer', 'Harga: Rendah ke Tinggi', 'Harga: Tinggi ke Rendah', 'Terbaru']

const badgeColors = {
  Kuat: 'bg-teal-500',
  Aktif: 'bg-blue-500',
  Langka: 'bg-red-500',
}

export default function SaltwaterPage() {
  const dispatch = useDispatch()
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedTemperament, setSelectedTemperament] = useState(null)
  const [sortBy, setSortBy] = useState('Paling Populer')
  const [currentPage, setCurrentPage] = useState(1)
  const [addedId, setAddedId] = useState(null)

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
    setCurrentPage(1)
  }

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
    setCurrentPage(1)
  }

  const handleAddToCart = (fish) => {
    dispatch(addToCart({ ...fish, quantity: 1 }))
    setAddedId(fish.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  // Filter
  let filtered = allFish.filter(f => {
    const typeOk = selectedTypes.length === 0 || selectedTypes.includes(f.type)
    const colorOk = selectedColors.length === 0 || selectedColors.includes(f.color)
    const tempOk = !selectedTemperament || f.temperament === selectedTemperament
    return typeOk && colorOk && tempOk
  })

  // Sort
  if (sortBy === 'Harga: Rendah ke Tinggi') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'Harga: Tinggi ke Rendah') filtered = [...filtered].sort((a, b) => b.price - a.price)

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Banner */}
      <div className="relative mx-4 md:mx-8 mt-4 rounded-3xl overflow-hidden bg-[#0a2744] min-h-[220px] md:min-h-[280px] flex items-end p-8 md:p-12">
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, #1e5a8a 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, #0d3b6e 0%, transparent 50%)' }} />
        {/* Decorative wave lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
          {[0,40,80,120,160].map((offset, i) => (
            <path key={i} d={`M0 ${100+offset} Q200 ${60+offset} 400 ${100+offset} T800 ${100+offset}`}
              fill="none" stroke="#89d4ff" strokeWidth="1.5" />
          ))}
        </svg>
        <div className="relative z-10 max-w-xl">
          <span className="inline-block bg-teal-500/80 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            Pilihan Premium
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Koleksi <br />Ikan Laut
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Jelajahi galeri spesies laut eksotis kami. Dari Clownfish yang ikonis hingga Pacific Tangs paling langka, setiap spesimen dirawat secara profesional.
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

          {/* Specie Type */}
          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Jenis Spesies</p>
            <div className="space-y-2.5">
              {specieTypes.map(type => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggleType(type)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all
                      ${selectedTypes.includes(type) ? 'bg-dark border-dark' : 'border-gray-300 group-hover:border-gray-500'}`}
                  >
                    {selectedTypes.includes(type) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-dark transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Warna Terang</p>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map(c => (
                <button
                  key={c.name}
                  onClick={() => toggleColor(c.name)}
                  className={`w-7 h-7 rounded-full transition-all border-2 ${selectedColors.includes(c.name) ? 'border-dark scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Temperament */}
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Temperamen</p>
            <div className="space-y-2">
              {temperaments.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTemperament(selectedTemperament === t ? null : t)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all
                    ${selectedTemperament === t ? 'bg-dark text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* DOA Guarantee */}
          <div className="bg-[#1a3a5c] rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="font-bold text-sm">Garansi DOA</p>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-3">
              Kami memastikan setiap ikan tiba dengan sehat atau uang kembali.
            </p>
            <button className="text-teal-400 text-xs font-semibold hover:text-teal-300 transition-colors">
              Pelajari Lebih Lanjut →
            </button>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-bold text-dark">{filtered.length} Spesimen Premium</span>
            </p>
            <div className="flex items-center gap-2">
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

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map(fish => (
              <div key={fish.id} className="group bg-white border border-gray-100 hover:border-primary-border hover:shadow-xl hover:shadow-primary/5 rounded-2xl overflow-hidden transition-all duration-300">
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={fish.image}
                    alt={fish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {fish.badge && (
                    <span className={`absolute top-3 left-3 ${badgeColors[fish.badge]} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
                      {fish.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 italic mb-0.5">{fish.species}</p>
                  <h3 className="font-bold text-dark text-base">{fish.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xl font-bold text-dark">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(fish.price)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(fish)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90
                        ${addedId === fish.id ? 'bg-green-500 text-white' : 'bg-[#1a3a5c] text-white hover:bg-[#0f2740]'}`}
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

              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all
                    ${currentPage === p ? 'bg-dark text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  {p}
                </button>
              ))}

              {totalPages > 4 && <span className="text-gray-400 text-sm">...</span>}
              {totalPages > 3 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all
                    ${currentPage === totalPages ? 'bg-dark text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  {totalPages}
                </button>
              )}

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