import { useEffect, useState } from 'react'
import { Save, Upload, User, Loader2 } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import FormField from '../components/FormField.jsx'
import Avatar from '../components/Avatar.jsx'
import { validateRequired } from '../utils/validators.js'

const emptyAbout = { introduction: '', education: '', objectives: '', interests: '', achievements: '', goals: '' }

export default function ProfileManagement() {
  const { profile, saveProfile, uploadImage, loading } = useData()
  const toast = useToast()

  const [form, setForm] = useState({ ...profile, about: { ...emptyAbout, ...(profile?.about || {}) } })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({ ...profile, about: { ...emptyAbout, ...(profile.about || {}) } })
    }
  }, [profile])

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const setAbout = (field) => (event) => {
    setForm((current) => ({
      ...current,
      about: { ...current.about, [field]: event.target.value },
    }))
  }

  const setSocial = (field) => (event) => {
    setForm((current) => ({
      ...current,
      socials: { ...(current.socials || {}), [field]: event.target.value },
    }))
  }

  const handleAvatar = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'avatars')
      setForm((current) => ({ ...current, avatar: url }))
      toast.success('Avatar uploaded — save to apply')
    } catch (error) {
      toast.error(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {
      name: validateRequired(form.name, 'Name'),
      title: validateRequired(form.title, 'Title'),
      email: validateRequired(form.email, 'Email'),
    }
    Object.keys(nextErrors).forEach((key) => !nextErrors[key] && delete nextErrors[key])
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please fill the required fields')
      return
    }

    setSaving(true)
    try {
      await saveProfile(form)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.message || 'Could not save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading && !profile) return <div className="skeleton h-96" />

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up" noValidate>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Profile Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Controls what visitors see on the Home and About pages.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving || uploading}
          className="gradient-bg inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Profile
        </button>
      </div>

      {/* Avatar */}
      <div className="card flex flex-col items-center gap-5 p-6 sm:flex-row">
        <Avatar src={form.avatar} name={form.name} size="xl" className="ring-4 ring-purple-500/30" />
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Profile photo</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            JPG or PNG up to 2MB. Falls back to initials if the image fails to load.
          </p>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Change photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </label>
        </div>
      </div>

      {/* Basic info */}
      <div className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <User className="h-4 w-4 text-purple-500" /> Basic information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full Name *" value={form.name || ''} onChange={setField('name')} error={errors.name} />
          <FormField label="Professional Title *" value={form.title || ''} onChange={setField('title')} error={errors.title} />
          <FormField label="Email *" type="email" value={form.email || ''} onChange={setField('email')} error={errors.email} />
          <FormField label="Phone" value={form.phone || ''} onChange={setField('phone')} />
          <FormField label="Location" value={form.location || ''} onChange={setField('location')} />
          <FormField label="Resume URL" placeholder="https://…" value={form.resumeUrl || ''} onChange={setField('resumeUrl')} hint="Leave empty to auto-generate a text resume" />
        </div>
        <div className="mt-4">
          <FormField
            label="Hero Tagline"
            value={form.tagline || ''}
            onChange={setField('tagline')}
          />
        </div>
        <div className="mt-4">
          <FormField
            as="textarea"
            rows={4}
            label="Short Introduction"
            value={form.intro || ''}
            onChange={setField('intro')}
          />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Hero Typing Titles
          </label>
          <input
            className="input-field"
            value={(form.titles || []).join(', ')}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                titles: event.target.value.split(',').map((t) => t.trim()).filter(Boolean),
              }))
            }
            placeholder="Full-Stack Developer, React Specialist, ..."
          />
          <p className="mt-1.5 text-xs text-slate-400">Comma separated — animated on the home page.</p>
        </div>
      </div>

      {/* About sections */}
      <div className="card p-6">
        <h3 className="mb-4 font-bold text-slate-900 dark:text-white">About page content</h3>
        <div className="space-y-4">
          {[
            ['introduction', 'Personal Introduction'],
            ['education', 'Education Background'],
            ['objectives', 'Career Objectives'],
            ['interests', 'Technical Interests'],
            ['achievements', 'Personal Achievements'],
            ['goals', 'Professional Goals'],
          ].map(([key, label]) => (
            <FormField
              key={key}
              as="textarea"
              rows={3}
              label={label}
              value={form.about?.[key] || ''}
              onChange={setAbout(key)}
            />
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="card p-6">
        <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Social links</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {['github', 'linkedin', 'twitter', 'instagram'].map((field) => (
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
          disabled={saving || uploading}
          className="gradient-bg inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Profile
        </button>
      </div>
    </form>
  )
}
