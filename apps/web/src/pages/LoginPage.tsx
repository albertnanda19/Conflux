import { useState, type FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

const FLOATING_SHAPES = [
  { size: 180, x: '10%', y: '20%', delay: '0s', duration: '7s', opacity: 0.12 },
  { size: 120, x: '70%', y: '15%', delay: '2s', duration: '8s', opacity: 0.1 },
  { size: 200, x: '30%', y: '65%', delay: '4s', duration: '6s', opacity: 0.08 },
  { size: 90, x: '80%', y: '70%', delay: '1s', duration: '9s', opacity: 0.14 },
  { size: 150, x: '55%', y: '40%', delay: '3s', duration: '7.5s', opacity: 0.09 },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError, user } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formTouched, setFormTouched] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  function validate(): boolean {
    let valid = true
    if (!email.trim()) {
      setEmailError('Email wajib diisi.')
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Format email tidak valid.')
      valid = false
    } else {
      setEmailError('')
    }
    if (!password) {
      setPasswordError('Kata sandi wajib diisi.')
      valid = false
    } else if (password.length < 6) {
      setPasswordError('Kata sandi minimal 6 karakter.')
      valid = false
    } else {
      setPasswordError('')
    }
    return valid
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormTouched(true)
    clearError()
    if (!validate()) return
    const ok = await login(email.trim(), password)
    if (ok) navigate('/', { replace: true })
  }

  function handleEmailBlur() {
    setFormTouched(true)
    if (!email.trim()) setEmailError('Email wajib diisi.')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setEmailError('Format email tidak valid.')
    else setEmailError('')
  }

  function handlePasswordBlur() {
    setFormTouched(true)
    if (!password) setPasswordError('Kata sandi wajib diisi.')
    else if (password.length < 6) setPasswordError('Kata sandi minimal 6 karakter.')
    else setPasswordError('')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 40%, #0891B2 100%)' }}>
        {FLOATING_SHAPES.map((shape, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
              opacity: shape.opacity,
              animation: `float ${shape.duration} ease-in-out ${shape.delay} infinite`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              ⚡
            </div>
            <span className="text-xl font-semibold tracking-tight">Conflux PSC</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Platform Komunikasi<br />Sales Terpadu
          </h1>
          <p className="text-white/60 text-lg max-w-md leading-relaxed">
            Satu platform untuk mengelola semua percakapan sales, kampanye broadcast, dan analitik performa tim anda.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-canvas">
        <div className="w-full max-w-sm animate-slideUp">
          {/* Mobile Brand */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-blue flex items-center justify-center text-3xl font-bold text-white mx-auto mb-3">
              ⚡
            </div>
            <h1 className="text-xl font-bold text-ink">Conflux PSC</h1>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-1">Selamat Datang Kembali</h2>
            <p className="text-sm text-steel">Masuk ke akun anda untuk melanjutkan</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 animate-fadeIn">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-ink mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-steel pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (formTouched) setEmailError('') }}
                  onBlur={handleEmailBlur}
                  placeholder="admin@company.com"
                  autoComplete="email"
                  className={`w-full h-11 pl-10 pr-4 text-sm bg-white border rounded-xl text-ink placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all ${
                    emailError ? 'border-red-400 focus:ring-red-100 focus:border-red-400' : 'border-hairline'
                  }`}
                />
              </div>
              {emailError && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{emailError}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-ink mb-1.5">Kata Sandi</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-steel pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (formTouched) setPasswordError('') }}
                  onBlur={handlePasswordBlur}
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  className={`w-full h-11 pl-10 pr-11 text-sm bg-white border rounded-xl text-ink placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all ${
                    passwordError ? 'border-red-400 focus:ring-red-100 focus:border-red-400' : 'border-hairline'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-ink transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{passwordError}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-hairline text-brand-blue focus:ring-brand-blue/20" />
                <span className="text-xs text-steel">Ingat saya</span>
              </label>
              <button type="button" className="text-xs text-brand-blue hover:text-brand-blue-deep font-medium transition-colors">
                Lupa password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-deep text-white text-sm font-semibold
                         hover:shadow-lg hover:shadow-brand-blue/25 hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          {/* Demo Hint */}
          <div className="mt-6 px-4 py-3 rounded-xl bg-surface border border-hairline-soft">
            <p className="text-[11px] text-steel text-center">
              Demo: <span className="font-medium text-ink">admin@company.com</span> / <span className="font-medium text-ink">password</span>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-steel">
            Belum punya akun?{' '}
            <button type="button" className="text-brand-blue hover:text-brand-blue-deep font-medium transition-colors">
              Hubungi admin
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
