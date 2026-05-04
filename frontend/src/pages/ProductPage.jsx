import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAddToCart } from '../lib/useAddToCart'
import { getProduct } from '../lib/api'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addToCart = useAddToCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProduct(id)
      .then(data => setProduct(data))
      .catch(() => setError('Produk tidak ditemukan'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (added || adding) return
    setAdding(true)

    try {
      await addToCart(product)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } catch (err) {
      setError(err.message || 'Gagal menambah ke keranjang')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline flex items-center gap-2 mx-auto"
          >
            <span>←</span> Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-dark mb-4">Produk Tidak Ditemukan</h1>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline flex items-center gap-2"
        >
          <span>←</span> Kembali ke Beranda
        </button>
      </div>
    )
  }

  const formattedPrice = product.price >= 1000000
    ? (product.price / 1000000).toFixed(1) + 'jt'
    : product.price.toLocaleString('id-ID')

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-8 md:px-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-gray-500 hover:text-primary transition-colors flex items-center gap-2 font-medium"
      >
        <span>←</span> Kembali
      </button>

      <div className="bg-white rounded-[2rem] shadow-sm border border-primary-border overflow-hidden flex flex-col md:flex-row">

        {/* Gambar Produk */}
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-primary-lighter to-white relative">
          <div className="absolute inset-0 bg-primary/5 pattern-dots pattern-primary/20 pattern-size-4 opacity-50"></div>
          {product.badge && (
            <span className="absolute top-8 left-8 bg-primary-dark text-white text-xs uppercase font-bold tracking-wider px-4 py-1.5 rounded-full shadow-lg z-10">
              {product.badge}
            </span>
          )}
          <img
            src={product.image_url || '/images/discus.png'}
            alt={product.name}
            onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}}
          />
        </div>

        {/* Info Produk */}
        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-2">
            {product.categories && (
              <span className="text-primary text-sm font-bold tracking-wider uppercase bg-primary-lighter px-3 py-1 rounded-full">
                {product.categories.name}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark mt-4 leading-tight">{product.name}</h1>
          <p className="text-gray-400 text-lg mt-2 italic font-serif">"{product.species}"</p>

          <div className="text-3xl font-bold text-dark mt-8 border-b border-gray-100 pb-8">
            Rp {formattedPrice}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-dark mb-3">Deskripsi</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'Tidak ada deskripsi tersedia untuk ikan ini.'}
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl mb-8">
              <div className="flex items-center gap-2">
                <span className="text-primary text-lg">🛡️</span> Garansi DOA 100%
              </div>
              <div className="mx-2 w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <span className="text-primary text-lg">📦</span> Pengiriman Aman
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`w-full font-bold py-4 rounded-xl transition-all duration-200 text-lg flex items-center justify-center gap-3
              ${added
                ? 'bg-green-500 text-white'
                : 'bg-primary text-white hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]'
              }
              ${adding ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {adding ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : added ? (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Ditambahkan!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Tambah ke Keranjang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
