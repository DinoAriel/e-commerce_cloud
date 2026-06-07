import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { increaseQty, decreaseQty, removeFromCart } from '../store/cartSlice'
import { useAuth } from '../lib/auth'
import { getCart, updateCartItem as apiUpdateCart, removeCartItem as apiRemoveCart } from '../lib/api'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const reduxItems = useSelector(state => state.cart.items)
  const [apiItems, setApiItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCart = useCallback(async () => {
    if (!user) { setLoading(false); return }
    try {
      setError(null)
      const data = await getCart(user.id)
      setApiItems(data || [])
    } catch {
      setApiItems([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const mappedApiItems = apiItems.map(ci => ({
    id: ci.product_id,
    cartItemId: ci.id,
    name: ci.products?.name || '',
    species: ci.products?.species || '',
    price: ci.products?.price || 0,
    image: ci.products?.image_url || '/images/discus.png',
    qty: ci.quantity,
  }))

  // Fix: fall back to Redux items when API returns empty for logged-in users
  const items = user
    ? (mappedApiItems.length > 0 ? mappedApiItems : reduxItems)
    : reduxItems

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const shipping = 0
  const total = subtotal + shipping

  const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

  const handleIncrease = async (item) => {
    if (user && item.cartItemId) {
      try {
        setError(null)
        await apiUpdateCart(item.cartItemId, item.qty + 1)
        fetchCart()
      } catch {
        setError('Gagal memperbarui jumlah')
      }
    } else {
      dispatch(increaseQty(item.id))
    }
  }

  const handleDecrease = async (item) => {
    if (user && item.cartItemId) {
      if (item.qty <= 1) return
      try {
        setError(null)
        await apiUpdateCart(item.cartItemId, item.qty - 1)
        fetchCart()
      } catch {
        setError('Gagal memperbarui jumlah')
      }
    } else {
      dispatch(decreaseQty(item.id))
    }
  }

  const handleRemove = async (item) => {
    if (user && item.cartItemId) {
      try {
        setError(null)
        await apiRemoveCart(item.cartItemId)
        fetchCart()
      } catch {
        setError('Gagal menghapus item')
      }
    } else {
      dispatch(removeFromCart(item.id))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4 text-slate-100">
        <div className="w-40 h-40 mb-8 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center">
          <svg className="w-16 h-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Keranjang Anda Kosong</h1>
        <p className="text-slate-400 mb-8 max-w-sm">
          Sepertinya Anda belum menemukan spesimen laut impian Anda. Mari jelajahi koleksi kami!
        </p>
        <Link
          to="/"
          className="bg-teal-500 text-slate-950 font-bold py-3 px-8 rounded-full hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 transition-all cursor-pointer"
        >
          Jelajahi Koleksi
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">

      {/* Header */}
      <div className="px-6 md:px-12 lg:px-24 pt-10 pb-6">
        <h1 className="text-3xl font-extrabold text-white">Keranjang Belanja</h1>
        <p className="text-slate-400 mt-1">{items.reduce((sum, i) => sum + i.qty, 0)} spesimen</p>
      </div>

      {error && (
        <div className="mx-6 md:mx-12 lg:mx-24 mb-4 bg-red-950/20 border border-red-900/50 rounded-xl p-3 flex items-center justify-between">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 text-lg leading-none cursor-pointer">&times;</button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 px-6 md:px-12 lg:px-24 pb-16">

        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.cartItemId || item.id} className="flex items-center gap-4 md:gap-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700/80 transition-all duration-300">

                {/* Image */}
                <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-xl overflow-hidden shrink-0 bg-slate-950">
                  <img
                    src={item.image || '/images/discus.png'}
                    alt={item.name}
                    onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}}
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[9px] font-bold tracking-widest uppercase bg-teal-500/10 border border-teal-500/30 text-teal-400 px-2.5 py-0.5 rounded-full mb-1.5">
                    Spesimen Akuatik
                  </span>
                  <h3 className="font-bold text-white text-base md:text-lg leading-tight truncate">
                    <Link to={`/product/${item.id}`} className="hover:text-teal-400 transition-colors">{item.name}</Link>
                  </h3>
                  <p className="text-slate-500 text-sm italic">{item.species}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDecrease(item)}
                    disabled={item.qty <= 1}
                    className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:border-slate-700 transition-all disabled:opacity-30 text-sm font-bold cursor-pointer"
                  >
                    &minus;
                  </button>
                  <span className="w-8 text-center font-bold text-white text-sm">{item.qty}</span>
                  <button
                    onClick={() => handleIncrease(item)}
                    className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:border-slate-700 transition-all text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="font-bold text-white text-lg">{formatPrice(item.price * item.qty)}</p>
                  {item.qty > 1 && (
                    <p className="text-xs text-slate-500">{formatPrice(item.price)} per spesimen</p>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1 shrink-0 cursor-pointer"
                  title="Hapus"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <Link
            to="/"
            className="text-teal-400 font-medium hover:underline flex items-center gap-2 mt-6 w-max text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali Belanja
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Ringkasan Pesanan</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Subtotal</span>
                <span className="text-slate-200 font-medium text-sm">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Ongkos Kirim</span>
                <span className="text-emerald-400 font-bold text-sm">GRATIS</span>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total Pembayaran</span>
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-teal-500 text-slate-950 font-extrabold py-4 rounded-[50px] mt-6 hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 transition-colors text-base active:scale-[0.98] cursor-pointer shadow-md"
            >
              Lanjutkan ke Pembayaran
            </button>

            {/* Promo Cards */}
            <div className="mt-6 space-y-3">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">&#x1F6E1;&#xFE0F;</span>
                <div>
                  <p className="font-bold text-sm text-white">Garansi Live-DOA</p>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    Garansi uang kembali 100% jika spesimen diterima dalam keadaan mati/sakit.
                  </p>
                </div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">&#x1F4E6;</span>
                <div>
                  <p className="font-bold text-sm text-white">Pengiriman Premium</p>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    Kemasan khusus dengan kontrol suhu ekstra untuk keamanan ikan hias.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-3 text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs">Sistem Terenkripsi</span>
              <div className="flex items-center gap-1.5 ml-1">
                <div className="w-8 h-5 bg-slate-950 border border-slate-850 rounded flex items-center justify-center text-[7px] font-bold text-slate-400">VISA</div>
                <div className="w-8 h-5 bg-slate-950 border border-slate-850 rounded flex items-center justify-center text-[7px] font-bold text-slate-400">MC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
