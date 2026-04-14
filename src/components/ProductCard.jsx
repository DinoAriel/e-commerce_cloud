import { useState } from 'react'

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
      .format(price)
      .replace('IDR', 'Rp')

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 hover:border-primary-border hover:shadow-xl hover:shadow-primary/5 overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1">

      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-primary-lighter">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full
            ${product.badge === 'Hot' ? 'bg-red-500 text-white' : ''}
            ${product.badge === 'Rare' ? 'bg-purple-600 text-white' : ''}
            ${product.badge === 'New' ? 'bg-green-500 text-white' : ''}
          `}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-400 italic mb-0.5">{product.species}</p>
        <h3 className="font-bold text-dark text-base leading-tight">{product.name}</h3>
        <p className="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xs text-gray-400">Mulai dari</p>
            <p className="text-primary font-bold text-lg leading-tight">
              {formatPrice(product.price).replace('Rp\xa0', 'Rp ')}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90
              ${added
                ? 'bg-green-500 text-white'
                : 'bg-primary-lighter text-primary hover:bg-primary hover:text-white'
              }`}
          >
            {added ? (
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
  )
}