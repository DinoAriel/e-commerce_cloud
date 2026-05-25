import { useState, useEffect } from 'react'
import { getOrders, getAuctions, getProducts } from '../../lib/api'

const fmtPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

const starRow = (rating, max = 5) =>
  Array.from({ length: max }).map((_, i) => (
    <span key={i} className={i < rating ? 'text-amber-400' : 'text-slate-700'}>★</span>
  ))

const STATUS_COLOR = {
  pending:   'text-amber-500',
  paid:      'text-blue-500',
  shipped:   'text-indigo-500',
  done:      'text-emerald-500',
  cancelled: 'text-red-500',
}
const STATUS_LABEL = {
  pending: 'Menunggu',
  paid: 'Dibayar',
  shipped: 'Dikirim',
  done: 'Selesai',
  cancelled: 'Dibatalkan',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeAuctions: 0,
    totalStock: 0,
    avgRating: 0,
    totalReviews: 0,
    ratingBreakdown: [0, 0, 0, 0, 0], // index 0 = 1★ ... 4 = 5★
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviewPage, setReviewPage] = useState(0)
  const [activeTab, setActiveTab] = useState('pesanan')
  const [loading, setLoading] = useState(true)

  const REVIEWS_PER_PAGE = 4

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        const [ordersData, auctionsData, productsData] = await Promise.all([
          getOrders(),
          getAuctions('active'),
          getProducts({ limit: 100 }),
        ])

        const allOrders = ordersData || []

        const completedSales = allOrders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total_amount, 0)

        const stockSum = (productsData.products || [])
          .reduce((sum, p) => sum + (p.stock || 0), 0)

        // Rating stats from real order data
        const ratedOrders = allOrders.filter(o => o.rating && o.rating > 0)
        const totalReviews = ratedOrders.length
        const avgRating = totalReviews > 0
          ? (ratedOrders.reduce((sum, o) => sum + o.rating, 0) / totalReviews)
          : 0

        const ratingBreakdown = [0, 0, 0, 0, 0]
        ratedOrders.forEach(o => {
          if (o.rating >= 1 && o.rating <= 5) ratingBreakdown[o.rating - 1]++
        })

        setStats({
          totalSales: completedSales,
          activeAuctions: (auctionsData || []).length,
          totalStock: stockSum,
          avgRating: Math.round(avgRating * 10) / 10,
          totalReviews,
          ratingBreakdown,
        })

        setRecentOrders(allOrders.slice(0, 5))

        // Reviews sorted newest first, filter only rated
        setReviews(
          ratedOrders
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        )
      } catch (err) {
        console.error('Failed to load admin dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const pagedReviews = reviews.slice(
    reviewPage * REVIEWS_PER_PAGE,
    (reviewPage + 1) * REVIEWS_PER_PAGE
  )
  const totalReviewPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE)

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Selamat Datang!</h1>
        <p className="text-slate-400">Berikut adalah performa toko AquaMarket Anda saat ini.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-teal-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            {/* Total Penjualan */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Total Penjualan</p>
                <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">{fmtPrice(stats.totalSales)}</h3>
              </div>
            </div>

            {/* Lelang Aktif */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Lelang Aktif</p>
                <h3 className="text-2xl font-extrabold text-white">{stats.activeAuctions}</h3>
              </div>
            </div>

            {/* Total Stok */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Total Stok</p>
                <h3 className="text-2xl font-extrabold text-white">{stats.totalStock} Ekor</h3>
              </div>
            </div>

            {/* Rating Penjual */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500 font-medium">{stats.totalReviews} Ulasan</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Rating Penjual</p>
                <h3 className="text-2xl font-extrabold text-white">
                  {stats.totalReviews === 0 ? (
                    <span className="text-slate-500 text-base font-normal">Belum ada ulasan</span>
                  ) : (
                    <>{stats.avgRating} <span className="text-sm text-slate-400 font-normal">/5</span></>
                  )}
                </h3>
                {stats.totalReviews > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {starRow(Math.round(stats.avgRating))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Grid: Tabs (Orders + Reviews) + Rating Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Tabs Panel */}
            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col">
              {/* Tab Headers */}
              <div className="flex border-b border-slate-800/60">
                {[
                  { id: 'pesanan', label: '📦 Pesanan Terbaru' },
                  { id: 'ulasan', label: `⭐ Ulasan (${stats.totalReviews})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3.5 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
                      activeTab === tab.id
                        ? 'border-teal-500 text-teal-400'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5 flex-1">
                {/* Tab: Pesanan Terbaru */}
                {activeTab === 'pesanan' && (
                  <div className="space-y-4">
                    {recentOrders.length === 0 ? (
                      <p className="text-sm text-slate-500">Belum ada pesanan.</p>
                    ) : recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between border-b border-slate-800/60 pb-4 last:border-0 last:pb-0">
                        <div>
                          <h4 className="font-bold text-white text-sm mb-0.5">#{order.id.slice(0, 8)}...</h4>
                          <p className="text-xs text-slate-500 mb-1">Pembeli: {order.buyer_name || 'AquaMarket User'}</p>
                          <span className={`text-[10px] font-bold uppercase ${STATUS_COLOR[order.status] || 'text-slate-500'}`}>
                            {STATUS_LABEL[order.status] || order.status}
                          </span>
                          {order.rating > 0 && (
                            <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] text-amber-400 font-bold">
                              {starRow(order.rating, 5).map((s, i) => <span key={i}>{s}</span>)}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-teal-400">{fmtPrice(order.total_amount)}</p>
                          <p className="text-[10px] text-slate-500">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: Ulasan Pembeli */}
                {activeTab === 'ulasan' && (
                  <div className="flex flex-col h-full">
                    {reviews.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                        <span className="text-4xl">📭</span>
                        <p className="text-sm">Belum ada ulasan dari pembeli.</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 flex-1">
                          {pagedReviews.map(order => (
                            <div key={order.id} className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-white text-sm">
                                    {order.buyer_name || 'Pembeli AquaMarket'}
                                  </p>
                                  <p className="text-[10px] text-slate-500">
                                    Order #{order.id.slice(0, 8)}... · {new Date(order.created_at).toLocaleDateString('id-ID')}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="flex gap-0.5 text-sm">
                                    {starRow(order.rating)}
                                  </div>
                                  <span className="text-xs font-bold text-amber-400">{order.rating}/5</span>
                                </div>
                              </div>
                              {order.review ? (
                                <p className="text-sm text-slate-300 italic bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/60">
                                  "{order.review}"
                                </p>
                              ) : (
                                <p className="text-xs text-slate-500 italic">Tidak ada komentar tertulis.</p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalReviewPages > 1 && (
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60">
                            <span className="text-xs text-slate-500">
                              Halaman {reviewPage + 1} dari {totalReviewPages}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setReviewPage(p => Math.max(0, p - 1))}
                                disabled={reviewPage === 0}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 text-slate-400 disabled:opacity-40 hover:bg-slate-800 cursor-pointer transition-colors"
                              >
                                ← Prev
                              </button>
                              <button
                                onClick={() => setReviewPage(p => Math.min(totalReviewPages - 1, p + 1))}
                                disabled={reviewPage >= totalReviewPages - 1}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 text-slate-400 disabled:opacity-40 hover:bg-slate-800 cursor-pointer transition-colors"
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Rating Distribution Card */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-1">Distribusi Rating</h3>
              <p className="text-xs text-slate-500 mb-4">Berdasarkan {stats.totalReviews} ulasan pembeli</p>

              {stats.totalReviews === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-slate-500 gap-2">
                  <span className="text-4xl">⭐</span>
                  <p className="text-sm text-center">Belum ada ulasan<br/>dari pembeli</p>
                </div>
              ) : (
                <>
                  {/* Big avg */}
                  <div className="flex items-end gap-2 mb-5">
                    <span className="text-5xl font-extrabold text-white">{stats.avgRating}</span>
                    <div className="mb-1">
                      <div className="flex gap-0.5 text-lg">{starRow(Math.round(stats.avgRating))}</div>
                      <p className="text-xs text-slate-500 mt-0.5">dari {stats.totalReviews} ulasan</p>
                    </div>
                  </div>

                  {/* Breakdown bars */}
                  <div className="flex flex-col gap-2">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = stats.ratingBreakdown[star - 1]
                      const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 w-3 text-right shrink-0">{star}</span>
                          <span className="text-amber-400 text-xs shrink-0">★</span>
                          <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-6 text-right shrink-0">{count}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Sentiment pill */}
                  <div className={`mt-5 rounded-xl px-4 py-3 text-center text-sm font-semibold border ${
                    stats.avgRating >= 4.5 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    stats.avgRating >= 3.5 ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' :
                    stats.avgRating >= 2.5 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {stats.avgRating >= 4.5 ? '🌟 Toko Sangat Dipercaya!' :
                     stats.avgRating >= 3.5 ? '👍 Rating Baik' :
                     stats.avgRating >= 2.5 ? '⚠️ Perlu Peningkatan' :
                     '🚨 Perlu Perhatian Serius'}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
