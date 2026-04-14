import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

const elusives = [
    {
        id: 1,
        name: 'Platinum Arowana',
        species: 'Scleropages formosus',
        price: 12500,
        oldPrice: 15000,
        rarity: 9.8,
        tier: 'Masterpiece Tier',
        image: '/images/arowana.avif',
        description: 'A biological anomaly featuring complete absence of pigmentation, resulting in a shimmering metallic finish. An undisputed icon of aquatic prestige.',
        featured: true,
    },
    {
        id: 2,
        name: 'Peppermint Angelfish',
        species: 'Centropyge boylei',
        price: 4800,
        badge: 'Mythic Rare',
        image: '/images/angelfish.avif',
        description: "Sourced from the deep reefs of the Cook Islands. Iconic candy-cane stripes and incredible hardiness.",
        featured: false,
    },
]

const gallery = [
    { id: 3, name: 'Clarion Angelfish', sub: 'Captive Bred', price: 2100, image: '/images/angelfish.avif' },
    { id: 4, name: 'Neptune Grouper', sub: 'Juvenile', price: 1950, image: '/images/mandarin.avif' },
    { id: 5, name: 'Gem Tang', sub: 'Mauritius Origin', price: 3400, image: '/images/blue-tang.avif' },
    { id: 6, name: 'Bladefin Basslet', sub: 'Ultra Rare', price: 7200, image: '/images/discus.avif' },
]

const features = [
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'DNA Verified Pedigree',
        desc: 'Every rare specimen includes a blockchain-backed certificate of authenticity and origin.',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-4 4m4-4l4 4M5 19h14" />
            </svg>
        ),
        title: 'Private Jet Courier',
        desc: 'Temperature-monitored, white-glove transport to ensure zero stress for your acquisition.',
    },
]

const formatPrice = (p) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p)

