import { useState, useEffect, useMemo } from 'react'
import { getProducts } from '../lib/api'
import CategoryPageLayout from '../components/CategoryPageLayout'

const hero = {
  bg: 'bg-gradient-to-br from-[#0A4D68] to-[#1E6BA8]',
  gradient: 'radial-gradient(ellipse at 70% 50%, #1E6BA8 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, #0A4D68 0%, transparent 50%)',
  waveColor: '#89d4ff',
  badgeBg: 'bg-teal-500/80',
  tag: 'Ikan Laut Premium',
  title: 'Saltwater Collection',
  description: 'Jelajahi galeri spesies laut eksotis kami. Dari Clownfish ikonis hingga Pacific Tangs paling langka, setiap spesimen dirawat secara profesional.',
  unit: 'Spesimen Premium',
}

const theme = {
  sidebarCard: 'bg-[#0A4D68]',
  sidebarAccent: 'text-teal-400',
  priceColor: 'text-[#0A4D68]',
  cartBtn: 'bg-[#0A4D68]',
  activePage: 'bg-[#0A4D68]',
  hoverBorder: 'hover:border-[#0A4D68]/30 hover:shadow-[#0A4D68]/5',
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
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Specie Type</p>
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
                  className="w-4 h-4 rounded border-gray-300 accent-[#0A4D68]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#0A4D68] transition-colors">{label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Vibrant Colors */}
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Vibrant Colors</p>
        <div className="flex items-center gap-2.5 flex-wrap">
          {colorSwatches.map(({ label, color }) => (
            <button
              key={label}
              title={label}
              onClick={() => setSelectedColor(selectedColor === label ? null : label)}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                selectedColor === label ? 'border-[#0A4D68] scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        {selectedColor && (
          <p className="text-[10px] text-gray-400 mt-2">Filtering: {selectedColor}</p>
        )}
      </div>

      {/* Temperament */}
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Temperament</p>
        <div className="space-y-2.5">
          {temperamentOptions.map(({ label }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="temperament"
                checked={temperament === label}
                onChange={() => setTemperament(temperament === label ? '' : label)}
                className="w-4 h-4 accent-[#0A4D68]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#0A4D68] transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-[#0A4D68] font-semibold hover:underline mb-6 block"
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
