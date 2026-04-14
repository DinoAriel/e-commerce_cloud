import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { increaseQty, decreaseQty, removeFromCart } from '../store/cartSlice'

export default function CartPage() {
  const items = useSelector(state => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0)

  const formatPrice = (price) => {
    return price.toLocaleString('id-ID')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="w-48 h-48 mb-8 relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <img src="/images/mandarin.avif" alt="Empty Cart" className="relative z-10 w-full h-full object-cover rounded-full grayscale opacity-50 border-8 border-white" />
        </div>
        <h1 className="text-3xl font-bold text-dark mb-4">Keranjang Anda Kosong</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Sepertinya Anda belum menemukan ikan impian Anda. Mari jelajahi koleksi kami!
        </p>
        <Link 
          to="/"
          className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
        >
          Belanja Sekarang
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-12 lg:px-24">
      <h1 className="text-3xl font-bold text-dark mb-8">Keranjang Belanja</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Daftar Item */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-primary-border">
            <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-100 pb-4 mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-6">Produk</div>
              <div className="col-span-3 text-center">Kuantitas</div>
              <div className="col-span-3 text-right">Subtotal</div>
            </div>

            {items.map(item => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-gray-50 last:border-0 last:pb-0">
                
                {/* Produk Detail */}
                <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
                  <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-gray-100">
                    <img src={item.image || '/images/placeholder.avif'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-lg hover:text-primary transition-colors">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="text-gray-400 text-sm italic">{item.species}</p>
                    <p className="text-primary font-semibold mt-1">Rp {formatPrice(item.price)}</p>
                  </div>
                </div>

                {/* Kuantitas */}
                <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center mt-4 md:mt-0">
                  <span className="md:hidden text-gray-500 font-medium">Jumlah:</span>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-primary-border">
                    <button 
                      onClick={() => dispatch(decreaseQty(item.id))}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-primary hover:shadow rounded-lg transition-all"
                    >
                      -
                    </button>
                    <span className="font-bold text-dark w-4 text-center">{item.qty}</span>
                    <button 
                      onClick={() => dispatch(increaseQty(item.id))}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-primary hover:shadow rounded-lg transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal & Hapus */}
                <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center mt-2 md:mt-0">
                  <span className="md:hidden text-gray-500 font-medium">Subtotal:</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-dark text-lg">Rp {formatPrice(item.price * item.qty)}</span>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Hapus item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
          <Link 
            to="/"
            className="text-primary font-medium hover:underline flex items-center gap-2 mt-2 px-2 w-max"
          >
            <span>←</span> Lanjutkan Belanja
          </Link>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-primary-border sticky top-24">
            <h2 className="text-xl font-bold text-dark mb-6">Ringkasan Pesanan</h2>
            
            <div className="flex justify-between items-center mb-4 text-gray-600">
              <span>Total Item</span>
              <span className="font-medium text-dark">{items.reduce((sum, i) => sum + i.qty, 0)} barang</span>
            </div>
            
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100 text-gray-600">
              <span>Pengiriman</span>
              <span className="text-green-500 font-medium tracking-wide">Gratis</span>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-dark">Total</span>
              <span className="text-2xl font-bold text-primary">Rp {formatPrice(totalPrice)}</span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 text-lg flex items-center justify-center gap-2"
            >
              Lanjut ke Pembayaran <span>→</span>
            </button>

            <p className="text-xs text-gray-400 text-center mt-6">
              Garansi DOA 100% berlaku untuk setiap transaksi.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}