import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../lib/auth'
import { initChat, getChatMessages, getSessionToken } from '../lib/api'

export default function FloatingChat() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [chatId, setChatId] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Open chat with context if requested by CustomEvent (e.g., from ProductDetail)
    const handleOpenChatContext = (e) => {
      setIsOpen(true)
      if (e.detail && e.detail.message) {
        setInput(e.detail.message)
      }
    }
    window.addEventListener('openChatContext', handleOpenChatContext)
    return () => window.removeEventListener('openChatContext', handleOpenChatContext)
  }, [])

  useEffect(() => {
    if (isOpen && user && user.role !== 'admin') {
      setupChat()
    }
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [isOpen, user])

  const setupChat = async () => {
    try {
      const { chat_id } = await initChat()
      setChatId(chat_id)

      const history = await getChatMessages(chat_id)
      setMessages(history || [])

      connectWebSocket(chat_id)
      scrollToBottom()
    } catch (err) {
      console.error("Failed to setup chat", err)
    }
  }

  const connectWebSocket = (cid) => {
    const token = getSessionToken()
    if (!token) return

    let wsUrl = import.meta.env.VITE_WS_URL 
      ? `${import.meta.env.VITE_WS_URL}/chat`
      : import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace('http', 'ws').replace('/api', '/ws/chat')
        : 'ws://localhost:8080/ws/chat'

    // Perbaikan agar tidak error jika URL base-nya berupa relative path
    if (wsUrl.startsWith('/')) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      wsUrl = `${protocol}//${window.location.host}${wsUrl}`
    }

    wsUrl += `?token=${token}`

    const socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      setIsConnected(true)
    }

    socket.onmessage = (event) => {
      const incomingMsg = JSON.parse(event.data)
      setMessages(prev => [...prev, incomingMsg])
      scrollToBottom()
    }

    socket.onclose = () => {
      setIsConnected(false)
      // Basic reconnect logic could go here
    }

    ws.current = socket
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return

    const token = getSessionToken()
    ws.current.send(JSON.stringify({
      type: 'message',
      token,
      content: input,
      chat_id: chatId
    }))

    setInput('')
  }

  if (!user || user.role === 'admin') return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-teal-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-teal-400 hover:scale-105 transition-all animate-bounce relative group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.75 3h8.5A4.756 4.756 0 0121 7.75v5.5A4.756 4.756 0 0116.25 18H15v3.25a.75.75 0 01-1.28.53l-3.53-3.53H7.75A4.756 4.756 0 013 13.25v-5.5A4.756 4.756 0 017.75 3z" />
          </svg>
          <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-teal-400 text-xs font-bold px-3 py-1.5 rounded-full border border-teal-500/30 shadow-lg whitespace-nowrap">
            Jelajahi & Tanya
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 md:w-96 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-teal-500 px-4 pt-4 pb-8 flex justify-between items-start shrink-0 relative">
            <div className="w-full text-center mt-6">
              <h3 className="font-extrabold text-slate-950 text-lg">AquaMarket Support</h3>
              <p className="text-[10px] text-teal-950 font-bold flex items-center justify-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span> Online
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-teal-950 hover:text-white p-1 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Floating Avatar */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center shadow-lg">
              <span className="text-xl">🐟</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 pt-10 space-y-5 bg-slate-950">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm text-center">
                <p>Belum ada pesan.</p>
                <p>Kirim pesan untuk mulai ngobrol dengan admin kami!</p>
              </div>
            ) : (
              messages.map(msg => {
                const isAdmin = msg.sender_id !== user?.id
                return (
                  <div key={msg.id} className={`flex w-full ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${isAdmin ? '' : 'flex-row-reverse'}`}>

                      {/* Avatar */}
                      <div className="shrink-0 mt-auto">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-100 shadow-sm border border-slate-700/50 bg-slate-800">
                          {isAdmin ? 'AQ' : user?.email?.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isAdmin
                            ? 'bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/50'
                            : 'bg-gradient-to-br from-teal-500 to-teal-600 text-slate-950 font-medium rounded-br-none'
                          }`}>
                          {msg.content}
                        </div>
                        <span className={`text-[9px] text-slate-500 font-bold ${isAdmin ? 'ml-1' : 'mr-1 text-right'}`}>
                          {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={!isConnected}
                placeholder={isConnected ? "Tulis pesan Anda..." : "Menghubungkan..."}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500/50 transition-colors disabled:opacity-50"
              />
              <button type="submit" disabled={!input.trim() || !isConnected} className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-400 transition-colors shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-0.5">
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
