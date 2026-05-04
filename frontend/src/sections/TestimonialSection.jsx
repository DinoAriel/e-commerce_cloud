const testimonials = [
  {
    id: 1,
    name: "Ahmad Rizki",
    role: "Aquascaper Pro",
    review: "Ikan yang dikirim sangat sehat dan pengemasannya luar biasa aman. Blue Tang yang saya beli langsung beradaptasi dengan baik di tank saya.",
    rating: 5
  },
  {
    id: 2,
    name: "Budi Santoso",
    role: "Kolektor Pemula",
    review: "Pelayanannya juara! Saya sempat ragu beli secara online, tapi berkat garansi DOA 100%, saya jadi tenang. Ikannya datang dengan selamat.",
    rating: 5
  },
  {
    id: 3,
    name: "Siti Rahmawati",
    role: "Pecinta Ikan Tawar",
    review: "Discus dari AquaMarket warnanya sangat tajam, sama persis seperti di foto. Harganya juga rasional untuk kualitas sebagus ini.",
    rating: 4
  }
];

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function TestimonialSection() {
  return (
    <section className="px-8 md:px-20 py-16 bg-gray-50 border-t border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Apa Kata Pelanggan?</h2>
          <p className="text-gray-500">
            Ribuan aquarist telah mempercayakan kebutuhan ekosistem mereka pada kami. Berikut adalah pengalaman tulus dari mereka.
          </p>
        </div>
        <div className="flex -space-x-3 mt-4 md:mt-0 opacity-80 cursor-default">
          <div className="w-12 h-12 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold z-30">AR</div>
          <div className="w-12 h-12 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold z-20">BS</div>
          <div className="w-12 h-12 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold z-10">SR</div>
          <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-gray-500 text-xs font-bold shadow-sm">99+</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testi) => (
          <div key={testi.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative group transition-transform hover:-translate-y-2 duration-300">
            {/* Tanda Kutip */}
            <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
              <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10.74 21.053c-1.378-0.919-2.297-2.45-2.297-4.288 0-2.833 2.297-5.13 5.13-5.13h0.766v-6.125c-5.819 0-10.536 4.717-10.536 10.536 0 2.297 0.766 4.441 2.144 6.279l4.793-1.272zM27.273 21.053c-1.378-0.919-2.297-2.45-2.297-4.288 0-2.833 2.297-5.13 5.13-5.13h0.766v-6.125c-5.819 0-10.536 4.717-10.536 10.536 0 2.297 0.766 4.441 2.144 6.279l4.793-1.272z" />
              </svg>
            </div>
            
            <div className="flex gap-1 mb-6 relative z-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={i < testi.rating ? "opacity-100" : "opacity-30 grayscale"}>
                  <StarIcon />
                </div>
              ))}
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed relative z-10 min-h-[80px]">
              "{testi.review}"
            </p>
            
            <div className="flex items-center gap-4 relative z-10 border-t border-gray-50 pt-6">
              <div className="w-10 h-10 bg-primary-lighter text-primary font-bold rounded-full flex items-center justify-center border border-primary-border">
                {testi.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-dark text-sm">{testi.name}</h4>
                <p className="text-xs text-primary font-medium">{testi.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}