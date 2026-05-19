export default function AdminStock() {
  const stockItems = [
    {
      id: 1,
      name: 'Blue Tang (Small)',
      sku: 'TNG-442-MD',
      category: 'Saltwater',
      price: 'Rp 1.349.000',
      units: '4 units',
      statusText: 'Batch Q3-12',
      image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000cb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      name: 'Red Dragon Betta',
      sku: 'BET-099-RD',
      category: 'Freshwater',
      price: 'Rp 525.000',
      units: '0 units',
      statusText: 'Last sold yesterday',
      image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Ocellaris Clownfish',
      sku: 'CLN-221-PR',
      category: 'Saltwater',
      price: 'Rp 666.000',
      units: '45 units',
      statusText: 'Updated 10m ago',
      image: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=150&q=80'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#0369a1]">Stok Ikan</h1>
        
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
            Tambahkan Stok Ikan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8fafc] border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
          <div className="col-span-4 text-left pl-14">Jenis Ikan</div>
          <div className="col-span-2">Kategori</div>
          <div className="col-span-2">Harga</div>
          <div className="col-span-2">Ketersediaan</div>
          <div className="col-span-2">Aksi</div>
        </div>

        <div className="divide-y divide-gray-50">
          {stockItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center text-sm">
              
              <div className="col-span-4 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-[#0369a1] mb-0.5">{item.name}</h4>
                  <p className="text-[11px] text-gray-500 font-medium">SKU: {item.sku}</p>
                </div>
              </div>

              <div className="col-span-2 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#e0f2fe] text-[#0369a1]">
                  {item.category}
                </span>
              </div>

              <div className="col-span-2 text-center font-bold text-[#0369a1]">
                {item.price}
              </div>

              <div className="col-span-2 text-center">
                <p className="font-bold text-[#1e293b]">{item.units}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.statusText}</p>
              </div>

              <div className="col-span-2 flex items-center justify-center gap-3">
                <button className="text-[#0369a1] hover:text-[#0369a1]/70 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="text-[#0369a1] hover:text-[#0369a1]/70 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="text-red-500 hover:text-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Showing 1 to 4 of 24 specimens</p>
          <div className="flex items-center gap-2">
            <button className="text-xs font-medium text-gray-400 hover:text-gray-600 px-2 py-1">Sebelumnya</button>
            <button className="w-7 h-7 rounded bg-[#0369a1] text-white text-xs font-bold flex items-center justify-center">1</button>
            <button className="w-7 h-7 rounded text-gray-500 hover:bg-gray-50 text-xs font-bold flex items-center justify-center">2</button>
            <button className="text-xs font-medium text-[#1e293b] hover:text-gray-600 px-2 py-1">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  )
}
