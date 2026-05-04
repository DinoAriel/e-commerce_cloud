import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { useAuth } from '../lib/auth'
import { getAuctions, placeBid } from '../lib/api'

// ── Helpers ───────────────────────────────────────────
const fmtPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

const badgeStyle = {
    Rare: 'bg-purple-600 text-white',
    Premium: 'bg-teal-600 text-white',
    'Ends Today': 'bg-orange-500 text-white',
    'Ending Soon': 'bg-red-500 text-white',
}

function useCountdown(endTime) {
    const [t, setT] = useState(() => {
        const d = Math.max(0, endTime - Date.now())
        return {
            d: Math.floor(d / 86400000),
            h: Math.floor((d % 86400000) / 3600000),
            m: Math.floor((d % 3600000) / 60000),
            s: Math.floor((d % 60000) / 1000),
            total: d,
        }
    })
    useEffect(() => {
        const calc = () => {
            const d = Math.max(0, endTime - Date.now())
            return {
                d: Math.floor(d / 86400000),
                h: Math.floor((d % 86400000) / 3600000),
                m: Math.floor((d % 3600000) / 60000),
                s: Math.floor((d % 60000) / 1000),
                total: d,
            }
        }
        const id = setInterval(() => setT(calc()), 1000)
        return () => clearInterval(id)
    }, [endTime])
    return t
}

const pad = (n) => String(n).padStart(2, '0')

function CountdownBadge({ endTime, short = false }) {
    const t = useCountdown(endTime)
    const ended = t.total <= 0
    const urgent = !ended && t.total < 3600000

    if (ended) {
        return short
            ? <span className="text-xs font-bold text-gray-400">Berakhir</span>
            : <span className="text-sm font-bold text-gray-400">BERAKHIR</span>
    }

    if (short) {
        const label = t.d > 0
            ? `${t.d}d ${pad(t.h)}h`
            : `${pad(t.h)}h ${pad(t.m)}m`
        return (
            <span className={`text-xs font-bold tabular-nums ${urgent ? 'text-red-500' : 'text-gray-400'}`}>
                {label}
            </span>
        )
    }
    return (
        <span className={`text-sm font-bold tabular-nums ${urgent ? 'text-red-400' : 'text-white/80'}`}>
            {pad(t.h)}:{pad(t.m)}:{pad(t.s)} REMAINING
        </span>
    )
}

function EndsIn({ endTime }) {
    const t = useCountdown(endTime)
    const ended = t.total <= 0
    const urgent = !ended && t.h === 0 && t.d === 0
    const label = t.d > 0
        ? `${t.d}d ${pad(t.h)}h`
        : `${pad(t.h)}h ${pad(t.m)}m`

    if (ended) {
        return <span className="text-sm font-bold text-gray-400">Berakhir</span>
    }
    return (
        <span className={`text-sm font-bold tabular-nums ${urgent ? 'text-red-500' : 'text-gray-700'}`}>
            {label}
        </span>
    )
}

function isEnded(endTime) {
    return endTime - Date.now() <= 0
}

// ── Loading Spinner ───────────────────────────────────
function Spinner() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
    )
}

