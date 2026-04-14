export default function ConsultSection() {
  return (
    <section className="px-8 md:px-20 py-10 md:py-16">
      <div className="bg-primary rounded-[3rem] p-10 md:p-16 text-center shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Dekorasi Air / Gelombang */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-current text-white" strokeWidth="0.5" fill="none">
             <path d="M0,50 Q25,30 50,50 T100,50" />
             <path d="M0,60 Q25,40 50,60 T100,60" />
             <path d="M0,70 Q25,50 50,70 T100,70" />
          </svg>
        </div>

        {/* Lingkaran blur */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-left md:w-2/3">
          <span className="inline-block bg-white/20 text-white border border-white/30 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            Layanan Eksklusif
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 text-shadow-sm">
            Butuh Bantuan Mendesain <br className="hidden md:block" /> Ekosistem Ideal?
          </h2>
          <p className="text-primary-lighter text-base md:text-lg max-w-xl opacity-90 leading-relaxed">
            Tenaga ahli Aquarist kami siap membantu Anda menyusun parameter air, memilih substrat, hingga merancang aquascape yang sempurna agar ikan Anda hidup puluhan tahun.
          </p>
        </div>

        <div className="relative z-10 md:w-1/3 flex justify-end">
          <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
            <button className="bg-white text-primary font-bold px-8 py-5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center gap-3 group whitespace-nowrap">
              Jadwalkan Konsultasi
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}