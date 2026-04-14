import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="px-6 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="text-2xl font-bold tracking-tight mb-4 inline-block">
            Aqua<span className="text-primary">Market</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            E-commerce ekosistem akuatik premium pertama di Indonesia. Membawa keindahan bawah laut dunia langsung ke ruang tamu Anda.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            {['Instagram', 'Facebook', 'Twitter'].map(social => (
              <a key={social} href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-primary hover:text-white text-gray-400 transition-colors">
                <span className="text-xs">{social[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Links: Collection */}
        <div>
          <h4 className="font-bold text-dark mb-4 uppercase tracking-widest text-xs">Collection</h4>
          <ul className="space-y-3">
            <li><Link to="/freshwater" className="text-gray-500 hover:text-primary text-sm transition-colors">Freshwater Exotics</Link></li>
            <li><Link to="/saltwater" className="text-gray-500 hover:text-primary text-sm transition-colors">Saltwater Premium</Link></li>
            <li><Link to="/rare-fish" className="text-gray-500 hover:text-primary text-sm transition-colors">Rare Species</Link></li>
            <li><Link to="/auctions" className="text-gray-500 hover:text-primary text-sm transition-colors">Live Auctions</Link></li>
          </ul>
        </div>

        {/* Links: Support */}
        <div>
          <h4 className="font-bold text-dark mb-4 uppercase tracking-widest text-xs">Support</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">FAQ & Shipping</a></li>
            <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">DOA Guarantee Policy</a></li>
            <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Care Guide</a></li>
            <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Contact Us</a></li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h4 className="font-bold text-dark mb-4 uppercase tracking-widest text-xs">Newsletter</h4>
          <p className="text-gray-500 text-sm mb-4">
            Berlangganan untuk mendapatkan info spesies langka dan jadwal lelang terbaru.
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email Anda" 
              className="bg-gray-50 border border-gray-200 text-sm rounded-l-xl px-4 py-2 w-full focus:outline-none focus:border-primary"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-r-xl hover:bg-primary-dark transition-colors font-medium">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="px-6 md:px-20 border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} AquaMarket Indonesia. All rights reserved.
        </p>
        <div className="flex gap-4">
          <span className="text-gray-400 text-xs">Terms of Service</span>
          <span className="text-gray-400 text-xs">Privacy Policy</span>
        </div>
      </div>
    </footer>
  )
}