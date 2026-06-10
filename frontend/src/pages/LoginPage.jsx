import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { loginUser } from '../lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const [showPassword, setShowPassword] = useState(false)
  const [keepSigned, setKeepSigned] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const response = await loginUser({ email, password })
      if (response && response.session) {
        // Save to context and localStorage
        login(response.session.access_token, response.session.user)
        
        if (response.session.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate(redirectTo)
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setErrorMsg(err.message || 'Gagal masuk. Periksa kembali email dan password Anda.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setErrorMsg('Login dengan Google sedang dinonaktifkan dalam mode Custom Auth.')
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden rounded-r-3xl border-r border-slate-900">
        <img
          src="/aqua_hero.png"
          alt="Premium Aquatics"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40" />

        {/* Top-left brand */}
        <div className="absolute top-7 left-7">
          <span className="text-white font-bold text-xl tracking-tight">
            Aqua<span className="text-teal-400">Market</span>
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-10 left-8 right-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 backdrop-blur-sm border border-teal-500/30 rounded-full text-teal-400 text-xs font-semibold tracking-wider uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse inline-block" />
            Premium Aquatics
          </span>
          <h2 className="text-white text-4xl font-extrabold leading-tight mb-2">
            Dive into the
          </h2>
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 text-4xl font-extrabold leading-tight mb-4">
            extraordinary.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Curating the world's most rare and breathtaking aquatic life for the discerning collector.
          </p>
        </div>

        {/* Bottom footer on image */}
        <div className="absolute bottom-0 left-0 right-0 px-8 py-3 flex items-center justify-between border-t border-slate-900">
          <span className="text-slate-500 text-xs">AquaMarket © 2026. Curating the Depths.</span>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-6">
          <span className="text-white font-bold text-xl tracking-tight">
            Aqua<span className="text-teal-400">Market</span>
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-white text-3xl font-extrabold mb-2">Welcome back</h1>
              <p className="text-slate-400 text-sm">Please enter your details to access your collection.</p>
            </div>

            {/* Error Message Banner */}
            {errorMsg && (
              <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-red-400 text-sm leading-relaxed">{errorMsg}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-slate-350 text-sm font-semibold mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <input
                    id="login-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ocean.enthusiast@example.com"
                    className="w-full px-4 py-3 pr-10 border border-slate-800 rounded-xl text-sm bg-slate-900 text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-350 text-sm font-semibold">Password</label>
                  <button
                    type="button"
                    className="text-teal-400 text-xs font-semibold hover:text-teal-300 transition-colors cursor-pointer"
                    onClick={() => {}}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 border border-slate-800 rounded-xl text-sm bg-slate-900 text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88 6.59 6.59m7.532 7.532 3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Keep me signed in */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    id="keep-signed"
                    type="checkbox"
                    checked={keepSigned}
                    onChange={(e) => setKeepSigned(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setKeepSigned(!keepSigned)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      keepSigned ? 'bg-teal-500 border-teal-500' : 'border-slate-800 bg-slate-900'
                    }`}
                  >
                    {keepSigned && (
                      <svg className="w-2.5 h-2.5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Keep me signed in</span>
              </label>

              {/* Sign In Button */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 active:scale-[0.98] text-slate-950 font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 cursor-pointer shadow-md"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <>
                    Sign In
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>



            {/* Sign up link */}
            <p className="text-center text-sm text-slate-400 mt-8">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-teal-400 font-semibold hover:text-teal-350 transition-colors cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Bottom footer links */}
        <div className="hidden lg:flex items-center justify-end gap-6 px-10 py-4 border-t border-slate-900">
          <button className="text-xs text-slate-500 hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</button>
          <button className="text-xs text-slate-500 hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</button>
          <button className="text-xs text-slate-500 hover:text-slate-400 transition-colors cursor-pointer">Support</button>
        </div>
      </div>
    </div>
  )
}
