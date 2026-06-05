import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { getUserOrders, rateOrder, updateOrderStatus } from '../lib/api'

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

const statusLabel = (s) => ({
  paid: 'Sudah Dibayar',
  pending: 'Menunggu Pembayaran',
  shipped: 'Dikirim',
  done: 'Selesai',
  cancelled: 'Dibatalkan',
}[s] || s)

export default function OrdersPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('semua')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingInput, setRatingInput] = useState({ orderId: null, rating: 5, review: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getUserOrders(user.id)
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [user])

  const reload = async () => {
    if (!user) return
    const data = await getUserOrders(user.id)
    setOrders(Array.isArray(data) ? data : [])
  }

  const handleCompleteOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'done')
      await reload()
    } catch (err) {
      alert('Gagal menyelesaikan pesanan: ' + err.message)
    }
  }

  const handleRateOrder = async (orderId) => {
    if (submitting) return
    setSubmitting(true)
    try {
      await rateOrder(orderId, ratingInput.rating, ratingInput.review)
      await reload()
      setRatingInput({ orderId: null, rating: 5, review: '' })
    } catch (err) {
      alert('Gagal mengirim ulasan: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'semua') return true
    if (activeTab === 'belum_bayar') return o.status === 'pending'
    if (activeTab === 'dikirim') return o.status === 'shipped'
    if (activeTab === 'selesai') return o.status === 'done' || o.status === 'paid'
    return true
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="flex items-center gap-3 mb-8 px-2 md:px-0">
            <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-white truncate">{user?.email?.split('@')[0]}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-teal-400 hover:bg-slate-900/50 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
            <div className="px-3 py-2 text-sm font-bold text-white bg-slate-900/50 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Pesanan Saya
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          
          {/* Tabs */}
          <div className="bg-slate-900/40 rounded-2xl shadow-xl mb-6 flex border-b border-slate-800/80 overflow-x-auto hide-scrollbar">
            {['semua', 'belum_bayar', 'dikirim', 'selesai'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-teal-400 text-teal-400'
                    : 'border-transparent text-slate-500 hover:text-teal-400'
                }`}
              >
                {tab === 'semua' ? 'Semua' : 
                 tab === 'belum_bayar' ? 'Belum Bayar' : 
                 tab === 'dikirim' ? 'Dikirim' : 'Selesai'}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-slate-900/40 rounded-2xl shadow-xl p-12 flex flex-col items-center text-center border border-slate-800/80">
              <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium text-lg mb-2">Belum ada pesanan</p>
              <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-teal-500/10 text-teal-400 font-semibold border border-teal-500/30 rounded-xl hover:bg-teal-500 hover:text-slate-950 transition-colors mt-2">Belanja Sekarang</button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-slate-900/40 rounded-2xl shadow-xl border border-slate-800/80 overflow-hidden">
                  
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                      #{order.id.slice(0,8)}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border tracking-wide uppercase ${
                      order.status === 'done' || order.status === 'paid' ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' :
                      order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}>
                      {statusLabel(order.status)}
                    </span>
                  </div>

                  {/* Order Body */}
                  <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tanggal Transaksi</p>
                      <p className="text-slate-200 font-medium mb-4">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                      
                      {order.shipping_address && (
                        <>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Alamat Pengiriman</p>
                          <p className="text-slate-300 text-sm max-w-md leading-relaxed">{order.shipping_address}</p>
                        </>
                      )}
                    </div>

                    <div className="md:text-right w-full md:w-auto">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Belanja</p>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 mb-5">{formatPrice(order.total_amount)}</p>
                      
                      <div className="flex md:justify-end gap-3">
                        {order.status === 'shipped' && (
                          <button onClick={() => handleCompleteOrder(order.id)} className="px-5 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl hover:bg-teal-400 transition-colors text-sm shadow-lg shadow-teal-500/20">
                            Pesanan Diterima
                          </button>
                        )}
                        {(order.status === 'done' || order.status === 'paid') && !order.rating && (
                          <button onClick={() => setRatingInput({ orderId: order.id, rating: 5, review: '' })} className="px-5 py-2 border border-teal-500/50 text-teal-400 bg-teal-500/10 font-bold rounded-xl hover:bg-teal-500 hover:text-slate-950 transition-colors text-sm">
                            Nilai Produk
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Section */}
                  {order.rating && (
                    <div className="px-6 py-5 bg-slate-950/50 border-t border-slate-800 flex items-start gap-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 shrink-0">Ulasan Anda:</span>
                      <div>
                        <div className="flex text-amber-400 text-lg mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < order.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                          ))}
                        </div>
                        {order.review && <p className="text-sm text-slate-300 italic">"{order.review}"</p>}
                      </div>
                    </div>
                  )}

                  {/* Rating Form */}
                  {ratingInput.orderId === order.id && (
                    <div className="px-6 py-5 bg-slate-950/80 border-t border-slate-800">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tulis Ulasan</h4>
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setRatingInput(prev => ({ ...prev, rating: star }))}
                            className={`text-3xl focus:outline-none transition-transform active:scale-90 ${star <= ratingInput.rating ? 'text-amber-400' : 'text-slate-700'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={ratingInput.review}
                        onChange={e => setRatingInput(prev => ({ ...prev, review: e.target.value }))}
                        placeholder="Bagaimana kualitas produk dan pelayanannya? (opsional)"
                        className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl mb-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none transition-colors"
                        rows="3"
                      />
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setRatingInput({ orderId: null, rating: 5, review: '' })} className="px-5 py-2.5 text-sm font-semibold text-slate-400 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">Batal</button>
                        <button onClick={() => handleRateOrder(order.id)} disabled={submitting} className="px-6 py-2.5 text-sm bg-teal-500 text-slate-950 font-bold rounded-xl hover:bg-teal-400 disabled:opacity-50 transition-colors shadow-lg shadow-teal-500/20">
                          {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
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
