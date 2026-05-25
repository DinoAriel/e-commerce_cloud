import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuctions } from '../lib/api';

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`;

export default function AuctionSection() {
  const navigate = useNavigate();
  const [featuredAuction, setFeaturedAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    getAuctions('active')
      .then(data => {
        if (data && data.length > 0) {
          // Gunakan lelang aktif pertama sebagai lelang unggulan di homepage
          setFeaturedAuction(data[0]);
        }
      })
      .catch(err => console.error("Gagal memuat lelang utama:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!featuredAuction) return;
    const endTime = new Date(featuredAuction.end_time).getTime();
    
    const updateTimer = () => {
      const diff = Math.max(0, endTime - Date.now());
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        total: diff
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [featuredAuction]);

  if (loading) {
    return (
      <section className="px-8 md:px-20 py-16 bg-[#0a2744] flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  // Jika tidak ada lelang aktif
  if (!featuredAuction) {
    return (
      <section className="px-8 md:px-20 py-16 bg-[#0a2744] text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Lelang Langsung</h2>
        <p className="text-white/60 mb-6 max-w-md mx-auto">Saat ini belum ada lelang yang aktif. Klik tombol di bawah untuk melihat halaman lelang dan pantau jadwal lelang berikutnya!</p>
        <button 
          onClick={() => navigate('/auctions')}
          className="bg-teal-500 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-teal-400 active:scale-95 transition-all duration-300"
        >
          Lihat Halaman Lelang
        </button>
      </section>
    );
  }

  const product = featuredAuction.products || featuredAuction.product || {};
  const currentBid = featuredAuction.current_bid || featuredAuction.start_price || 0;
  const breeder = product.badge || 'AquaMarket Elite';

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
            {product.name}
          </h2>
          <p className="text-white/60 mb-8 max-w-md leading-relaxed">
            {product.description || 'Ekosistem akuatik premium terpilih dengan kualitas terbaik dan siap menghiasi akuarium Anda.'}
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div>
              <p className="text-gray-400 text-[10px] mb-1 uppercase tracking-wider">Current Bid</p>
              <p className="text-3xl font-bold text-white">{formatPrice(currentBid)}</p>
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
            
            <div className="rounded-3xl overflow-hidden relative z-10 filter drop-shadow-2xl border border-white/10 w-full max-w-lg aspect-square bg-gray-900">
              <img 
                src={product.image_url || '/images/placeholder.avif'} 
                alt={product.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Tag Spesial */}
            <div className="absolute top-4 right-4 bg-[#051c2c]/90 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg border border-white/10 z-20 backdrop-blur-sm tracking-wide">
              Species: {product.species || 'Premium Fish'}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}