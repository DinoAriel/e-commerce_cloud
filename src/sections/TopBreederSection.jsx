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
    <section className="px-8 md:px-20 py-16 bg-white">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Mitra Peternak Terbaik</h2>
        <p className="text-gray-500 leading-relaxed">
          Kami bekerja sama langsung dengan peternak dan importir terkemuka di dunia untuk memastikan kualitas genetik dan kesehatan ikan sebelum sampai ke akuarium Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {breeders.map((breeder) => (
          <div key={breeder.id} className="group relative bg-gray-50 hover:bg-white rounded-3xl p-8 border border-gray-100 hover:border-primary-border hover:shadow-xl transition-all duration-300">
            {/* Dekorasi Latar */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full rounded-tr-3xl -z-0 group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white border border-primary-border shadow-sm rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                🐟
              </div>
              
              <h3 className="text-xl font-bold text-dark mb-1">{breeder.name}</h3>
              <p className="text-sm font-semibold text-primary mb-4 bg-primary-lighter px-3 py-1 rounded-full">
                {breeder.specialty}
              </p>
              
              <div className="text-sm text-gray-500 mb-6 flex-1">
                "{breeder.description}"
              </div>
              
              <div className="mt-auto flex items-center gap-2 text-sm text-gray-600 font-medium">
                <span className="text-lg text-gray-800">📍</span> {breeder.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}