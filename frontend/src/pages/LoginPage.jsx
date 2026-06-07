import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setLoading(false)
      setErrorMsg(error.message)
      return
    }

    try {
      // Ambil profile untuk cek role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      setLoading(false)

      if (profile && profile.role === 'admin') {
        navigate('/admin')
      } else {
        navigate(redirectTo)
      }
    } catch (err) {
      console.error('Error checking user role:', err)
      setLoading(false)
      navigate(redirectTo)
    }
  }

  const handleGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`
      }
    })
    if (error) {
      console.error('Google sign-in error:', error)
      setErrorMsg(error.message)
    }
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

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-500 font-bold tracking-widest">ATAU LANJUTKAN DENGAN</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Google Button */}
            <button
              id="google-signin"
              onClick={handleGoogle}
              className="w-full py-3 border border-slate-800 rounded-xl flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 active:scale-[0.98] transition-all duration-200 text-sm font-bold text-slate-300 shadow-sm cursor-pointer"
            >
              {/* Google SVG icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

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
