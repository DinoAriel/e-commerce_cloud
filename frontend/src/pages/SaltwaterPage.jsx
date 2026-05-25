import { useState, useEffect, useMemo } from 'react'
import { getProducts } from '../lib/api'
import CategoryPageLayout from '../components/CategoryPageLayout'

const hero = {
  bg: 'bg-gradient-to-b from-[#021d30] to-slate-950',
  gradient: 'radial-gradient(circle at 75% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 60%)',
  waveColor: '#06b6d4',
  badgeBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm',
  tag: 'Ikan Laut Premium',
  title: 'Saltwater Collection',
  description: 'Jelajahi galeri spesies laut eksotis kami. Dari Clownfish ikonis hingga Pacific Tangs paling langka, setiap spesimen dirawat secara profesional.',
  unit: 'Spesimen Premium',
}

const theme = {
  sidebarCard: 'bg-slate-900 border border-slate-800',
  sidebarAccent: 'text-teal-400',
  priceColor: 'text-teal-400',
  cartBtn: 'bg-teal-600 hover:bg-teal-500',
  activePage: 'bg-teal-600',
  hoverBorder: 'hover:border-teal-500/50 hover:shadow-cyan-950/20',
}

const speciesTypes = [
  { label: 'Angelfish', keywords: ['angel'] },
  { label: 'Clownfish', keywords: ['clown', 'nemo', 'anemone'] },
  { label: 'Tangs & Surgeons', keywords: ['tang', 'surgeon', 'regal'] },
  { label: 'Gobies', keywords: ['goby', 'watchman'] },
  { label: 'Wrasse', keywords: ['wrasse'] },
  { label: 'Lionfish', keywords: ['lion', 'scorpion'] },
]

const colorSwatches = [
  { label: 'Blue', color: '#3B82F6', keywords: ['blue', 'azure', 'regal', 'indigo', 'navy', 'cobalt', 'damselfish', 'chromis'] },
  { label: 'Yellow', color: '#EAB308', keywords: ['yellow', 'golden', 'gold', 'lemon', 'tang'] },
  { label: 'Orange', color: '#F97316', keywords: ['orange', 'fire', 'flame', 'clown', 'rust'] },
  { label: 'Green', color: '#22C55E', keywords: ['green', 'emerald', 'jade'] },
  { label: 'Red', color: '#EF4444', keywords: ['red', 'crimson', 'cardinal', 'ruby', 'cherry'] },
]

const temperamentOptions = [
  { label: 'Peaceful', badges: ['New', 'Aktif'] },
  { label: 'Semi-Aggressive', badges: ['Kuat', 'Hot'] },
  { label: 'Aggressive', badges: ['Rare', 'Langka'] },
]

export default function SaltwaterPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSpecies, setSelectedSpecies] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [temperament, setTemperament] = useState('')

  useEffect(() => {
    getProducts({ category: 'saltwater', limit: 50 })
      .then(data => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const toggleSpecies = (keywords) => {
    setSelectedSpecies(prev => {
      const key = keywords.join(',')
      const exists = prev.some(s => s.join(',') === key)
      return exists ? prev.filter(s => s.join(',') !== key) : [...prev, keywords]
    })
  }

  const clearFilters = () => {
    setSelectedSpecies([])
    setSelectedColor(null)
    setTemperament('')
  }

  const hasFilters = selectedSpecies.length > 0 || selectedColor || temperament

  const filterKey = `${selectedSpecies.map(s => s.join(',')).join('|')}|${selectedColor}|${temperament}`

  const filterFn = useMemo(() => {
    return (product) => {
      const search = `${product.name || ''} ${product.species || ''} ${product.description || ''}`.toLowerCase()

      if (selectedSpecies.length > 0) {
        const matches = selectedSpecies.some(keywords =>
          keywords.some(kw => search.includes(kw))
        )
        if (!matches) return false
      }

      if (selectedColor) {
        const swatch = colorSwatches.find(s => s.label === selectedColor)
        if (swatch && swatch.keywords.length > 0) {
          if (!swatch.keywords.some(kw => search.includes(kw))) return false
        }
      }

      if (temperament) {
        const opt = temperamentOptions.find(o => o.label === temperament)
        if (opt && opt.badges.length > 0) {
          if (!opt.badges.includes(product.badge)) return false
        }
      }

      return true
    }
  }, [selectedSpecies, selectedColor, temperament])

  const sidebarExtra = (
    <>
      {/* Specie Type */}
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">Specie Type</p>
        <div className="space-y-2.5">
          {speciesTypes.map(({ label, keywords }) => {
            const key = keywords.join(',')
            const checked = selectedSpecies.some(s => s.join(',') === key)
            return (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSpecies(keywords)}
                  className="w-4 h-4 rounded border-slate-800 accent-teal-600 bg-slate-900"
                />
                <span className="text-sm text-slate-300 group-hover:text-teal-400 transition-colors">{label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Vibrant Colors */}
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">Vibrant Colors</p>
        <div className="flex items-center gap-2.5 flex-wrap">
          {colorSwatches.map(({ label, color }) => (
            <button
              key={label}
              title={label}
              onClick={() => setSelectedColor(selectedColor === label ? null : label)}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                selectedColor === label ? 'border-teal-500 scale-110 shadow-md' : 'border-slate-800 hover:border-slate-600'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        {selectedColor && (
          <p className="text-[10px] text-slate-400 mt-2">Filtering: {selectedColor}</p>
        )}
      </div>

      {/* Temperament */}
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">Temperament</p>
        <div className="space-y-2.5">
          {temperamentOptions.map(({ label }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="temperament"
                checked={temperament === label}
                onChange={() => setTemperament(temperament === label ? '' : label)}
                className="w-4 h-4 accent-teal-600 bg-slate-900"
              />
              <span className="text-sm text-slate-300 group-hover:text-teal-400 transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-teal-400 font-semibold hover:underline mb-6 block"
        >
          Clear all filters
        </button>
      )}
    </>
  )

  return (
    <CategoryPageLayout
      products={products}
      loading={loading}
      hero={hero}
      theme={theme}
      sidebarExtra={sidebarExtra}
      filterFn={filterFn}
      filterKey={filterKey}
    />
  )
}
