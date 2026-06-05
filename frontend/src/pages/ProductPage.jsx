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

  // Stock helpers (computed after product loads)
  const stock = product?.stock ?? 0
  const isOutOfStock = stock === 0
  const isLowStock = stock > 0 && stock <= 5

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProduct(id)
      .then(data => setProduct(data))
      .catch(() => setError('Produk tidak ditemukan'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (added || adding || isOutOfStock) return
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-teal-400 hover:underline flex items-center gap-2 mx-auto cursor-pointer"
          >
            <span>←</span> Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Produk Tidak Ditemukan</h1>
        <button
          onClick={() => navigate('/')}
          className="text-teal-400 hover:underline flex items-center gap-2 cursor-pointer"
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
    <div className="bg-slate-950 min-h-screen py-10 px-8 md:px-20 text-slate-100">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 font-medium cursor-pointer"
      >
        <span>←</span> Kembali
      </button>

      <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800/80 overflow-hidden flex flex-col md:flex-row shadow-2xl">

        {/* Gambar Produk */}
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-slate-950/40 relative border-r border-slate-800/80">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_40%,#0e7490_0%,transparent_60%)]"></div>
          {product.badge && (
            <span className="absolute top-8 left-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full border border-white/5 shadow-lg z-10">
              {product.badge}
            </span>
          )}
          <img
            src={product.image_url || '/images/discus.png'}
            alt={product.name}
            onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}}
            className="max-h-[350px] object-contain rounded-2xl opacity-95 transition-opacity hover:opacity-100"
          />
        </div>

        {/* Info Produk */}
        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-2">
            {product.categories && (
              <span className="text-teal-400 text-xs font-bold tracking-widest uppercase bg-teal-500/10 border border-teal-500/30 px-4 py-1.5 rounded-full">
                {product.categories.name}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-6 leading-tight">{product.name}</h1>
          <p className="text-slate-400 text-lg mt-2 italic">"{product.species}"</p>

          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 mt-8 border-b border-slate-800 pb-8">
            Rp {formattedPrice}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-3">Deskripsi</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              {product.description || 'Tidak ada deskripsi tersedia untuk ikan ini.'}
            </p>
          </div>

          {/* Stock Status */}
          <div className="mt-6">
            {isOutOfStock ? (
              <div className="flex items-center gap-3 bg-red-950/30 border border-red-900/50 rounded-2xl px-5 py-3.5 mb-4">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-red-400 font-bold text-sm">Stok Habis</p>
                  <p className="text-red-400/70 text-xs mt-0.5">Ikan ini sedang tidak tersedia. Cek kembali nanti.</p>
                </div>
              </div>
            ) : (
              <div className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 mb-4 border ${
                isLowStock
                  ? 'bg-amber-950/30 border-amber-900/50'
                  : 'bg-emerald-950/30 border-emerald-900/50'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isLowStock ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <div>
                  <p className={`font-bold text-sm ${isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isLowStock ? `Stok Hampir Habis — Sisa ${stock} Ekor!` : `Tersedia — ${stock} Ekor`}
                  </p>
                  <p className={`text-xs mt-0.5 ${isLowStock ? 'text-amber-400/70' : 'text-emerald-400/70'}`}>
                    {isLowStock ? 'Segera pesan sebelum kehabisan!' : 'Siap dikirim dengan aman ke seluruh Indonesia'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl mb-8">
              <div className="flex items-center gap-2">
                <span className="text-teal-400 text-lg">🛡️</span> Garansi DOA 100%
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
              <div className="flex items-center gap-2">
                <span className="text-teal-400 text-lg">📦</span> Pengiriman Aman
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-950/20 border border-red-900/50 rounded-xl p-3 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('openChatContext'))
              }}
              className="w-16 shrink-0 flex items-center justify-center bg-slate-800 text-slate-300 hover:text-teal-400 hover:bg-slate-700 rounded-xl transition-colors shadow-lg cursor-pointer"
              title="Chat Penjual"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={adding || isOutOfStock}
              className={`flex-1 font-bold py-4 rounded-xl transition-all duration-200 text-sm tracking-wide uppercase flex items-center justify-center gap-3 shadow-lg
              ${isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : added
                  ? 'bg-emerald-500 text-white shadow-emerald-950/20 cursor-pointer'
                  : 'bg-teal-500 text-slate-950 hover:bg-teal-400 hover:shadow-teal-500/20 active:scale-[0.98] cursor-pointer'
              }
              ${adding ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {adding ? (
              <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : added ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Ditambahkan!
              </>
            ) : isOutOfStock ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Stok Habis
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                </svg>
                Tambah ke Keranjang
              </>
            )}
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}
