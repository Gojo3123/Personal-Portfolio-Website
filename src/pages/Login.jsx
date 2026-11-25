import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, LogIn, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import FormField from '../components/FormField.jsx'
import { Logo } from '../components/Avatar.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { validateEmail, validateLogin } from '../utils/validators.js'

function firebaseErrorText(error) {
  const code = error?.code || ''
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'Invalid email or password.'
  }
  if (code.includes('too-many-requests')) return 'Too many attempts. Please try again later.'
  if (code.includes('network')) return 'Network error — check your connection.'
  return error?.message || 'Could not sign in.'
}

export default function Login() {
  usePageTitle('Login', 'Sign in to your portfolio account.')
  const { login, user, isAdmin, demoMode, resetPassword } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetting, setResetting] = useState(false)

  if (user) {
    return <Navigate to={isAdmin ? '/admin' : from} replace />
  }

  const setField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateLogin(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      const result = await login(form)
      toast.success(`Welcome back${result?.displayName ? `, ${result.displayName}` : ''}!`)
      navigate(isAdmin || result?.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (error) {
      toast.error(demoMode ? error.message : firebaseErrorText(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-600/25 blur-3xl" />
        <div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-6 flex items-center justify-between">
          <Logo name="Portfolio" />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-purple-500 dark:text-slate-400"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>

        <div className="glass rounded-3xl p-7 shadow-2xl sm:p-9">
          <span className="gradient-bg inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-purple-500/30">
            <LogIn className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage your saved projects and account.
          </p>

          {demoMode && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
              <strong>Demo auth active</strong> — Firebase isn&apos;t configured, so accounts are
              stored locally. Try <code className="font-bold">admin@portfolio.dev</code> /{' '}
              <code className="font-bold">Admin@123</code> for the admin dashboard, or create your own
              account below. Configure <code>.env</code> to switch to real Firebase Auth.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div className="relative">
              <FormField
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={setField('email')}
                error={errors.email}
                autoComplete="email"
              />
              <Mail className="pointer-events-none absolute right-4 top-[38px] h-4 w-4 text-slate-400" />
            </div>

            <div className="relative">
              <FormField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={setField('password')}
                error={errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-[38px] text-slate-400 transition hover:text-purple-500"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={setField('remember')}
                  className="h-4 w-4 rounded border-slate-300 accent-purple-600"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setResetOpen((open) => !open)}
                className="font-semibold text-purple-500 transition hover:text-purple-400"
              >
                Forgot password?
              </button>
            </div>

            {resetOpen && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Reset your password via email
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(event) => {
                      setResetEmail(event.target.value)
                      setResetError('')
                    }}
                    placeholder="you@example.com"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const emailError = validateEmail(resetEmail)
                      if (emailError) {
                        setResetError(emailError)
                        return
                      }
                      setResetting(true)
                      try {
                        await resetPassword(resetEmail)
                        toast.success('Password reset email sent!')
                        setResetOpen(false)
                        setResetEmail('')
                      } catch (error) {
                        toast.error(demoMode ? error.message : firebaseErrorText(error))
                      } finally {
                        setResetting(false)
                      }
                    }}
                    disabled={resetting}
                    className="gradient-bg rounded-xl px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60"
                  >
                    {resetting ? '…' : 'Send'}
                  </button>
                </div>
                {resetError && <p className="mt-2 text-xs text-red-500">{resetError}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="gradient-bg-hover flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Sign In
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 text-sm dark:border-white/10">
            <span className="text-slate-500 dark:text-slate-400">No account yet?</span>
            <Link to="/signup" className="font-bold text-purple-500 hover:text-purple-400">
              Create one free
            </Link>
          </div>

          <Link
            to="/admin/login"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-purple-400 hover:text-purple-500 dark:border-white/10 dark:text-slate-400"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Administrator sign-in
          </Link>
        </div>

        {!demoMode && (
          <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
            Secured by Firebase Authentication
          </p>
        )}
      </div>
    </main>
  )
}
