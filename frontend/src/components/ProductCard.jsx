import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddToCart } from '../lib/useAddToCart'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const addToCart = useAddToCart()
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const stock = product.stock ?? 0
  const isOutOfStock = stock === 0
  const isLowStock = stock > 0 && stock <= 5

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    if (isOutOfStock) return
    await addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
      .format(price)
      .replace('IDR', 'Rp')

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className={`group bg-slate-900/40 border hover:bg-slate-900/60 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-cyan-950/20 ${
        isOutOfStock
          ? 'border-slate-800/50 opacity-75'
          : 'border-slate-800 hover:border-slate-700/80'
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-slate-950">
        <img
          src={imgError ? '/images/discus.png' : (product.image || product.image_url)}
          alt={product.name}
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'opacity-50 grayscale' : 'opacity-90'}`}
        />

        {/* Overlay for out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
            <span className="bg-red-500/90 text-white text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Stok Habis
            </span>
          </div>
        )}

        {/* Badge (only show if in stock) */}
        {!isOutOfStock && product.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border border-white/5 shadow-md
            ${product.badge === 'Hot' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : ''}
            ${product.badge === 'Rare' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : ''}
            ${product.badge === 'New' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : ''}
            ${product.badge === 'Best Seller' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' : ''}
          `}>
            {product.badge}
          </span>
        )}

        {/* Low stock badge */}
        {isLowStock && !isOutOfStock && (
          <span className="absolute top-3 right-3 bg-amber-500/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md">
            Sisa {stock}!
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between min-h-[170px]">
        <div>
          <p className="text-xs text-slate-500 italic mb-0.5">{product.species}</p>
          <h3 className="font-bold text-white text-base leading-tight group-hover:text-teal-400 transition-colors line-clamp-1">{product.name}</h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mulai dari</p>
            <p className={`font-extrabold text-lg leading-tight ${isOutOfStock ? 'text-slate-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300'}`}>
              {formatPrice(product.price).replace('Rp\xa0', 'Rp ')}
            </p>
            {/* Stock indicator */}
            {!isOutOfStock && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className={`text-[10px] font-semibold ${isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isLowStock ? `Sisa ${stock} ekor` : `Stok: ${stock} ekor`}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            title={isOutOfStock ? 'Stok habis' : 'Tambah ke keranjang'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90 shadow-md
              ${isOutOfStock
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : added
                  ? 'bg-emerald-500 text-white shadow-emerald-950/20'
                  : 'bg-teal-500 text-slate-950 hover:bg-teal-400 hover:shadow-teal-500/20 cursor-pointer'
              }`}
          >
            {added ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : isOutOfStock ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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
