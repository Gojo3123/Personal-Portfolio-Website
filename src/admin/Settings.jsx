import { useEffect, useState } from 'react'
import { Save, Loader2, Globe, RotateCcw, Palette, ShieldCheck } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import FormField from '../components/FormField.jsx'
import { validateRequired } from '../utils/validators.js'

export default function Settings() {
  const { settings, saveSettings, resetLocalData, mode } = useData()
  const { theme, toggleTheme } = useTheme()
  const toast = useToast()
  const confirm = useConfirm()

  const [form, setForm] = useState(settings)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (settings) setForm(settings)
  }, [settings])

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const setSocial = (field) => (event) => {
    setForm((current) => ({
      ...current,
      socials: { ...(current.socials || {}), [field]: event.target.value },
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {
      siteName: validateRequired(form.siteName, 'Site name'),
      contactEmail: validateRequired(form.contactEmail, 'Contact email'),
    }
    Object.keys(nextErrors).forEach((key) => !nextErrors[key] && delete nextErrors[key])
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please fill the required fields')
      return
    }
    setSaving(true)
    try {
      await saveSettings(form)
      toast.success('Website settings saved')
    } catch (error) {
      toast.error(error.message || 'Could not save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    const ok = await confirm({
      title: 'Reset all content?',
      message:
        'Projects, skills, education, certificates, achievements, messages and settings will be restored to the original demo content. This cannot be undone.',
      confirmText: 'Reset everything',
    })
    if (!ok) return
    resetLocalData()
    toast.success('Content restored to defaults')
  }

  if (!form) return <div className="skeleton h-96" />

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Website Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Global branding, contact details and appearance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* General */}
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Globe className="h-4 w-4 text-purple-500" /> General
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Site Name *" value={form.siteName || ''} onChange={setField('siteName')} error={errors.siteName} />
            <FormField label="Contact Email *" type="email" value={form.contactEmail || ''} onChange={setField('contactEmail')} error={errors.contactEmail} />
          </div>
          <div className="mt-4">
            <FormField label="Tagline" value={form.tagline || ''} onChange={setField('tagline')} />
          </div>
          <div className="mt-4">
            <FormField
              as="textarea"
              rows={3}
              label="Footer Description"
              value={form.footerText || ''}
              onChange={setField('footerText')}
            />
          </div>
        </div>

        {/* Socials */}
        <div className="card p-6">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Social links</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {['github', 'linkedin', 'twitter'].map((field) => (
              <FormField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                placeholder="https://…"
                value={form.socials?.[field] || ''}
                onChange={setSocial(field)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="gradient-bg inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </button>
        </div>
      </form>

      {/* Appearance */}
      <div className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Palette className="h-4 w-4 text-purple-500" /> Appearance
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/10">
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Current theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visitors can toggle this from the header; your choice is remembered.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-slate-200"
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
        <h3 className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400">
          <RotateCcw className="h-4 w-4" /> Danger zone
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {mode === 'firestore'
            ? 'Content lives in Firestore. Resetting here is disabled — manage data directly in the Firebase console if needed.'
            : 'Restore the original demo content (projects, skills, profile, messages…). All local edits will be lost.'}
        </p>
        <button
          type="button"
          onClick={handleReset}
          disabled={mode === 'firestore'}
          className="mt-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:from-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset content to defaults
        </button>
      </div>

      {/* Security note */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Security:</strong> admin privileges come from <code>VITE_ADMIN_EMAILS</code> in your{' '}
          <code>.env</code> plus the <code>role</code> field on the user document. Public signups are
          always created with <code>role: user</code> — see <code>firestore.rules</code> for the
          server-side enforcement.
        </p>
      </div>
    </div>
  )
}
