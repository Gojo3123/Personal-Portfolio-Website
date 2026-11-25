import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import FormField from '../components/FormField.jsx'
import { Logo } from '../components/Avatar.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { validateSignup } from '../utils/validators.js'

function firebaseErrorText(error) {
  const code = error?.code || ''
  if (code.includes('email-already-in-use')) return 'An account with this email already exists.'
  if (code.includes('weak-password')) return 'Password is too weak.'
  if (code.includes('invalid-email')) return 'Enter a valid email address.'
  if (code.includes('network')) return 'Network error — check your connection.'
  return error?.message || 'Could not create your account.'
}

export default function Signup() {
  usePageTitle('Sign Up', 'Create a free portfolio account.')
  const { signup, user, isAdmin, demoMode } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />
  }

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateSignup(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the highlighted fields')
      return
    }

    setLoading(true)
    try {
      await signup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        remember: true,
      })
      toast.success('Account created successfully — welcome aboard!')
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(demoMode ? error.message : firebaseErrorText(error))
    } finally {
      setLoading(false)
    }
  }

  const passwordChecks = [
    { label: 'At least 6 characters', ok: form.password.length >= 6 },
    { label: 'One letter', ok: /[A-Za-z]/.test(form.password) },
    { label: 'One number', ok: /[0-9]/.test(form.password) },
    { label: 'Passwords match', ok: form.password && form.password === form.confirmPassword },
  ]

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
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
            <UserPlus className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Save favourite projects and manage your profile.
          </p>

          {demoMode && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
              <strong>Demo mode</strong> — accounts are stored only in this browser until Firebase is
              configured in <code>.env</code>. Never reuse a real password here.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <FormField
              label="Full Name"
              placeholder="John Doe"
              value={form.fullName}
              onChange={setField('fullName')}
              error={errors.fullName}
              autoComplete="name"
            />

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
                placeholder="Create a strong password"
                value={form.password}
                onChange={setField('password')}
                error={errors.password}
                autoComplete="new-password"
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

            <div className="relative">
              <FormField
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={setField('confirmPassword')}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((visible) => !visible)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-[38px] text-slate-400 transition hover:text-purple-500"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password checklist */}
            <ul className="grid grid-cols-2 gap-1.5">
              {passwordChecks.map((check) => (
                <li
                  key={check.label}
                  className={`flex items-center gap-1.5 text-[11px] font-medium ${
                    check.ok ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> {check.label}
                </li>
              ))}
            </ul>

            <button
              type="submit"
              disabled={loading}
              className="gradient-bg-hover flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Create Account
            </button>

            <p className="text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              Passwords are handled exclusively by Firebase Authentication — they are never stored in
              plain text.
            </p>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 text-sm dark:border-white/10">
            <span className="text-slate-500 dark:text-slate-400">Already registered?</span>
            <Link to="/login" className="font-bold text-purple-500 hover:text-purple-400">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
