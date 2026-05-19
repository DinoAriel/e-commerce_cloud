export default function AdminAuctions() {
  const auctions = [
    {
      id: 1,
      name: 'Platinum Arowana',
      bid: 'Rp 8.500.000',
      bidders: '12',
      timeLeft: '2j 15m',
      image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      name: 'Blue Ring Angelfish',
      bid: 'Rp 4.200.000',
      bidders: '8',
      timeLeft: '5j 42m',
      image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000cb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Zebra Pleco L046',
      bid: 'Rp 3.100.000',
      bidders: '15',
      timeLeft: '0j 28m',
      image: 'https://images.unsplash.com/photo-1517451330947-7809dead78d5?auto=format&fit=crop&w=150&q=80'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#0369a1]">Lelang Aktif</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Cari" 
              className="pl-10 pr-4 py-2 bg-gray-200/50 border-none rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#0369a1]/20"
            />
          </div>
          <button className="bg-[#0369a1] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0369a1]/90 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Lelang
          </button>
        </div>
      </div>

      {/* Auctions List */}
      <div className="space-y-4">
        {auctions.map((auction) => (
          <div key={auction.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            
            <div className="flex items-center gap-6 w-1/2">
              <img src={auction.image} alt={auction.name} className="w-24 h-24 rounded-xl object-cover" />
              <div>
                <h3 className="text-lg font-bold text-[#1e293b] mb-1">{auction.name}</h3>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5 tracking-wider">BID</p>
                <p className="font-semibold text-gray-900">{auction.bid}</p>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-between px-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">Bidders</p>
                <p className="font-bold text-[#1e293b] text-lg">{auction.bidders}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">Sisa</p>
                <p className="font-bold text-[#1e293b] text-lg">{auction.timeLeft}</p>
              </div>
            </div>

            <div className="px-6 border-l border-gray-100">
              <button className="text-red-500 font-bold text-xs hover:text-red-600 transition-colors tracking-wider">
                HAPUS
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}