export default function RareFishPage() {
    const dispatch = useDispatch()
    const [addedId, setAddedId] = useState(null)
    const [email, setEmail] = useState('')
    const [joined, setJoined] = useState(false)

    const handleAcquire = (fish) => {
        dispatch(addToCart({ ...fish, quantity: 1 }))
        setAddedId(fish.id)
        setTimeout(() => setAddedId(null), 1500)
    }

    return (
        <div className="min-h-screen bg-white">

            {/* ── Hero ── */}
            <section className="relative min-h-[420px] md:min-h-[500px] bg-[#051c2c] overflow-hidden flex items-center">
                {/* BG texture */}
                <div className="absolute inset-0 opacity-20"
                    style={{ background: 'radial-gradient(ellipse at 60% 40%, #1a6a8a 0%, transparent 55%)' }} />
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice">
                    {[0, 50, 100, 150, 200].map((o, i) => (
                        <path key={i} d={`M0 ${200 + o} Q450 ${150 + o} 900 ${200 + o}`} fill="none" stroke="#89d4ff" strokeWidth="1" />
                    ))}
                </svg>

                {/* Fish image — right side */}
                <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-end pr-8 opacity-90 pointer-events-none">
                    <img src="/images/rare-hero.avif" alt="" className="h-full max-h-[480px] object-contain object-right" />
                </div>

                {/* Text */}
                <div className="relative z-10 px-8 md:px-16 max-w-2xl py-16">
                    <span className="inline-block border border-teal-500/50 text-teal-400 text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
                        The Sovereign Collection
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                        Rare specimens for<br />
                        the <span className="text-teal-400">Discerning</span><br />
                        Collector.
                    </h1>
                    <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md mb-8">
                        Exclusive access to the ocean's most elusive treasures. Hand-curated, medically screened, and ethically sourced specimens of legend.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button className="bg-white text-dark font-semibold px-7 py-3 rounded-xl hover:bg-gray-100 active:scale-95 transition-all text-sm">
                            Explore Vault
                        </button>
                        <button className="border border-white/30 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-sm">
                            Request Acquisition
                        </button>
                    </div>
                </div>
            </section>

            {/* ── The Elusives ── */}
            <section className="px-6 md:px-16 py-14">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-dark">The Elusives</h2>
                        <p className="text-gray-400 text-sm mt-1">Ultra-rare specimens currently available in our climate-controlled gallery.</p>
                    </div>
                    <div className="flex gap-2">
                        {['‹', '›'].map((ch, i) => (
                            <button key={i} className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-dark transition-all text-base font-medium flex items-center justify-center">
                                {ch}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Featured card */}
                    <div className="border border-gray-100 rounded-3xl overflow-hidden hover:border-primary-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                        <div className="relative aspect-video bg-gray-900 overflow-hidden">
                            <img src={elusives[0].image} alt={elusives[0].name} className="w-full h-full object-cover opacity-90" />
                            <span className="absolute top-3 left-3 bg-black/50 text-white/80 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/20">
                                {elusives[0].tier}
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    Rarity Score: <span className="text-amber-500">{elusives[0].rarity}/10</span>
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-dark mb-2">{elusives[0].name}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-5">{elusives[0].description}</p>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="text-2xl font-bold text-dark">{formatPrice(elusives[0].price)}</span>
                                <span className="text-gray-400 line-through text-sm">{formatPrice(elusives[0].oldPrice)}</span>
                            </div>
                            <button
                                onClick={() => handleAcquire(elusives[0])}
                                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95
                  ${addedId === elusives[0].id ? 'bg-green-500 text-white' : 'bg-[#0f2744] text-white hover:bg-[#1a3a5c]'}`}
                            >
                                {addedId === elusives[0].id ? 'Added to Cart ✓' : 'Acquire Specimen'}
                            </button>
                        </div>
                    </div>

                    {/* Side card */}
                    <div className="border border-gray-100 rounded-3xl overflow-hidden hover:border-primary-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                        <div className="relative flex-1 min-h-[200px] bg-gray-900 overflow-hidden">
                            <img src={elusives[1].image} alt={elusives[1].name} className="w-full h-full object-cover opacity-90" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-xl font-bold text-dark">{elusives[1].name}</h3>
                                <div>
                                    <span className="bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                        {elusives[1].badge}
                                    </span>
                                    <p className="text-right text-lg font-bold text-dark mt-1">{formatPrice(elusives[1].price)}</p>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-5">{elusives[1].description}</p>
                            <button
                                onClick={() => handleAcquire(elusives[1])}
                                className="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                            >
                                View Details
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Science of Selection ── */}
            <section className="px-6 md:px-16 py-14 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="rounded-3xl overflow-hidden aspect-square bg-gray-900">
                        <img src="/images/rare-scale.avif" alt="Scale texture" className="w-full h-full object-cover opacity-80" />
                    </div>
                    {/* Text */}
                    <div>
                        <span className="text-teal-600 text-xs font-bold tracking-widest uppercase mb-4 block">
                            Exclusivity Guaranteed
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-dark leading-tight mb-5">
                            The Science of<br />Selection.
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            Every specimen in the Rare collection undergoes a 30-day medical quarantine and adaptation period. We don't just sell fish; we curate living legacies for your private aquatic environment.
                        </p>
                        <div className="space-y-5">
                            {features.map((f, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                        {f.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-dark text-sm mb-1">{f.title}</p>
                                        <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Gallery Grid ── */}
            <section className="px-6 md:px-16 py-14">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((fish) => (
                        <div key={fish.id} className="group cursor-pointer">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                                <img
                                    src={fish.image}
                                    alt={fish.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <h4 className="font-bold text-dark text-sm">{fish.name}</h4>
                            <p className="text-gray-400 text-xs mb-1">{fish.sub}</p>
                            <p className="font-bold text-dark text-sm">{formatPrice(fish.price)}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Join the Inner Circle ── */}
            <section className="px-6 md:px-16 py-6 pb-16">
                <div className="relative bg-[#0a2744] rounded-3xl overflow-hidden px-8 md:px-16 py-14 text-center">
                    <div className="absolute inset-0 opacity-20"
                        style={{ background: 'radial-gradient(ellipse at 50% 100%, #1a6a8a 0%, transparent 60%)' }} />
                    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 900 300" preserveAspectRatio="xMidYMid slice">
                        {[0, 40, 80].map((o, i) => (
                            <path key={i} d={`M0 ${150 + o} Q450 ${100 + o} 900 ${150 + o}`} fill="none" stroke="#89d4ff" strokeWidth="1.5" />
                        ))}
                    </svg>
                    <div className="relative z-10 max-w-lg mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join the Inner Circle.</h2>
                        <p className="text-white/60 text-sm leading-relaxed mb-8">
                            Sign up for private alerts on new rare arrivals before they hit the public gallery. Access to the most exclusive specimens begins here.
                        </p>
                        {joined ? (
                            <div className="bg-teal-500/20 border border-teal-500/30 text-teal-400 px-6 py-3 rounded-xl text-sm font-medium">
                                You're in! Welcome to the Inner Circle.
                            </div>
                        ) : (
                            <div className="flex gap-3 max-w-sm mx-auto">
                                <input
                                    type="email"
                                    placeholder="Your executive email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm px-4 py-3 rounded-xl outline-none focus:border-teal-400 transition-colors"
                                />
                                <button
                                    onClick={() => { if (email) setJoined(true) }}
                                    className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95 text-sm whitespace-nowrap"
                                >
                                    Request Membership
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Footer ──
      <footer className="border-t border-gray-100 px-6 md:px-16 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <p className="font-bold text-dark text-base mb-3">AquaMarket</p>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              The premier destination for elite aquatic life and curated aquarium experiences. Flowing since 2024.
            </p>
            <div className="flex gap-2">
              {['web', 'email'].map((t) => (
                <button key={t} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-dark hover:border-gray-400 transition-all">
                  {t === 'web'
                    ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
                    : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  }
                </button>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Collection',
              links: ['Freshwater Exotics', 'Rare Fish Vault', 'Saltwater Specimens', 'Coral Gallery'],
              highlight: 1,
            },
            {
              title: 'Resources',
              links: ['Shipping Policy', 'DOA Guarantee', 'Breeder Program', 'Sustainability'],
            },
            {
              title: 'Contact',
              links: ['Concierge: +1 (800) AQUA-RARE', 'Email: vault@aquamarket.com', 'Terms of Service'],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-semibold text-dark text-sm mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l, i) => (
                  <li key={l}>
                    <button className={`text-xs transition-colors
                      ${col.highlight === i ? 'text-teal-600 font-semibold hover:text-teal-500' : 'text-gray-400 hover:text-dark'}`}>
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© 2024 AquaMarket. The Fluid Gallery Experience.</p>
          <div className="flex gap-5">
            {['Privacy', 'Compliance', 'Cookie Prefs'].map(l => (
              <button key={l} className="hover:text-dark transition-colors uppercase tracking-wide text-[10px] font-medium">{l}</button>
            ))}
          </div>
        </div>
      </footer> */}
        </div>
    )
}