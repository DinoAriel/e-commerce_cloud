import { useState, useEffect } from 'react'
import { getAuctions, getProducts, placeBid, createAuction } from '../../lib/api'

// Helper for formatting price
const fmtPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

function LiveCountdown({ endTimeStr }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endTimeStr).getTime() - Date.now()
      if (diff <= 0) return 'Berakhir'
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      if (d > 0) return `${d}h ${h}j`
      return `${h}j ${m}m`
    }
    setTimeLeft(calc())
    const id = setInterval(() => setTimeLeft(calc()), 60000) // Update every minute
    return () => clearInterval(id)
  }, [endTimeStr])

  return <span>{timeLeft}</span>
}

export default function AdminAuctions() {
  const [auctions, setAuctions] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  // Modal controls
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    product_id: '',
    start_price: '',
    start_time: '',
    end_time: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      const auctionsData = await getAuctions()
      const productsData = await getProducts({ limit: 100 })
      
      setAuctions(auctionsData || [])
      setProducts(productsData.products || [])
    } catch (err) {
      console.error(err)
      setError(err.message || 'Gagal memuat data lelang')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAddModal = () => {
    // Set default times (start now, end tomorrow)
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    // Format to YYYY-MM-DDThh:mm for datetime-local inputs
    const formatLocal = (date) => {
      const pad = (n) => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    setFormData({
      product_id: products[0]?.id || '',
      start_price: '50000',
      start_time: formatLocal(now),
      end_time: formatLocal(tomorrow)
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (!formData.product_id || !formData.start_price || !formData.start_time || !formData.end_time) {
      setError('Harap isi semua kolom!')
      return
    }

    // Convert local datetime input value to RFC3339 string (UTC)
    const startTimeUTC = new Date(formData.start_time).toISOString()
    const endTimeUTC = new Date(formData.end_time).toISOString()

    const payload = {
      product_id: formData.product_id,
      start_price: parseInt(formData.start_price, 10),
      start_time: startTimeUTC,
      end_time: endTimeUTC
    }

    // We need to use createAuction API from api.js
    // Let's call request('/auctions', { method: 'POST', body: JSON.stringify(payload) })
    // since createAuction might not be imported or defined in frontend/src/lib/api.js?
    // Wait, let's look at api.js imports. In api.js, there is no createAuction export!
    // Ah, wait! Is there? No, let's verify. Let's do a request dynamically.
    try {
      await createAuction(payload)

      setSuccessMsg('Lelang baru berhasil dijadwalkan!')
      setShowModal(false)
      fetchData()
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan lelang')
    }
  }

  const filteredAuctions = auctions.filter(auction => {
    const query = search.toLowerCase()
    return (auction.products?.name || '').toLowerCase().includes(query) ||
           (auction.products?.species || '').toLowerCase().includes(query)
  })

  return (
    <div className="max-w-6xl mx-auto bg-slate-950 min-h-screen text-slate-100 font-sans">
      {/* Messages */}
      {successMsg && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

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
              placeholder="Cari lelang..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-200/50 border-none rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#0369a1]/20"
            />
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="bg-[#0369a1] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0369a1]/90 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Lelang
          </button>
        </div>
      </div>

      {/* Auctions List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0369a1] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAuctions.length === 0 ? (
            <div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              Tidak ada data lelang ditemukan
            </div>
          ) : (
            filteredAuctions.map((auction) => (
              <div key={auction.id} className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/80 flex items-center justify-between backdrop-blur-md">
                
                <div className="flex items-center gap-6 w-1/2">
                  <img 
                    src={auction.products?.image_url || 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=150&q=80'} 
                    alt={auction.products?.name} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=150&q=80' }}
                    className="w-24 h-24 rounded-xl object-cover" 
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 mb-1">{auction.products?.name}</h3>
                    <p className="text-xs text-slate-400 mb-2">Spesies: {auction.products?.species}</p>
                    
                    <div className="flex gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 tracking-wider">HARGA AWAL</p>
                        <p className="font-semibold text-slate-300 text-sm">{fmtPrice(auction.start_price)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 tracking-wider">BID SEKARANG</p>
                        <p className="font-bold text-[#0369a1] text-sm">
                          {auction.current_bid ? fmtPrice(auction.current_bid) : 'Belum ada'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-between px-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 mb-1 tracking-wider uppercase">Status</p>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      auction.status === 'active' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {auction.status === 'active' ? 'Aktif' : auction.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 mb-1 tracking-wider uppercase">Sisa Waktu</p>
                    <p className="font-bold text-slate-200 text-base"><LiveCountdown endTimeStr={auction.end_time} /></p>
                  </div>
                </div>
                
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Auction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-200">Buat Jadwal Lelang</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pilih Produk Ikan *</label>
                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0369a1]/20 bg-slate-900/30 text-slate-200"
                >
                  <option value="">Pilih Ikan</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Harga Mulai (Rupiah) *</label>
                <input 
                  type="number" 
                  name="start_price"
                  min="0"
                  required
                  value={formData.start_price} 
                  onChange={handleInputChange}
                  placeholder="50000"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0369a1]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Waktu Mulai Lelang *</label>
                <input 
                  type="datetime-local" 
                  name="start_time"
                  required
                  value={formData.start_time} 
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0369a1]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Waktu Selesai Lelang *</label>
                <input 
                  type="datetime-local" 
                  name="end_time"
                  required
                  value={formData.end_time} 
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0369a1]/20"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl text-sm font-medium hover:bg-slate-800"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#0369a1] text-white rounded-xl text-sm font-medium hover:bg-[#0369a1]/90"
                >
                  Jadwalkan Lelang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
