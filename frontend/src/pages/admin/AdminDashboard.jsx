export default function AdminDashboard() {
  const recentOrders = [
    {
      id: 1,
      name: 'Clownfish',
      price: 'Rp 1.500.000',
      status: 'Pending',
      statusColor: 'text-amber-500',
      image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000cb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      name: 'Neon Tetra',
      price: 'Rp 750.000',
      status: 'Dikirim',
      statusColor: 'text-emerald-500',
      image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Dragonet',
      price: 'Rp 1.750.000',
      status: 'Belum Bayar',
      statusColor: 'text-red-500',
      image: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=150&q=80'
    }
  ]

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e293b] mb-2">Selamat Datang!</h1>
        <p className="text-gray-500">Here's your fleet's performance for May.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Penjualan */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              +12.5%
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Total Penjualan</p>
            <h3 className="text-2xl font-bold text-[#1e293b]">Rp 372.750.000</h3>
          </div>
        </div>

        {/* Lelang Aktif */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#dcfce7] text-[#10b981] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Lelang Aktif</p>
            <h3 className="text-2xl font-bold text-[#1e293b]">3</h3>
          </div>
        </div>

        {/* Total Stok */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#e0e7ff] text-[#6366f1] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xs text-gray-500 font-medium">8 Rare species</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Total Stok</p>
            <h3 className="text-2xl font-bold text-[#1e293b]">10 Ekor</h3>
          </div>
        </div>

        {/* Buyer Rating */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#ffe4e6] text-[#f43f5e] flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-xs text-gray-500 font-medium">240 Reviews</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Buyer Rating</p>
            <h3 className="text-2xl font-bold text-[#1e293b]">4.92 <span className="text-sm text-gray-400 font-normal">/5</span></h3>
          </div>
        </div>
      </div>

      {/* Orders & Extra Info Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1e293b]">Pesanan Terbaru</h3>
            <button className="text-sm font-semibold text-[#0369a1] hover:underline">View All</button>
          </div>
          <div className="space-y-5">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-4">
                <img src={order.image} alt={order.name} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-[#1e293b] text-sm mb-0.5">{order.name}</h4>
                  <p className="text-xs text-gray-500 mb-1">{order.price}</p>
                  <p className={`text-[10px] font-bold ${order.statusColor}`}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  )
}