// ── Page ──────────────────────────────────────────────
export default function AuctionsPage() {
    const dispatch = useDispatch()
    const { user } = useAuth()
    const [auctions, setAuctions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [viewGrid, setViewGrid] = useState(true)
    const [biddingId, setBiddingId] = useState(null)
    const [bidError, setBidError] = useState(null)
    const [showAll, setShowAll] = useState(false)

    useEffect(() => {
        async function fetchAuctions() {
            try {
                setLoading(true)
                const data = await getAuctions('active')
                setAuctions(data || [])
            } catch (err) {
                setError(err.message || 'Gagal memuat data lelang')
            } finally {
                setLoading(false)
            }
        }
        fetchAuctions()
    }, [])

    // Derive end times from auction data
    const auctionsToEnd = auctions.map((a) => ({
        ...a,
        endTime: new Date(a.end_time).getTime(),
        product: a.products || {},
    }))

    // Separate into "hot" (first 3) and the rest for the active section
    const hotAuctions = auctionsToEnd.slice(0, 3)
    const activeAuctions = auctionsToEnd.slice(3)
    const displayedAuctions = showAll ? activeAuctions : activeAuctions.slice(0, 4)

    const handleBid = async (auction) => {
        if (!user) {
            setBidError('Silakan login terlebih dahulu untuk melakukan bid.')
            return
        }

        const currentAmount = auction.current_bid || auction.start_price
        const minBid = Math.ceil(currentAmount * 1.05)
        const amountStr = prompt(`Masukkan jumlah bid (minimum Rp ${minBid.toLocaleString('id-ID')}):`)
        if (!amountStr) return

        const amount = parseInt(amountStr.replace(/\D/g, ''), 10)
        if (isNaN(amount) || amount < minBid) {
            setBidError(`Bid harus minimal Rp ${minBid.toLocaleString('id-ID')}`)
            return
        }

        setBiddingId(auction.id)
        setBidError(null)
        try {
            await placeBid(auction.id, { user_id: user.id, amount })
            const data = await getAuctions('active')
            setAuctions(data || [])
        } catch (err) {
            setBidError(err.message || 'Gagal melakukan bid')
        } finally {
            setBiddingId(null)
        }
    }

    const handleAddToCart = (auction) => {
        const product = auction.product
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: auction.current_bid || auction.start_price,
            image: product.image_url,
            image_url: product.image_url,
        }))
    }

    return (
        <div className="min-h-screen bg-white">

            {/* ── Page Header ─────────────────────────────── */}
            <div className="px-6 md:px-16 pt-10 pb-6">
                <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-2">Live Ecosystem</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-4xl font-bold text-dark">Live Auctions</h1>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                            <span className="font-semibold">{auctionsToEnd.length} Active Auctions</span>
                        </span>
                        <div className="w-px h-5 bg-gray-200" />
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-dark transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zM6 12a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zM9 19a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
                            </svg>
                            Filter Species
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Loading / Error / Empty States ──────────── */}
            {loading && <Spinner />}

            {error && (
                <div className="px-6 md:px-16 pb-12">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <p className="text-red-600 font-semibold mb-2">Gagal Memuat Lelang</p>
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {bidError && (
                <div className="px-6 md:px-16 pb-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                        <p className="text-red-500 text-sm">{bidError}</p>
                        <button onClick={() => setBidError(null)} className="text-red-400 hover:text-red-600 text-lg leading-none">&times;</button>
                    </div>
                </div>
            )}

            {!loading && !error && auctionsToEnd.length === 0 && (
                <div className="px-6 md:px-16 pb-12">
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 font-semibold mb-1">Belum Ada Lelang Aktif</p>
                        <p className="text-gray-400 text-sm">Cek kembali nanti untuk lelang baru.</p>
                    </div>
                </div>
            )}

            {/* ── Hot Auctions ────────────────────────────── */}
            {!loading && !error && hotAuctions.length > 0 && (
                <section className="px-6 md:px-16 pb-12">
                    <div className="flex items-center gap-2 mb-5">
                        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-lg font-bold text-dark">Hot Auctions</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Featured big card */}
                        <div className="md:col-span-2 relative rounded-3xl overflow-hidden bg-gray-900 min-h-[320px] flex flex-col justify-end group cursor-pointer">
                            <img
                                src={hotAuctions[0].product.image_url || '/images/discus.png'}
                                alt={hotAuctions[0].product.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Top badges */}
                            <div className="absolute top-4 left-4 flex items-center gap-3">
                                {isEnded(hotAuctions[0].endTime) ? (
                                    <span className="bg-gray-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                                        Berakhir
                                    </span>
                                ) : (
                                    <>
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                                            Ending Soon
                                        </span>
                                        <CountdownBadge endTime={hotAuctions[0].endTime} />
                                    </>
                                )}
                            </div>

                            {/* Bottom info */}
                            <div className="relative z-10 p-6">
                                <div className="flex items-end justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white leading-tight">{hotAuctions[0].product.name}</h3>
                                        {hotAuctions[0].product.species && (
                                            <p className="text-white/60 text-sm mt-1">
                                                {hotAuctions[0].product.species}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/50 text-xs uppercase tracking-wide mb-1">
                                            {isEnded(hotAuctions[0].endTime) ? 'Final Bid' : 'Current Bid'}
                                        </p>
                                        <p className="text-3xl font-bold text-white">
                                            {fmtPrice(hotAuctions[0].current_bid || hotAuctions[0].start_price)}
                                        </p>
                                    </div>
                                </div>
                                {isEnded(hotAuctions[0].endTime) ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAddToCart(hotAuctions[0])}
                                            className="flex-1 py-3.5 rounded-2xl font-semibold text-sm bg-teal-600 text-white hover:bg-teal-700 transition-all duration-300 active:scale-95"
                                        >
                                            Add to Cart
                                        </button>
                                        <span className="px-4 py-3.5 rounded-2xl font-semibold text-sm bg-gray-600/50 text-gray-300">
                                            Berakhir
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleBid(hotAuctions[0])}
                                            className={`flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-95
                          ${biddingId === hotAuctions[0].id
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-[#0f2744]/80 backdrop-blur-sm text-white hover:bg-[#0f2744] border border-white/10'
                                                }`}
                                        >
                                            {biddingId === hotAuctions[0].id ? 'Bid Placed!' : 'Place Instant Bid'}
                                        </button>
                                        <button
                                            onClick={() => handleAddToCart(hotAuctions[0])}
                                            className="py-3.5 px-5 rounded-2xl font-semibold text-sm bg-teal-600/80 backdrop-blur-sm text-white hover:bg-teal-600 border border-white/10 transition-all duration-300 active:scale-95"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Side cards */}
                        <div className="flex flex-col gap-4">
                            {hotAuctions.slice(1).map((a) => {
                                const ended = isEnded(a.endTime)
                                return (
                                    <div key={a.id} className="border border-gray-100 rounded-2xl p-4 hover:border-primary-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                <img src={a.product.image_url || '/images/discus.png'} alt={a.product.name} onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className={`text-[10px] font-bold uppercase tracking-wide ${ended ? 'text-gray-400' : 'text-red-500'}`}>
                                                    {ended ? 'Berakhir' : 'Live'}
                                                </span>
                                                <p className="font-bold text-dark text-sm leading-tight truncate">{a.product.name}</p>
                                                {a.product.species && (
                                                    <p className="text-gray-400 text-xs truncate">{a.product.species}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                                                    {ended ? 'Final Bid' : 'High Bid'}
                                                </p>
                                                <p className="text-lg font-bold text-dark">{fmtPrice(a.current_bid || a.start_price)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Ends In</p>
                                                <EndsIn endTime={a.endTime} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Active Auctions ─────────────────────────── */}
            {!loading && !error && activeAuctions.length > 0 && (
                <section className="px-6 md:px-16 pb-14">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-dark">Active Auctions</h2>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setViewGrid(true)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${viewGrid ? 'bg-dark text-white' : 'text-gray-400 hover:text-dark'}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M1 2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1V2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V2zM1 7a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1V7zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V7zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V7zM1 12a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewGrid(false)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${!viewGrid ? 'bg-dark text-white' : 'text-gray-400 hover:text-dark'}`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M2 2.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5H2zM3 3H2v1h1V3zm-1 4.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5V8a.5.5 0 00-.5-.5H2zM3 8H2v1h1V8zm-1 4.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5H2zm1 .5H2v1h1v-1zm2-10a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm.5 3.5a.5.5 0 000 1h9a.5.5 0 000-1h-9zm0 4a.5.5 0 000 1h9a.5.5 0 000-1h-9zm0 4a.5.5 0 000 1h9a.5.5 0 000-1h-9z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className={viewGrid
                        ? 'grid grid-cols-2 md:grid-cols-4 gap-4'
                        : 'flex flex-col gap-3'
                    }>
                        {displayedAuctions.map((a) => {
                            const ended = isEnded(a.endTime)
                            return viewGrid ? (
                                /* Grid card */
                                <div key={a.id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-primary-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <img src={a.product.image_url || '/images/discus.png'} alt={a.product.name} onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        {a.product.badge && (
                                            <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyle[a.product.badge] || 'bg-gray-500 text-white'}`}>
                                                {a.product.badge}
                                            </span>
                                        )}
                                        <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white/80 text-[10px] px-2 py-0.5 rounded-full">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
                                            </svg>
                                            <CountdownBadge endTime={a.endTime} short />
                                        </span>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold text-dark text-sm leading-tight mb-0.5">{a.product.name}</h3>
                                        <p className="text-gray-400 text-xs flex items-center gap-1 mb-3">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {a.product.species || 'Unknown'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase">Current</p>
                                                <p className="font-bold text-dark text-sm">{fmtPrice(a.current_bid || a.start_price)}</p>
                                            </div>
                                            {ended ? (
                                                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-200 text-gray-500">
                                                    Berakhir
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleBid(a)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-90
                            ${biddingId === a.id ? 'bg-green-500 text-white' : 'bg-[#0f2744] text-white hover:bg-[#1a3a5c]'}`}
                                                >
                                                    {biddingId === a.id ? 'Bid Placed!' : 'Bid Now'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* List row */
                                <div key={a.id} className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4 hover:border-primary-border hover:shadow-md transition-all">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                        <img src={a.product.image_url || '/images/discus.png'} alt={a.product.name} onError={e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = '/images/discus.png' }}} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {a.product.badge && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyle[a.product.badge] || 'bg-gray-500 text-white'}`}>{a.product.badge}</span>
                                            )}
                                            <h3 className="font-bold text-dark text-sm truncate">{a.product.name}</h3>
                                        </div>
                                        <p className="text-gray-400 text-xs">{a.product.species || 'Unknown'}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] text-gray-400 uppercase">Current</p>
                                        <p className="font-bold text-dark">{fmtPrice(a.current_bid || a.start_price)}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] text-gray-400 uppercase">Ends In</p>
                                        <EndsIn endTime={a.endTime} />
                                    </div>
                                    {ended ? (
                                        <span className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-200 text-gray-500">
                                            Berakhir
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleBid(a)}
                                            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95
                      ${biddingId === a.id ? 'bg-green-500 text-white' : 'bg-[#0f2744] text-white hover:bg-[#1a3a5c]'}`}
                                        >
                                            {biddingId === a.id ? 'Bid Placed!' : 'Bid Now'}
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {activeAuctions.length > 4 && (
                        <div className="text-center mt-10">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="border-2 border-gray-200 text-dark font-semibold px-10 py-3.5 rounded-2xl hover:border-gray-400 active:scale-95 transition-all text-sm"
                            >
                                {showAll ? 'Show Less' : `View All ${activeAuctions.length} Auctions`}
                            </button>
                        </div>
                    )}
                </section>
            )}

        </div>
    )
}
