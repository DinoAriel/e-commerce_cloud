import { useState, useEffect, useRef } from 'react'
import { getChats, getChatMessages, getSessionToken } from '../../lib/api'
import { useAuth } from '../../lib/auth'

export default function AdminMessages() {
  const { user } = useAuth()
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const ws = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchChats()
    connectWebSocket()
    return () => {
      if (ws.current) ws.current.close()
    }
  }, [])

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId)
    }
  }, [activeChatId])

  const fetchChats = async () => {
    try {
      const data = await getChats()
      setChats(data || [])
      if (data && data.length > 0 && !activeChatId) {
        setActiveChatId(data[0].id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (chatId) => {
    try {
      const msgs = await getChatMessages(chatId)
      setMessages(msgs || [])
      scrollToBottom()

      // Update unread count locally
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, unread_count: 0 } : c))
    } catch (err) {
      console.error(err)
    }
  }

  const connectWebSocket = () => {
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
      // connected
    }

    socket.onmessage = (event) => {
      const incomingMsg = JSON.parse(event.data)

      // Update current active messages if it belongs to this chat
      setMessages(prev => {
        // We use a functional update and check the activeChatId inside,
        // but react hooks prefer refs or dependencies. Since we dispatch this from ws,
        // we'll just check if incomingMsg.chat_id matches the current active chat via state inside useEffect if we used refs.
        // For simplicity, we just check activeChatId from closure. Wait, closure might be stale.
        return prev // we will handle this in another useEffect or via refs if needed
      })

      // Let's just refetch everything for simplicity to keep chats list updated
      fetchChats()
    }

    ws.current = socket
  }

  // To fix the stale closure issue with activeChatId in ws.onmessage:
  useEffect(() => {
    if (!ws.current) return
    ws.current.onmessage = (event) => {
      const incomingMsg = JSON.parse(event.data)
      if (incomingMsg.chat_id === activeChatId) {
        setMessages(prev => [...prev, incomingMsg])
        scrollToBottom()
      }
      fetchChats() // Update the sidebar
    }
  }, [activeChatId])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !ws.current || !activeChatId) return

    const token = getSessionToken()
    ws.current.send(JSON.stringify({
      type: 'message',
      token,
      content: input,
      chat_id: activeChatId
    }))

    setInput('')
  }

  const activeChat = chats.find(c => c.id === activeChatId)

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
          {loading ? (
            <div className="text-center text-slate-500 text-sm mt-10">Memuat pesan...</div>
          ) : chats.length === 0 ? (
            <div className="text-center text-slate-500 text-sm mt-10">Belum ada obrolan</div>
          ) : chats.map(chat => {
            const isActive = chat.id === activeChatId
            const initials = chat.user.full_name ? chat.user.full_name.substring(0, 2).toUpperCase() : chat.user.username.substring(0, 2).toUpperCase()
            const timeStr = chat.last_message ? new Date(chat.last_message.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${isActive
                    ? 'bg-teal-500/10 border-teal-500/30'
                    : 'hover:bg-slate-900/60 border-transparent hover:border-slate-800'
                  }`}
              >
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    {chat.user.avatar_url ? (
                      <img src={chat.user.avatar_url} alt={chat.user.username} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-teal-400 font-bold flex items-center justify-center text-sm">
                        {initials}
                      </div>
                    )}
                    {chat.unread_count > 0 && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">
                        {chat.unread_count}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className={`font-bold text-sm truncate ${isActive ? 'text-teal-300' : (chat.unread_count > 0 ? 'text-white' : 'text-slate-300')}`}>{chat.user.full_name || chat.user.username}</h4>
                      <span className="text-[9px] font-bold text-slate-600 mt-0.5 shrink-0 ml-2">{timeStr}</span>
                    </div>
                    <p className={`text-xs truncate ${isActive ? 'text-teal-400 font-semibold' : (chat.unread_count > 0 ? 'text-slate-300 font-semibold' : 'text-slate-500')}`}>
                      {chat.last_message ? chat.last_message.content : 'Belum ada pesan'}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Panel: Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-950/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60 shrink-0 bg-slate-900/50">
          {activeChat ? (
            <>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {activeChat.user.avatar_url ? (
                    <img src={activeChat.user.avatar_url} alt={activeChat.user.username} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-teal-400 font-bold flex items-center justify-center text-sm">
                      {activeChat.user.full_name ? activeChat.user.full_name.substring(0, 2).toUpperCase() : activeChat.user.username.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{activeChat.user.full_name || activeChat.user.username}</h3>
                  <p className="text-[10px] font-bold text-teal-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-10"></div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 flex flex-col">
          {!activeChatId ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Pilih obrolan untuk mulai membalas</p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender_id !== activeChat?.user?.id
                const showDate = idx === 0 || new Date(messages[idx - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString()

                return (
                  <div key={msg.id} className="flex flex-col gap-5">
                    {showDate && (
                      <div className="flex justify-center">
                        <span className="text-[9px] font-bold text-slate-600 bg-slate-800/60 border border-slate-700/60 px-3 py-1 rounded-full uppercase tracking-widest">
                          {new Date(msg.created_at).toLocaleDateString('id-ID', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}

                    <div className={`flex gap-3 max-w-[85%] ${isAdmin ? 'self-end ml-auto flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className="shrink-0 mt-auto">
                        {!isAdmin ? (
                          activeChat.user.avatar_url ? (
                            <img src={activeChat.user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-700" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-teal-400 font-bold flex items-center justify-center text-[10px]">
                              {activeChat.user.full_name ? activeChat.user.full_name.substring(0, 2).toUpperCase() : activeChat.user.username.substring(0, 2).toUpperCase()}
                            </div>
                          )
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center justify-center text-xs">
                            A
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border ${isAdmin
                            ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-br-none border-teal-500/30'
                            : 'bg-slate-800/80 text-slate-200 rounded-bl-none border-slate-700/60'
                          }`}>
                          {msg.content}
                        </div>
                        <span className={`text-[10px] text-slate-500 font-semibold ${isAdmin ? 'mr-1 text-right' : 'ml-1'}`}>
                          {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 border-t border-slate-800/60 shrink-0">
          <form onSubmit={sendMessage} className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <button type="button" className="text-slate-500 hover:text-teal-400 p-1.5 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!activeChatId}
              placeholder={activeChatId ? "Ketik pesan..." : "Pilih obrolan dulu"}
              className="flex-1 bg-transparent border-none text-sm text-slate-300 focus:outline-none placeholder-slate-600"
            />
            <div className="flex items-center gap-1">
              <button type="submit" disabled={!input.trim()} className="bg-teal-500 text-slate-950 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-teal-400 transition-colors ml-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-0.5">
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
