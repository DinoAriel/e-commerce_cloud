export default function AdminMessages() {
  const contacts = [
    {
      id: 1,
      name: 'Julian Reed',
      subject: 'Royal Blue Tang Inquiry',
      preview: 'Is the salinity level currently at 1.025?',
      time: '2M AGO',
      isActive: true,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 2,
      name: 'Sarah Waters',
      subject: 'Breeder Program',
      preview: 'The shipping containers are ready for picku...',
      time: '1H AGO',
      isActive: false,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 3,
      name: 'Marine Kingdom',
      subject: 'Wholesale Order #882',
      preview: 'Payment verified. Preparing the tank set.',
      time: 'YESTERDAY',
      isActive: false,
      isInitials: true,
      initials: 'MK'
    }
  ]

  return (
    <div className="flex gap-5 max-w-7xl h-[calc(100vh-8rem)] bg-slate-950/30 backdrop-blur-lg rounded-3xl border border-slate-800/60">

      {/* Left Panel: Contacts */}
      <div className="w-72 flex flex-col shrink-0 bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white">Pesan</h1>
          <p className="text-slate-400 text-sm mt-1">Percakapan dengan pembeli</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari percakapan..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-teal-500/40 transition-colors"
          />
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                contact.isActive
                  ? 'bg-teal-500/10 border-teal-500/30'
                  : 'hover:bg-slate-900/60 border-transparent hover:border-slate-800'
              }`}
            >
              <div className="flex gap-3">
                <div className="relative shrink-0">
                  {contact.isInitials ? (
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-teal-400 font-bold flex items-center justify-center text-sm">
                      {contact.initials}
                    </div>
                  ) : (
                    <img src={contact.image} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                  )}
                  {contact.isActive && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-400 rounded-full border-2 border-slate-950"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className={`font-bold text-sm truncate ${contact.isActive ? 'text-teal-300' : 'text-slate-200'}`}>{contact.name}</h4>
                    <span className="text-[9px] font-bold text-slate-600 mt-0.5 shrink-0 ml-2">{contact.time}</span>
                  </div>
                  <p className={`text-xs font-semibold truncate mb-0.5 ${contact.isActive ? 'text-teal-400' : 'text-slate-500'}`}>{contact.subject}</p>
                  <p className="text-xs text-slate-600 truncate">{contact.preview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-950/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <img src={contacts[0].image} alt="Julian Reed" className="w-9 h-9 rounded-full object-cover" />
            <div>
              <h3 className="font-bold text-white text-sm">Julian Reed</h3>
              <p className="text-[10px] font-bold text-teal-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                Active now
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <button className="hover:text-teal-400 transition-colors p-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="hover:text-teal-400 transition-colors p-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="hover:text-teal-400 transition-colors p-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 flex flex-col">
          {/* Date Separator */}
          <div className="flex justify-center">
            <span className="text-[9px] font-bold text-slate-600 bg-slate-800/60 border border-slate-700/60 px-3 py-1 rounded-full uppercase tracking-widest">
              Tuesday, Oct 24
            </span>
          </div>

          {/* Bubble 1: Julian */}
          <div className="flex gap-3 max-w-[80%]">
            <img src={contacts[0].image} alt="Julian" className="w-8 h-8 rounded-full object-cover mt-auto shrink-0" />
            <div className="flex flex-col gap-1">
              <div className="bg-slate-800/80 border border-slate-700/60 text-slate-200 p-4 rounded-2xl rounded-bl-none text-sm leading-relaxed">
                Hello! I saw your listing for the Royal Blue Tang. It looks incredible in the photos. Is it currently in a quarantine tank or the main display?
              </div>
              <span className="text-[10px] text-slate-600 font-semibold ml-1">11:04 AM</span>
            </div>
          </div>

          {/* Bubble 2: Me */}
          <div className="flex flex-col gap-1 self-end max-w-[80%]">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white p-4 rounded-2xl rounded-br-none text-sm leading-relaxed shadow-lg shadow-teal-900/30">
              Hi Julian! Thanks for reaching out. It's been in our specialized quarantine facility for 14 days now. Fully medicated and eating frozen mysis shrimp perfectly.
            </div>
            <div className="flex items-center justify-end gap-1 mr-1">
              <span className="text-[10px] text-slate-600 font-semibold">11:06 AM</span>
              <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Bubble 3: Julian */}
          <div className="flex gap-3 max-w-[80%]">
            <img src={contacts[0].image} alt="Julian" className="w-8 h-8 rounded-full object-cover mt-auto shrink-0" />
            <div className="flex flex-col gap-1">
              <div className="bg-slate-800/80 border border-slate-700/60 text-slate-200 p-4 rounded-2xl rounded-bl-none text-sm leading-relaxed">
                That's great to hear. I'm looking to introduce it to a 120-gallon reef. Here is my current setup. Do you think the flow is too high?
              </div>
              <span className="text-[10px] text-slate-600 font-semibold ml-1">11:08 AM</span>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 border-t border-slate-800/60 shrink-0">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <button className="text-slate-500 hover:text-teal-400 p-1.5 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Ketik pesan..."
              className="flex-1 bg-transparent border-none text-sm text-slate-300 focus:outline-none placeholder-slate-600"
            />
            <div className="flex items-center gap-1">
              <button className="text-slate-500 hover:text-teal-400 p-1.5 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="bg-teal-500 text-slate-950 p-2 rounded-lg hover:bg-teal-400 transition-colors ml-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
