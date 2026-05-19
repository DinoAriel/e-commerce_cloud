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
    <div className="flex gap-6 max-w-7xl h-[calc(100vh-8rem)]">
      
      {/* Left Panel: Contacts */}
      <div className="w-80 flex flex-col">
        <h1 className="text-3xl font-bold text-[#0369a1] mb-6">Pesan</h1>
        
        {/* Search */}
        <div className="relative mb-6">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search discussions..." 
            className="w-full pl-10 pr-4 py-3 bg-[#e2e8f0] border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0369a1]/20"
          />
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className={`p-4 rounded-2xl cursor-pointer transition-colors border-l-4 ${contact.isActive ? 'bg-white border-[#10b981] shadow-sm' : 'hover:bg-gray-100 border-transparent'}`}
            >
              <div className="flex gap-3">
                <div className="relative shrink-0">
                  {contact.isInitials ? (
                    <div className="w-10 h-10 rounded-full bg-[#e0f2fe] text-[#0369a1] font-bold flex items-center justify-center text-sm">
                      {contact.initials}
                    </div>
                  ) : (
                    <img src={contact.image} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                  )}
                  {contact.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#10b981] rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-bold text-[#1e293b] text-sm truncate">{contact.name}</h4>
                    <span className="text-[9px] font-bold text-gray-400 mt-0.5">{contact.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#0369a1] truncate mb-0.5">{contact.subject}</p>
                  <p className="text-xs text-gray-500 truncate">{contact.preview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Chat Window */}
      <div className="flex-1 flex flex-col bg-[#f8fafc]">
        {/* Chat Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <img src={contacts[0].image} alt="Julian Reed" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h3 className="font-bold text-[#1e293b] text-sm">Julian Reed</h3>
              <p className="text-[10px] font-bold text-[#10b981] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                Active now
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 flex flex-col">
          {/* Date Separator */}
          <div className="flex justify-center mb-4">
            <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
              TUESDAY, OCT 24
            </span>
          </div>

          {/* Bubble 1: Julian */}
          <div className="flex gap-3 max-w-[80%]">
            <img src={contacts[0].image} alt="Julian" className="w-8 h-8 rounded-full object-cover mt-auto" />
            <div className="flex flex-col gap-1">
              <div className="bg-[#e2e8f0] text-[#1e293b] p-4 rounded-2xl rounded-bl-none text-sm leading-relaxed">
                Hello! I saw your listing for the Royal Blue Tang. It looks incredible in the photos. Is it currently in a quarantine tank or the main display?
              </div>
              <span className="text-[10px] text-gray-400 font-semibold ml-1">11:04 AM</span>
            </div>
          </div>

          {/* Bubble 2: Me */}
          <div className="flex flex-col gap-1 self-end max-w-[80%]">
            <div className="bg-[#0369a1] text-white p-4 rounded-2xl rounded-br-none text-sm leading-relaxed">
              Hi Julian! Thanks for reaching out. It's been in our specialized quarantine facility for 14 days now. Fully medicated and eating frozen mysis shrimp perfectly.
            </div>
            <div className="flex items-center justify-end gap-1 mr-1">
              <span className="text-[10px] text-gray-400 font-semibold">11:06 AM</span>
              <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Bubble 3: Julian */}
          <div className="flex gap-3 max-w-[80%]">
            <img src={contacts[0].image} alt="Julian" className="w-8 h-8 rounded-full object-cover mt-auto" />
            <div className="flex flex-col gap-1">
              <div className="bg-[#e2e8f0] text-[#1e293b] p-4 rounded-2xl rounded-bl-none text-sm leading-relaxed">
                That's great to hear. I'm looking to introduce it to a 120-gallon reef. Here is my current setup. Do you think the flow is too high?
              </div>
              <span className="text-[10px] text-gray-400 font-semibold ml-1">11:08 AM</span>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="pt-4 shrink-0">
          <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600 p-2 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none text-sm focus:outline-none placeholder-gray-400"
            />
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600 p-2 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600 p-2 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="bg-[#0369a1] text-white p-2.5 rounded-full hover:bg-[#0369a1]/90 transition-colors">
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
