import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus } from '../../lib/api'

const fmtPrice = (p) => `Rp ${Number(p).toLocaleString('id-ID')}`

const STATUS = {
  pending:   { label: 'Menunggu',  style: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  paid:      { label: 'Dibayar',   style: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  shipped:   { label: 'Dikirim',   style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  done:      { label: 'Selesai',   style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  cancelled: { label: 'Dibatalkan',style: 'bg-red-500/10 text-red-400 border-red-500/30' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrders()
      setOrders(data || [])
    } catch (err) {
      setError(err.message || 'Gagal memuat data pesanan')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError(null)
      setSuccessMsg(null)
      await updateOrderStatus(orderId, newStatus)
      setSuccessMsg(`Status berhasil diubah ke "${STATUS[newStatus]?.label || newStatus}"`)
      fetchOrders()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      setError(err.message || 'Gagal merubah status pesanan')
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Pesanan Masuk</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan perbarui status pesanan pembeli</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-sm font-semibold text-teal-400 hover:text-teal-300 bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span>✓</span> {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-teal-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <p className="text-4xl mb-3">📭</p>
              <p>Belum ada pesanan masuk</p>
            </div>
          ) : orders.map((order) => (
            <div key={order.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4 hover:border-slate-700/80 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Order ID */}
                <div className="w-32 shrink-0">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ID Pesanan</p>
                  <p className="text-sm font-bold text-white font-mono">#{order.id.slice(0, 8)}...</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                </div>

                {/* Buyer */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pembeli</p>
                  <p className="text-sm text-slate-200 font-semibold truncate">{order.buyer_name || 'AquaMarket User'}</p>
                </div>

                {/* Shipping Address */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Alamat Kirim</p>
                  <p className="text-sm text-slate-400 truncate max-w-[200px]" title={order.shipping_address}>
                    {order.shipping_address || 'Tidak ada alamat'}
                  </p>
                </div>

                {/* Total */}
                <div className="w-32 shrink-0">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                    {fmtPrice(order.total_amount)}
                  </p>
                </div>

                {/* Status Select */}
                <div className="w-40 shrink-0">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-xs font-bold rounded-full px-3 py-1.5 cursor-pointer outline-none border ${STATUS[order.status]?.style || 'bg-slate-800 text-slate-400 border-slate-700'} bg-transparent`}
                  >
                    <option value="pending" className="bg-slate-900 text-white">Menunggu</option>
                    <option value="paid" className="bg-slate-900 text-white">Dibayar</option>
                    <option value="shipped" className="bg-slate-900 text-white">Dikirim</option>
                    <option value="done" className="bg-slate-900 text-white">Selesai</option>
                    <option value="cancelled" className="bg-slate-900 text-white">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {/* Rating & Review */}
              {order.rating > 0 && (
                <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3.5 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ulasan Pembeli:</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < order.rating ? 'text-amber-400' : 'text-slate-700'}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-amber-400 font-bold">{order.rating}/5</span>
                  </div>
                  {order.review && (
                    <p className="text-xs text-slate-300 italic">"{order.review}"</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
