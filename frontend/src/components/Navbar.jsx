import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '../lib/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasAuctionNotif, setHasAuctionNotif] = useState(true)

  const items = useSelector(state => state.cart.items)
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0)
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    logout()
    setProfileOpen(false)
  }

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Freshwater', path: '/freshwater' },
    { name: 'Saltwater', path: '/saltwater' },
    { name: 'Rare Fish', path: '/rarefish' },
    { name: 'Auctions', path: '/auctions' },
  ]

  const isActive = (path) => location.pathname === path

  const handleNavClick = (link) => {
    if (link.name === 'Auctions') {
      setHasAuctionNotif(false)
    }
    navigate(link.path)
    setMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
      <div className="px-4 md:px-20 h-16 flex items-center justify-between gap-2">

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="text-xl font-bold text-white shrink-0 hover:text-teal-400 transition-colors"
        >
          Aqua<span className="text-teal-400">Market</span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive(link.path)
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-slate-400 hover:text-teal-400 hover:bg-teal-500/5'
                }
                ${link.name === 'Auctions' ? 'relative' : ''}
              `}
            >
              {link.name}
              {link.name === 'Auctions' && hasAuctionNotif && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* Right: Search + Cart + Profile + Hamburger */}
        <div className="flex items-center gap-1 md:gap-2">

          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex items-center">
            {searchOpen && (
              <input
                autoFocus
                type="text"
                placeholder="Cari ikan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => { if (!searchQuery) setSearchOpen(false) }}
                className="w-40 md:w-64 pl-4 pr-10 py-2 text-sm border border-slate-800 rounded-xl bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            )}
            <button
              type="submit"
              onClick={(e) => { if (!searchOpen) { setSearchOpen(true); e.preventDefault() } }}
              className="p-2 rounded-xl text-slate-400 hover:text-teal-400 hover:bg-slate-900 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </form>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 rounded-xl text-slate-400 hover:text-teal-400 hover:bg-slate-900 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center hover:bg-slate-800 transition-all"
            >
              <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
              </svg>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 w-48 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-semibold text-slate-100 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/profile') }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition-colors cursor-pointer"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/orders') }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition-colors cursor-pointer"
                    >
                      Pesanan Saya
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/my-auctions') }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition-colors cursor-pointer"
                    >
                      Lelang Saya
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/admin') }}
                        className="w-full text-left px-4 py-2.5 text-sm text-teal-400 font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/login') }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition-colors cursor-pointer"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/signup') }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-teal-400 transition-colors cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-teal-400 hover:bg-slate-900 transition-all"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-900 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive(link.path)
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-slate-400 hover:text-teal-400 hover:bg-slate-900'
                }
                ${link.name === 'Auctions' ? 'relative' : ''}
              `}
            >
              {link.name}
              {link.name === 'Auctions' && hasAuctionNotif && (
                <span className="absolute right-4 top-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
