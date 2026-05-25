import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { clearCart } from '../store/cartSlice'
import { useAuth } from '../lib/auth'
import { createOrder, updateOrderStatus } from '../lib/api'

export default function CheckoutPage() {
  const items = useSelector(state => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [address, setAddress] = useState('')
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
  })

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0)

  const formatPrice = (price) => {
    return price.toLocaleString('id-ID')
  }

  const handleFormInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      let createdOrder = null
      if (user) {
        createdOrder = await createOrder({
          user_id: user.id,
          shipping_address: address || 'Alamat Default'
        })
      }
      
      if (createdOrder && createdOrder.snap_token) {
        window.snap.pay(createdOrder.snap_token, {
          onSuccess: async function(result) {
            try {
              // Update status pesanan ke 'paid' secara lokal dari frontend (karena webhook memerlukan tunnel internet ke localhost)
              await updateOrderStatus(createdOrder.id, 'paid')
            } catch (err) {
              console.error("Gagal memperbarui status order secara lokal:", err)
            }
            dispatch(clearCart())
            alert("Pembayaran Berhasil! Lihat riwayat & beri ulasan di menu Profil & Ulasan.")
            navigate('/')
          },
          onPending: function(result) {
            dispatch(clearCart())
            alert("Menunggu Pembayaran! Silakan selesaikan pembayaran di aplikasi m-banking / e-wallet Anda.")
            navigate('/')
          },
          onError: function(result) {
            alert("Pembayaran Gagal!")
          },
          onClose: function() {
            alert("Anda menutup halaman pembayaran sebelum menyelesaikan transfer.")
          }
        })
      } else {
        throw new Error("Gagal memperoleh token pembayaran dari Midtrans")
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memproses pesanan')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center text-slate-100">
        <h1 className="text-3xl font-extrabold text-white mb-4">Keranjang Kosong</h1>
        <button onClick={() => navigate('/')} className="text-teal-400 hover:underline cursor-pointer">Belanja Sekarang</button>
      </div>
    )
  }

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 md:px-12 lg:px-24 text-slate-100">
      <h1 className="text-3xl font-extrabold text-white mb-8">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Form Pengiriman */}
        <div className="lg:w-2/3">
          <form onSubmit={handleFormSubmit} className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-800/80 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Informasi Pengiriman</h2>
            
            {error && (
              <div className="mb-4 bg-red-950/20 border border-red-900/50 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Nama Lengkap</label>
                <input 
                  required 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormInputChange}
                  className="w-full border border-slate-800 rounded-xl px-4 py-3 bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-colors" 
                  placeholder="Budi Santoso" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2">Nomor Telepon</label>
                <input 
                  required 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormInputChange}
                  className="w-full border border-slate-800 rounded-xl px-4 py-3 bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-colors" 
                  placeholder="081234567890" 
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-400 mb-2">Alamat Lengkap</label>
              <textarea 
                required 
                rows="3" 
                className="w-full border border-slate-800 rounded-xl px-4 py-3 bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-colors" 
                placeholder="Jl. Sudirman No. 123..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>

            <h2 className="text-xl font-bold text-white mb-6 mt-10 border-b border-slate-800 pb-4">Metode Pembayaran</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border border-teal-500/30 bg-teal-500/5 rounded-xl">
                <span className="block font-bold text-teal-400">Midtrans Payment Gateway</span>
                <span className="text-sm text-slate-400">Mendukung Gopay, Virtual Account, Kartu Kredit, dll.</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`mt-10 w-full text-slate-950 font-extrabold py-4 rounded-xl transition-all duration-200 text-lg flex items-center justify-center gap-2 cursor-pointer shadow-md ${isSubmitting ? 'bg-slate-800 text-slate-500' : 'bg-teal-500 hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98]'}`}
            >
              {isSubmitting ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
          </form>
          <Link 
            to="/cart"
            className="text-slate-400 hover:text-teal-400 font-medium flex items-center gap-2 mt-6 px-2 w-max transition-colors"
          >
            <span>←</span> Kembali ke Keranjang
          </Link>
        </div>

        {/* Ringkasan Belanja */}
        <div className="lg:w-1/3">
          <div className="bg-slate-900/60 rounded-[2.5rem] p-8 border border-slate-800/80 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Ringkasan Pesanan</h2>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-slate-800 relative bg-slate-950">
                    <img src={item.image || '/images/placeholder.avif'} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-teal-500 text-slate-950 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {item.qty}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm leading-tight">{item.name}</h4>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 font-extrabold text-sm mt-1">Rp {formatPrice(item.price * item.qty)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 border-t border-slate-800 pt-6">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span className="font-medium text-slate-200">Rp {formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Ongkos Kirim</span>
                <span className="font-bold text-emerald-400">Rp 0 (Gratis)</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800">
              <span className="text-lg font-bold text-white">Total Akhir</span>
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Rp {formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}