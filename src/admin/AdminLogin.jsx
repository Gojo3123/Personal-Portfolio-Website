import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff, ArrowLeft, Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import FormField from '../components/FormField.jsx'
import { Logo } from '../components/Avatar.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { validateLogin } from '../utils/validators.js'
import { adminEmails } from '../firebase/config.js'

/**
 * Dedicated administrator login. Public signups always receive the `user`
 * role — only accounts configured via VITE_ADMIN_EMAILS (or the Firestore
 * users doc, set manually) can pass this screen and the AdminRoute guard.
 */
export default function AdminLogin() {
  usePageTitle('Admin Login', 'Administrator access to the portfolio dashboard.')
  const { login, logout, user, isAdmin, demoMode } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user && isAdmin) return <Navigate to="/admin" replace />
  if (user && !isAdmin) return <Navigate to="/" replace />

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
      const email = (result?.email || form.email).toLowerCase()
      const allowed =
        result?.role === 'admin' || adminEmails.includes(email) || demoMode

      if (demoMode) {
        // Demo mode: only the seeded admin account (or admin-listed emails) may enter.
        const demoOk =
          email === 'admin@portfolio.dev' || adminEmails.includes(email)
        if (!demoOk) {
          toast.error('This account is not an administrator. Use admin@portfolio.dev.')
          return
        }
        toast.success('Welcome, Admin!')
        navigate('/admin', { replace: true })
        return
      }

      if (!allowed) {
        toast.error('Access denied — this account does not have administrator rights.')
        await logout()
        return
      }

      toast.success('Welcome, Admin!')
      navigate('/admin', { replace: true })
    } catch (error) {
      toast.error(error?.message || 'Could not sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-700/30 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-700/30 blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-6 flex items-center justify-between">
          <Logo name="Admin" />
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-purple-500 dark:text-slate-400"
          >
            <ArrowLeft className="h-4 w-4" /> User login
          </Link>
        </div>

        <div className="glass rounded-3xl p-7 shadow-2xl sm:p-9">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
            Administrator Access
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Restricted area — authorized admins only.
          </p>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
            {demoMode ? (
              <>
                <strong className="text-amber-600 dark:text-amber-300">Demo credentials:</strong>{' '}
                <code className="font-bold">admin@portfolio.dev</code> /{' '}
                <code className="font-bold">Admin@123</code>. Configure Firebase in <code>.env</code>{' '}
                to enable real admin authentication.
              </>
            ) : (
              <>
                Sign in with an email listed in <code>VITE_ADMIN_EMAILS</code>. Public signups can
                never become admins — this is enforced by Firestore security rules.
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div className="relative">
              <FormField
                label="Admin Email"
                type="email"
                placeholder="admin@portfolio.dev"
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

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={setField('remember')}
                className="h-4 w-4 rounded accent-purple-600"
              />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:from-red-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
