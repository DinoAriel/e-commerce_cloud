import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { getProducts, getCategories, getUserOrders } from '../lib/api'

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState([
    { label: 'Total Produk', value: '...', icon: '🐠', change: 'Memuat...', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Kategori', value: '...', icon: '📂', change: 'Memuat...', color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Pesanan', value: '...', icon: '📦', change: 'Memuat...', color: 'bg-amber-50 text-amber-600' },
    { label: 'Pendapatan', value: '...', icon: '💰', change: 'Memuat...', color: 'bg-emerald-50 text-emerald-600' },
  ])
  const [recentProducts, setRecentProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getProducts({ limit: 10 }).catch(() => ({ products: [], total: 0 })),
      getCategories().catch(() => []),
      user ? getUserOrders(user.id).catch(() => []) : Promise.resolve([]),
    ]).then(([productData, categories, orderData]) => {
      const products = productData.products || []
      const catCount = Array.isArray(categories) ? categories.length : 0
      const orderList = Array.isArray(orderData) ? orderData : []
      const totalRevenue = orderList
        .filter(o => o.status === 'paid' || o.status === 'done')
        .reduce((sum, o) => sum + o.total_amount, 0)

      setStats([
        { label: 'Total Produk', value: String(productData.total || products.length), icon: '🐠', change: `${catCount} kategori tersedia`, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Kategori', value: String(catCount), icon: '📂', change: catCount > 0 ? 'Aktif' : 'Belum ada kategori', color: 'bg-purple-50 text-purple-600' },
        { label: 'Total Pesanan', value: String(orderList.length), icon: '📦', change: orderList.length === 0 ? 'Belum ada pesanan' : `${orderList.filter(o => o.status === 'pending').length} menunggu`, color: 'bg-amber-50 text-amber-600' },
        { label: 'Pendapatan', value: formatPrice(totalRevenue), icon: '💰', change: totalRevenue > 0 ? 'Dari pesanan selesai' : 'Mulai jual sekarang', color: 'bg-emerald-50 text-emerald-600' },
      ])

      setRecentProducts(products.slice(0, 5))
      setOrders(orderList.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [user])

  const quickActions = [
    { label: 'Tambah Produk', path: '/', icon: '➕', desc: 'Buat listing produk baru' },
    { label: 'Kelola Kategori', path: '/', icon: '🏷️', desc: 'Atur kategori ikan' },
    { label: 'Lihat Pesanan', path: '/', icon: '📋', desc: 'Monitor pesanan masuk' },
    { label: 'Kembali ke Toko', path: '/', icon: '🏪', desc: 'Lihat storefront' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Selamat datang kembali{user ? `, ${user.email}` : ''}! Kelola toko AquaMarket Anda.</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all duration-200 self-start"
            >
              ← Kembali ke Toko
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-primary-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-left group hover:-translate-y-0.5"
              >
                <span className="text-2xl mb-3 block">{action.icon}</span>
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{action.label}</h3>
                <p className="text-xs text-gray-400 mt-1">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Products */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Produk Terbaru</h2>
              <button onClick={() => navigate('/freshwater')} className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors">
                Lihat Semua →
              </button>
            </div>
            {recentProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">Belum ada produk</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                        {product.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${product.badge === 'Hot' ? 'bg-orange-500' : 'bg-purple-600'}`}>
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{formatPrice(product.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${(product.stock || 0) <= 5 ? 'text-red-500' : 'text-emerald-600'}`}>
                        {product.stock || 0}
                      </p>
                      <p className="text-[10px] text-gray-400">stok</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Pesanan Terbaru</h2>
              </div>
              {orders.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">Belum ada pesanan</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 truncate">{order.id.slice(0, 8)}...</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'paid' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{formatPrice(order.total_amount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* API Endpoints */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-bold mb-4">API Endpoints</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">GET</span>
                  <span className="text-gray-300 font-mono text-xs">/api/products</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">POST</span>
                  <span className="text-gray-300 font-mono text-xs">/api/products</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">GET</span>
                  <span className="text-gray-300 font-mono text-xs">/api/categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">POST</span>
                  <span className="text-gray-300 font-mono text-xs">/api/cart</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">POST</span>
                  <span className="text-gray-300 font-mono text-xs">/api/orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">POST</span>
                  <span className="text-gray-300 font-mono text-xs">/api/auctions/:id/bids</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-4">Go + Fiber backend di port 8080</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
