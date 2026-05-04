import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuctionSection() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="px-8 md:px-20 py-16 bg-[#0a2744] relative overflow-hidden">
      {/* Latar Belakang Desain */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1a6a8a]/20 to-transparent pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        
        {/* Konten Lelang */}
        <div className="md:w-1/2">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 animate-pulse border border-red-500/30">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Hot Auction Ending Soon
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            Majestic Blue Cobalt Discus
          </h2>
          <p className="text-white/60 mb-8 max-w-md leading-relaxed">
            The crown jewel of Amazonian discus bred by Amazonia Elite. Striking cobalt blue patterns and perfectly round body structure. An undisputed icon.
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div>
              <p className="text-gray-400 text-[10px] mb-1 uppercase tracking-wider">Current Bid</p>
              <p className="text-3xl font-bold text-white">$485.00</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block"></div>
            <div>
              <p className="text-gray-400 text-[10px] mb-1 uppercase tracking-wider">Time Left</p>
              <div className="flex items-center gap-2 text-2xl font-bold text-red-400 font-mono">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/auctions')}
            className="bg-teal-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-400 hover:shadow-2xl hover:shadow-teal-500/20 active:scale-95 hover:-translate-y-1 transition-all duration-300 w-full md:w-auto"
          >
            Masuk ke Live Auction
          </button>
        </div>

        {/* Gambar Lelang */}
        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
          <div className="relative group cursor-pointer" onClick={() => navigate('/auctions')}>
            {/* Efek Glow */}
            <div className="absolute inset-0 bg-teal-500 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
            
            <div className="rounded-3xl overflow-hidden relative z-10 filter drop-shadow-2xl border border-white/10">
              <img 
                src="/images/discus.avif" 
                alt="Majestic Blue Cobalt Discus" 
                className="w-full max-w-lg aspect-auto object-cover transform group-hover:scale-105 transition-transform duration-700 bg-gray-900"
              />
            </div>
            
            {/* Tag Spesial */}
            <div className="absolute top-4 right-4 bg-[#051c2c]/90 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg border border-white/10 z-20 backdrop-blur-sm tracking-wide">
              Breeder: Amazonia Elite
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}