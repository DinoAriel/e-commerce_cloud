import { useState, useEffect, useMemo } from 'react'
import { getProducts } from '../lib/api'
import CategoryPageLayout from '../components/CategoryPageLayout'

const hero = {
  bg: 'bg-gradient-to-br from-emerald-800 to-teal-900',
  gradient: 'radial-gradient(ellipse at 70% 50%, #065f46 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, #064e3b 0%, transparent 50%)',
  waveColor: '#6ee7b7',
  badgeBg: 'bg-emerald-500/80',
  tag: 'Air Tawar Premium',
  title: 'Freshwater Collection',
  description: 'Koleksi ikan air tawar terlengkap — dari Discus eksotis, Betta langka, hingga Arowana premium. Semua dipilih langsung dari breeder terpercaya.',
  unit: 'Ikan Air Tawar',
}

const theme = {
  sidebarCard: 'bg-emerald-800',
  sidebarAccent: 'text-emerald-400',
  priceColor: 'text-emerald-700',
  cartBtn: 'bg-emerald-700',
  activePage: 'bg-emerald-700',
  hoverBorder: 'hover:border-emerald-200 hover:shadow-emerald-500/5',
}

const speciesTypes = [
  { label: 'Cichlid', keywords: ['cichlid', 'oscar', 'flowerhorn', 'angelfish'] },
  { label: 'Betta', keywords: ['betta', 'splendens'] },
  { label: 'Tetra', keywords: ['tetra', 'neon', 'cardinal'] },
  { label: 'Guppy', keywords: ['guppy', 'guppies', 'poecilia'] },
  { label: 'Arowana', keywords: ['arowana', 'dragon'] },
  { label: 'Discus', keywords: ['discus', 'symphysodon'] },
  { label: 'Gourami', keywords: ['gourami', 'paradise'] },
  { label: 'Koi & Goldfish', keywords: ['koi', 'goldfish', 'carp'] },
]

const colorSwatches = [
  { label: 'Blue', color: '#3B82F6', keywords: ['blue', 'azure', 'indigo', 'cobalt', 'sapphire'] },
  { label: 'Yellow', color: '#EAB308', keywords: ['yellow', 'golden', 'gold', 'lemon'] },
  { label: 'Orange', color: '#F97316', keywords: ['orange', 'fire', 'flame', 'rust', 'copper'] },
  { label: 'Green', color: '#22C55E', keywords: ['green', 'emerald', 'jade', 'lime'] },
  { label: 'Red', color: '#EF4444', keywords: ['red', 'crimson', 'cherry', 'ruby', 'scarlet'] },
]

const careLevelOptions = [
  { label: 'Easy', badges: ['New', 'Aktif'] },
  { label: 'Moderate', badges: ['Kuat', 'Hot'] },
  { label: 'Difficult', badges: ['Rare', 'Langka'] },
]

export default function FreshwaterPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSpecies, setSelectedSpecies] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [careLevel, setCareLevel] = useState('')

  useEffect(() => {
    getProducts({ category: 'freshwater', limit: 50 })
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
    setCareLevel('')
  }

  const hasFilters = selectedSpecies.length > 0 || selectedColor || careLevel

  const filterKey = `${selectedSpecies.map(s => s.join(',')).join('|')}|${selectedColor}|${careLevel}`

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

      if (careLevel) {
        const opt = careLevelOptions.find(o => o.label === careLevel)
        if (opt && opt.badges.length > 0) {
          if (!opt.badges.includes(product.badge)) return false
        }
      }

      return true
    }
  }, [selectedSpecies, selectedColor, careLevel])

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
                  className="w-4 h-4 rounded border-gray-300 accent-emerald-700"
                />
                <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition-colors">{label}</span>
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
                selectedColor === label ? 'border-emerald-700 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        {selectedColor && (
          <p className="text-[10px] text-gray-400 mt-2">Filtering: {selectedColor}</p>
        )}
      </div>

      {/* Care Level */}
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Care Level</p>
        <div className="space-y-2.5">
          {careLevelOptions.map(({ label }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="careLevel"
                checked={careLevel === label}
                onChange={() => setCareLevel(careLevel === label ? '' : label)}
                className="w-4 h-4 accent-emerald-700"
              />
              <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-emerald-700 font-semibold hover:underline mb-6 block"
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
