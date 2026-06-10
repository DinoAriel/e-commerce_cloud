import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyAuctions } from '../lib/api'

// Format price IDR
const fmtPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

// Helper component for countdown
function CountdownBadge({ endTimeStr }) {
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
        const id = setInterval(() => setTimeLeft(calc()), 60000)
        return () => clearInterval(id)
    }, [endTimeStr])

    return <span>{timeLeft}</span>
}

export default function MyAuctions() {
    const [auctions, setAuctions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMyAuctions()
    }, [])

    const fetchMyAuctions = async () => {
        try {
            setLoading(true)
            const res = await getMyAuctions()
            setAuctions(res.data || [])
        } catch (error) {
            console.error("Gagal memuat lelang saya:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="pt-24 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white min-h-screen">
                <p className="text-center mt-10">Memuat riwayat lelang Anda...</p>
            </div>
        )
    }

    return (
        <div className="pt-24 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen text-slate-200">
            <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Riwayat Lelang Saya</h1>

            {auctions.length === 0 ? (
                <div className="bg-slate-900/40 rounded-2xl p-10 text-center border border-slate-800/80 shadow-xl">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Belum Ada Aktivitas</h2>
                    <p className="text-slate-400 mb-6">Anda belum pernah mengikuti lelang apapun.</p>
                    <Link to="/auctions" className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/20 transition-all inline-block">
                        Lihat Lelang Aktif
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map(auction => {
                        const isEnded = auction.status === 'ended' || new Date(auction.end_time).getTime() <= Date.now()
                        return (
                            <div key={auction.id} className="bg-slate-900/40 rounded-xl overflow-hidden border border-slate-800/80 hover:border-teal-500/30 transition-all group shadow-xl shadow-black/20">
                                <div className="h-48 relative overflow-hidden bg-slate-950">
                                    <img 
                                        src={auction.product.image_url || 'https://via.placeholder.com/400x300'} 
                                        alt={auction.product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-md
                                            ${isEnded ? 'bg-slate-800 text-slate-400 border border-white/10' : 'bg-teal-500/20 text-teal-400 border border-teal-500/20'}
                                        `}>
                                            {isEnded ? 'Selesai' : 'Berlangsung'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-teal-400 transition-colors">{auction.product.name}</h3>
                                    <p className="text-xs text-slate-400 italic mb-4">{auction.product.species || 'Spesies tidak diketahui'}</p>
                                    
                                    <div className="bg-slate-950/50 rounded-lg p-3 grid grid-cols-2 gap-2 text-sm border border-slate-800/80">
                                        <div>
                                            <p className="text-slate-500 text-xs">Bid Terakhir</p>
                                            <p className="font-bold text-white">{fmtPrice(auction.current_bid)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-500 text-xs">Sisa Waktu</p>
                                            <p className={`font-bold ${isEnded ? 'text-slate-500' : 'text-orange-400'}`}>
                                                <CountdownBadge endTimeStr={auction.end_time} />
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Link to={`/auctions`} className="flex-1 text-center py-2 bg-slate-800/50 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors border border-slate-700/50">
                                            Lihat Lelang
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
