const breeders = [
  {
    id: 1,
    name: "Oceanic Imports",
    location: "Indonesia 🇮🇩",
    specialty: "Rare Marine Fish",
    description: "Spesialis karantina dan aklimatisasi ikan laut langka dari perairan tropis Nusantara.",
  },
  {
    id: 2,
    name: "AquaGenetics Lab",
    location: "Japan 🇯🇵",
    specialty: "Premium Discus",
    description: "Laboratorium genetika terkemuka yang menghasilkan strain discus eksklusif dengan pola sempurna.",
  },
  {
    id: 3,
    name: "Amazonia Exotics",
    location: "Brazil 🇧🇷",
    specialty: "Wild Caught Tetras",
    description: "Pemasok ikan liar bersertifikat ramah lingkungan dari lembah sungai Amazon.",
  }
];

export default function TopBreederSection() {
  return (
    <section className="px-8 md:px-20 py-16 bg-slate-950">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Mitra Peternak Terbaik</h2>
        <p className="text-slate-400 leading-relaxed text-sm">
          Kami bekerja sama langsung dengan peternak dan importir terkemuka di dunia untuk memastikan kualitas genetik dan kesehatan ikan sebelum sampai ke akuarium Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {breeders.map((breeder) => (
          <div key={breeder.id} className="group relative bg-slate-900/40 hover:bg-slate-900/60 rounded-3xl p-8 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 shadow-lg hover:shadow-cyan-950/10">
            {/* Dekorasi Latar */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full rounded-tr-3xl -z-0 group-hover:bg-teal-500/10 transition-colors"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-950 border border-slate-800 shadow-sm rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                🐟
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{breeder.name}</h3>
              <p className="text-xs font-bold text-teal-400 mb-4 bg-teal-500/10 border border-teal-500/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
                {breeder.specialty}
              </p>
              
              <div className="text-sm text-slate-300 mb-6 flex-1 italic leading-relaxed">
                "{breeder.description}"
              </div>
              
              <div className="mt-auto flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="text-lg">📍</span> {breeder.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}