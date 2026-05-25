import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-8">
      <div className="px-6 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="text-2xl font-bold tracking-tight mb-4 inline-block text-white">
            Aqua<span className="text-teal-400">Market</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            E-commerce ekosistem akuatik premium pertama di Indonesia. Membawa keindahan bawah laut dunia langsung ke ruang tamu Anda.
          </p>
          <div className="flex gap-4">
            {['Instagram', 'Facebook', 'Twitter'].map(social => (
              <a key={social} href="#" className="w-8 h-8 rounded-full bg-slate-900/60 border border-slate-800/40 flex items-center justify-center hover:bg-teal-500 hover:text-slate-950 text-slate-400 transition-all">
                <span className="text-xs font-semibold">{social[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Links: Collection */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Collection</h4>
          <ul className="space-y-3">
            <li><Link to="/freshwater" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Freshwater Exotics</Link></li>
            <li><Link to="/saltwater" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Saltwater Premium</Link></li>
            <li><Link to="/rarefish" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Rare Species</Link></li>
            <li><Link to="/auctions" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Live Auctions</Link></li>
          </ul>
        </div>

        {/* Links: Support */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Support</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">FAQ & Shipping</a></li>
            <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">DOA Guarantee Policy</a></li>
            <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Care Guide</a></li>
            <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Contact Us</a></li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-4">
            Berlangganan untuk mendapatkan info spesies langka dan jadwal lelang terbaru.
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email Anda" 
              className="bg-slate-900/60 border border-slate-800/80 text-sm rounded-l-xl px-4 py-2.5 w-full focus:outline-none focus:border-teal-500 text-white placeholder-slate-500"
            />
            <button className="bg-teal-500 text-slate-950 px-5 py-2.5 rounded-r-xl hover:bg-teal-400 transition-colors font-bold text-sm">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="px-6 md:px-20 border-t border-slate-900/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} AquaMarket Indonesia. All rights reserved.
        </p>
        <div className="flex gap-4">
          <span className="text-slate-500 text-xs hover:text-slate-400 cursor-pointer">Terms of Service</span>
          <span className="text-slate-500 text-xs hover:text-slate-400 cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    </footer>
  )
}