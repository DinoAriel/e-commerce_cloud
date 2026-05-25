import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { getUserOrders, rateOrder, updateOrderStatus } from '../lib/api'
import { supabase } from '../lib/supabase'

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

const statusLabel = (s) => ({
  paid: 'Sudah Dibayar',
  pending: 'Menunggu Pembayaran',
  shipped: 'Dikirim',
  done: 'Selesai',
  cancelled: 'Dibatalkan',
}[s] || s)

const statusStyle = (s) => ({
  paid:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  pending:   'bg-amber-500/10 text-amber-400 border-amber-500/30',
  shipped:   'bg-blue-500/10 text-blue-400 border-blue-500/30',
  done:      'bg-teal-500/10 text-teal-400 border-teal-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
}[s] || 'bg-slate-500/10 text-slate-400 border-slate-500/30')

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('orders')
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  // Pisahkan orders yang sudah dirating
  const ratedOrders = orders.filter(o => o.rating)
  const unratedDoneOrders = orders.filter(o => (o.status === 'done' || o.status === 'paid') && !o.rating)

  const tabs = [
    { id: 'orders', label: 'Riwayat Pesanan', icon: '📦', count: orders.length },
    { id: 'reviews', label: 'Ulasan Saya', icon: '⭐', count: ratedOrders.length },
    { id: 'pending_review', label: 'Perlu Diulas', icon: '✏️', count: unratedDoneOrders.length },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <div className="bg-slate-900/40 border-b border-slate-900 px-6 md:px-16 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Profil Saya</h1>
              <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="bg-slate-900 border border-slate-800 text-slate-300 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-sm cursor-pointer"
            >
              ← Beranda
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 border border-red-500/30 text-red-400 font-semibold px-5 py-2.5 rounded-xl hover:bg-red-500/20 transition-all text-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-16 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 text-center">
            <p className="text-2xl font-extrabold text-white">{orders.length}</p>
            <p className="text-xs text-slate-400 mt-1">Total Pesanan</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 text-center">
            <p className="text-2xl font-extrabold text-amber-400">{ratedOrders.length}</p>
            <p className="text-xs text-slate-400 mt-1">Sudah Diulas</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 text-center">
            <p className="text-2xl font-extrabold text-teal-400">{unratedDoneOrders.length}</p>
            <p className="text-xs text-slate-400 mt-1">Menunggu Ulasan</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800/80 pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer -mb-px ${
                activeTab === tab.id
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'bg-slate-800 text-slate-500'
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Tab: Riwayat Pesanan */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <p className="text-4xl mb-3">📦</p>
                    <p>Belum ada riwayat pesanan.</p>
                    <button onClick={() => navigate('/')} className="mt-4 bg-teal-500 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-400 transition-all cursor-pointer">
                      Mulai Belanja
                    </button>
                  </div>
                ) : orders.map(order => (
                  <div key={order.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-white">#{order.id.slice(0, 8)}...</span>
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${statusStyle(order.status)}`}>
                            {statusLabel(order.status)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                        {order.shipping_address && (
                          <p className="text-xs text-slate-400 mt-0.5"><span className="text-slate-500">Alamat:</span> {order.shipping_address}</p>
                        )}
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <p className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">{formatPrice(order.total_amount)}</p>
                        {order.status === 'shipped' && (
                          <button onClick={() => handleCompleteOrder(order.id)} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all cursor-pointer">
                            ✓ Tandai Diterima
                          </button>
                        )}
                        {(order.status === 'done' || order.status === 'paid') && !order.rating && ratingInput.orderId !== order.id && (
                          <button onClick={() => setRatingInput({ orderId: order.id, rating: 5, review: '' })} className="bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-teal-500 hover:text-slate-950 transition-all cursor-pointer">
                            ⭐ Beri Ulasan
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Existing rating display */}
                    {order.rating && <RatingDisplay order={order} />}
                    {/* Inline rating form */}
                    {ratingInput.orderId === order.id && (
                      <RatingForm
                        ratingInput={ratingInput}
                        setRatingInput={setRatingInput}
                        onSubmit={() => handleRateOrder(order.id)}
                        submitting={submitting}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Ulasan Saya */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {ratedOrders.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <p className="text-4xl mb-3">⭐</p>
                    <p>Anda belum memberikan ulasan apapun.</p>
                    <button onClick={() => setActiveTab('pending_review')} className="mt-4 text-teal-400 hover:underline text-sm cursor-pointer">
                      Lihat pesanan yang perlu diulas →
                    </button>
                  </div>
                ) : ratedOrders.map(order => (
                  <div key={order.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-mono text-sm font-bold text-white">#{order.id.slice(0, 8)}...</span>
                        <p className="text-xs text-slate-500 mt-0.5">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                      </div>
                      <p className="text-sm font-extrabold text-teal-400">{formatPrice(order.total_amount)}</p>
                    </div>
                    <RatingDisplay order={order} />
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Perlu Diulas */}
            {activeTab === 'pending_review' && (
              <div className="space-y-4">
                {unratedDoneOrders.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <p className="text-4xl mb-3">✅</p>
                    <p>Semua pesanan sudah diulas. Terima kasih!</p>
                  </div>
                ) : unratedDoneOrders.map(order => (
                  <div key={order.id} className="bg-slate-900/40 border border-teal-500/20 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white">#{order.id.slice(0, 8)}...</span>
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${statusStyle(order.status)}`}>
                            {statusLabel(order.status)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <p className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">{formatPrice(order.total_amount)}</p>
                        {ratingInput.orderId !== order.id && (
                          <button onClick={() => setRatingInput({ orderId: order.id, rating: 5, review: '' })} className="bg-teal-500 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-lg hover:bg-teal-400 transition-all cursor-pointer">
                            ⭐ Tulis Ulasan Sekarang
                          </button>
                        )}
                      </div>
                    </div>
                    {ratingInput.orderId === order.id && (
                      <RatingForm
                        ratingInput={ratingInput}
                        setRatingInput={setRatingInput}
                        onSubmit={() => handleRateOrder(order.id)}
                        submitting={submitting}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function RatingDisplay({ order }) {
  return (
    <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400">Ulasan Anda:</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < order.rating ? 'text-amber-400' : 'text-slate-700'}>★</span>
          ))}
        </div>
        <span className="text-xs text-slate-500">{order.rating}/5</span>
      </div>
      {order.review && (
        <p className="text-xs text-slate-300 italic">"{order.review}"</p>
      )}
    </div>
  )
}

function RatingForm({ ratingInput, setRatingInput, onSubmit, submitting }) {
  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3">
      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bagaimana pengalaman belanja Anda?</h4>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">Rating:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRatingInput(prev => ({ ...prev, rating: star }))}
              className="text-2xl focus:outline-none active:scale-90 cursor-pointer transition-transform"
            >
              <span className={star <= ratingInput.rating ? 'text-amber-400' : 'text-slate-700'}>★</span>
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={ratingInput.review}
        onChange={e => setRatingInput(prev => ({ ...prev, review: e.target.value }))}
        placeholder="Tulis pengalaman Anda di sini (opsional)..."
        rows={3}
        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-teal-500/50 transition-colors resize-none"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setRatingInput({ orderId: null, rating: 5, review: '' })}
          className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-900 text-xs font-medium transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="px-5 py-2 rounded-lg bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 text-xs transition-all cursor-pointer disabled:opacity-60"
        >
          {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
        </button>
      </div>
    </div>
  )
}
