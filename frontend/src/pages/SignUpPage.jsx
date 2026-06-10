import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../lib/api'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return
    setLoading(true)
    
    try {
      await registerUser({
        email: form.email,
        password: form.password,
        fullName: form.fullName // Assuming you'd want to handle this on the backend
      })
      alert('Sign up successful! You can now log in.')
      navigate('/login')
    } catch (err) {
      alert(err.message || 'Gagal mendaftar')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    alert('Login dengan Google sedang dinonaktifkan dalam mode Custom Auth.')
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
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 backdrop-blur-sm border border-teal-500/30 rounded-full text-teal-400 text-xs font-semibold tracking-wider uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse inline-block" />
            Join the Community
          </span>
          <h2 className="text-white text-3xl font-extrabold leading-tight mb-2">
            Your journey
          </h2>
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 text-3xl font-extrabold leading-tight mb-3">
            starts here.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Join thousands of passionate aquatic enthusiasts building extraordinary collections.
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

        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-white text-3xl font-extrabold mb-2">Create an account</h1>
              <p className="text-slate-400 text-sm">Join AquaMarket and start your aquatic collection today.</p>
            </div>

            {/* Google Button */}
            <button
              id="google-signup"
              onClick={handleGoogle}
              className="w-full py-3 border border-slate-800 rounded-xl flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 active:scale-[0.98] transition-all duration-200 text-sm font-bold text-slate-300 shadow-sm mb-6 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-500 font-bold tracking-widest">ATAU DAFTAR DENGAN EMAIL</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-slate-350 text-sm font-semibold mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="signup-name"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 pr-10 border border-slate-800 rounded-xl text-sm bg-slate-900 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-350 text-sm font-semibold mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ocean.enthusiast@example.com"
                    className="w-full px-4 py-3 pr-10 border border-slate-800 rounded-xl text-sm bg-slate-900 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-350 text-sm font-semibold mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 pr-10 border border-slate-800 rounded-xl text-sm bg-slate-900 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                    minLength={8}
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
                {/* Password strength indicator */}
                {form.password.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((level) => {
                      const strength = form.password.length >= 12
                        ? 4
                        : form.password.length >= 8
                        ? 3
                        : form.password.length >= 5
                        ? 2
                        : 1
                      return (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= strength
                              ? strength >= 4
                                ? 'bg-teal-500'
                                : strength >= 3
                                ? 'bg-blue-500'
                                : strength >= 2
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                              : 'bg-slate-800'
                          }`}
                        />
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-slate-350 text-sm font-semibold mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-3 pr-10 border rounded-xl text-sm bg-slate-900 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all ${
                      form.confirm && form.password !== form.confirm
                        ? 'border-red-500'
                        : 'border-slate-800'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showConfirm ? (
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
                {form.confirm && form.password !== form.confirm && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <div className="relative mt-0.5">
                  <div
                    onClick={() => setAgreed(!agreed)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                      agreed ? 'bg-teal-500 border-teal-500' : 'border-slate-800 bg-slate-900'
                    }`}
                  >
                    {agreed && (
                      <svg className="w-2.5 h-2.5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-400 leading-snug">
                  I agree to the{' '}
                  <button type="button" className="text-teal-400 font-bold hover:text-teal-350 transition-colors cursor-pointer">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" className="text-teal-400 font-bold hover:text-teal-350 transition-colors cursor-pointer">Privacy Policy</button>
                </span>
              </label>

              {/* Create Account Button */}
              <button
                id="signup-submit"
                type="submit"
                disabled={loading || !agreed}
                className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 active:scale-[0.98] text-slate-950 font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer shadow-md"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <>
                    Create Account
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-slate-400 mt-6">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-teal-400 font-semibold hover:text-teal-350 transition-colors cursor-pointer"
              >
                Sign in
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
