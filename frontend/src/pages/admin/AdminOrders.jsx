export default function AdminOrders() {
  const orders = [
    {
      id: '#1001',
      buyer: 'Haechan',
      item: 'Clownfish',
      qty: 12,
      total: 'Rp 1.500.000',
      status: 'Pending',
      statusColor: 'text-orange-400'
    },
    {
      id: '#1001',
      buyer: 'Haechan',
      item: 'Clownfish',
      qty: 12,
      total: 'Rp 1.500.000',
      status: 'Dikirim',
      statusColor: 'text-emerald-500'
    }
  ]

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0369a1]">Pesanan Masuk</h1>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center justify-between">
            
            <div className="w-24">
              <p className="text-sm font-bold text-[#1e293b] mb-4">ID</p>
              <p className="text-sm text-gray-700">{order.id}</p>
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-[#1e293b] mb-4">Pembeli</p>
              <p className="text-sm text-gray-700">{order.buyer}</p>
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-[#1e293b] mb-4">Item</p>
              <p className="text-sm text-gray-700">{order.item}</p>
            </div>

            <div className="w-20">
              <p className="text-sm font-bold text-[#1e293b] mb-4">Qty</p>
              <p className="text-sm text-gray-700">{order.qty}</p>
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-[#1e293b] mb-4">Total</p>
              <p className="text-sm text-gray-700">{order.total}</p>
            </div>

            <div className="w-24 text-right">
              <p className="text-sm font-bold text-[#1e293b] mb-4 text-left">Status</p>
              <p className={`text-sm font-medium text-left ${order.statusColor}`}>{order.status}</p>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}
