import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { getUserOrders, rateOrder, updateOrderStatus } from '../lib/api'

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingInput, setRatingInput] = useState({ orderId: null, rating: 5, review: '' })

  useEffect(() => {
    if (user) {
      getUserOrders(user.id)
        .then((orderData) => {
          setOrders(Array.isArray(orderData) ? orderData : [])
        })
        .catch((err) => console.error('Gagal memuat pesanan:', err))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  const handleCompleteOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'done')
      const orderData = await getUserOrders(user.id)
      setOrders(Array.isArray(orderData) ? orderData : [])
    } catch (err) {
      console.error('Gagal menyelesaikan pesanan:', err)
      alert('Gagal menyelesaikan pesanan: ' + err.message)
    }
  }

  const handleRateOrder = async (orderId) => {
    try {
      await rateOrder(orderId, ratingInput.rating, ratingInput.review)
      const orderData = await getUserOrders(user.id)
      setOrders(Array.isArray(orderData) ? orderData : [])
      setRatingInput({ orderId: null, rating: 5, review: '' })
    } catch (err) {
      console.error('Gagal mengirim rating:', err)
      alert('Gagal mengirim ulasan: ' + err.message)
    }
  }

  const totalSpent = orders
    .filter(o => o.status === 'paid' || o.status === 'done')
    .reduce((sum, o) => sum + o.total_amount, 0)

  const stats = [
    { label: 'Total Pesanan', value: String(orders.length), icon: '📦', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
    { label: 'Pesanan Menunggu', value: String(orders.filter(o => o.status === 'pending').length), icon: '⏳', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    { label: 'Total Pengeluaran', value: formatPrice(totalSpent), icon: '💰', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <div className="bg-slate-900/40 border-b border-slate-900 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Dashboard Saya</h1>
              <p className="text-slate-400 mt-1">Selamat datang kembali{user ? `, ${user.email}` : ''}! Pantau status pesanan belanja Anda.</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-teal-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 transition-all duration-200 self-start cursor-pointer shadow-md"
            >
              ← Kembali ke Toko
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : stats.map((stat) => (
            <div key={stat.label} className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700/80 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Orders List */}
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800/80">
            <h2 className="text-xl font-bold text-white">Riwayat Pesanan Belanja</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg">Belum ada riwayat pesanan.</p>
              <button onClick={() => navigate('/')} className="mt-4 bg-teal-500 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-extrabold hover:bg-teal-400 hover:shadow-lg transition-all cursor-pointer">
                Mulai Belanja Sekarang
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80 bg-slate-950/20">
              {orders.map((order) => (
                <div key={order.id} className="p-6 flex flex-col gap-4 hover:bg-slate-900/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm font-bold text-white">ID: #{order.id.slice(0, 8)}...</span>
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                          order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                          order.status === 'done' ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' :
                          'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          {order.status === 'paid' ? 'Sudah Dibayar' :
                           order.status === 'pending' ? 'Menunggu Pembayaran' :
                           order.status === 'shipped' ? 'Dikirim' :
                           order.status === 'done' ? 'Selesai' : 'Dibatalkan'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Dibuat pada: {new Date(order.created_at).toLocaleString('id-ID')}</p>
                      {order.shipping_address && (
                        <p className="text-xs text-slate-400 mt-1"><span className="font-semibold text-slate-500">Alamat:</span> {order.shipping_address}</p>
                      )}
                    </div>
                    <div className="text-left md:text-right flex flex-col md:items-end gap-2">
                      <p className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">{formatPrice(order.total_amount)}</p>
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all cursor-pointer self-start md:self-end"
                        >
                          ✓ Selesaikan Pesanan (Diterima)
                        </button>
                      )}
                      {(order.status === 'paid' || order.status === 'done') && !order.rating && ratingInput.orderId !== order.id && (
                        <button
                          onClick={() => setRatingInput({ orderId: order.id, rating: 5, review: '' })}
                          className="bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-teal-500 hover:text-slate-950 transition-all cursor-pointer self-start md:self-end"
                        >
                          ⭐ Beri Rating & Ulasan
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Display existing rating if submitted */}
                  {order.rating && (
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400">Rating Anda:</span>
                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < order.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      {order.review && (
                        <p className="text-xs text-slate-300 italic">"{order.review}"</p>
                      )}
                    </div>
                  )}

                  {/* Rating Input Form (Inline) */}
                  {ratingInput.orderId === order.id && (
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 mt-2 flex flex-col gap-3 animate-fadeIn">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bagaimana kualitas pesanan Anda?</h4>
                      
                      {/* Star selection */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Rating:</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingInput(prev => ({ ...prev, rating: star }))}
                              className="text-lg focus:outline-none transition-transform active:scale-90 cursor-pointer"
                            >
                              <span className={star <= ratingInput.rating ? "text-amber-400" : "text-slate-600"}>★</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text ulasan */}
                      <textarea
                        value={ratingInput.review}
                        onChange={(e) => setRatingInput(prev => ({ ...prev, review: e.target.value }))}
                        placeholder="Tulis ulasan pengalaman belanja Anda disini..."
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-teal-500/50"
                      />

                      {/* Action buttons */}
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setRatingInput({ orderId: null, rating: 5, review: '' })}
                          className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-900 text-xs transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRateOrder(order.id)}
                          className="px-4 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 text-xs transition-all cursor-pointer"
                        >
                          Kirim Ulasan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
