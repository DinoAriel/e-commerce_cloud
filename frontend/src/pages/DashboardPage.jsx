import { useNavigate } from 'react-router-dom'

const stats = [
  { label: 'Total Produk', value: '10', icon: '🐠', change: '+2 minggu ini', color: 'bg-blue-50 text-blue-600' },
  { label: 'Total Kategori', value: '4', icon: '📂', change: 'Freshwater, Saltwater, Rare, Invertebrates', color: 'bg-purple-50 text-purple-600' },
  { label: 'Total Pesanan', value: '0', icon: '📦', change: 'Belum ada pesanan', color: 'bg-amber-50 text-amber-600' },
  { label: 'Pendapatan', value: 'Rp 0', icon: '💰', change: 'Mulai jual sekarang', color: 'bg-emerald-50 text-emerald-600' },
]

const recentProducts = [
  { name: 'Discus Red Dragon', price: 'Rp 1.200.000', stock: 8, badge: 'Hot', image: '/images/discus.png' },
  { name: 'Betta Halfmoon', price: 'Rp 150.000', stock: 30, badge: 'Hot', image: '/images/betta.png' },
  { name: 'Flowerhorn', price: 'Rp 3.500.000', stock: 5, badge: 'Rare', image: '/images/flowerhorn.png' },
  { name: 'Arowana Silver', price: 'Rp 5.000.000', stock: 2, badge: 'Rare', image: '/images/arowana.png' },
  { name: 'Blue Tang', price: 'Rp 450.000', stock: 15, badge: null, image: '/images/blue-tang.avif' },
]

const quickActions = [
  { label: 'Tambah Produk', path: '/', icon: '➕', desc: 'Buat listing produk baru' },
  { label: 'Kelola Kategori', path: '/', icon: '🏷️', desc: 'Atur kategori ikan' },
  { label: 'Lihat Pesanan', path: '/', icon: '📋', desc: 'Monitor pesanan masuk' },
  { label: 'Laporan', path: '/', icon: '📊', desc: 'Analisis penjualan' },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Selamat datang kembali! Kelola toko AquaMarket Anda.</p>
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
          {stats.map((stat) => (
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
              <button className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors">
                Lihat Semua →
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {recentProducts.map((product) => (
                <div key={product.name} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                      {product.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${product.badge === 'Hot' ? 'bg-orange-500' : 'bg-purple-600'}`}>
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-emerald-600'}`}>
                      {product.stock}
                    </p>
                    <p className="text-[10px] text-gray-400">stok</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity & Info */}
          <div className="space-y-6">

            {/* Store Status */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Status Toko</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Frontend</span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Backend API</span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Database</span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Connected
                  </span>
                </div>
              </div>
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
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">PUT</span>
                  <span className="text-gray-300 font-mono text-xs">/api/products/:id</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded">DEL</span>
                  <span className="text-gray-300 font-mono text-xs">/api/products/:id</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
