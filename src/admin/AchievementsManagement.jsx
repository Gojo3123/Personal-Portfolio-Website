import { useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Trophy,
  Save,
  Code as Github,
  Code,
  Users,
  Award,
  Sparkles,
  Star,
} from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import Modal from '../components/Modal.jsx'
import FormField from '../components/FormField.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { validateRequired } from '../utils/validators.js'

const iconOptions = [
  { value: 'Trophy', label: '🏆 Trophy' },
  { value: 'Github', label: '🐙 GitHub' },
  { value: 'Code', label: '⌨️ Code' },
  { value: 'Users', label: '👥 Users' },
  { value: 'Award', label: '🎖️ Award' },
  { value: 'Sparkles', label: '✨ Sparkles' },
  { value: 'Star', label: '⭐ Star' },
]

const iconMap = { Trophy, Github, Code, Users, Award, Sparkles, Star }

const emptyForm = { title: '', description: '', icon: 'Trophy', year: '' }

export default function AchievementsManagement() {
  const { achievements = [], createItem, updateItem, deleteItem, loading } = useData()
  const toast = useToast()
  const confirm = useConfirm()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({ ...item })
    setErrors({})
    setModalOpen(true)
  }

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {
      title: validateRequired(form.title, 'Title'),
      description: validateRequired(form.description, 'Description'),
    }
    Object.keys(nextErrors).forEach((key) => !nextErrors[key] && delete nextErrors[key])
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      if (editing) {
        await updateItem('achievements', editing.id, form)
        toast.success('Achievement updated')
      } else {
        await createItem('achievements', form)
        toast.success('Achievement added')
      }
      setModalOpen(false)
    } catch (error) {
      toast.error(error.message || 'Could not save achievement')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    const ok = await confirm({
      title: 'Delete achievement?',
      message: `${item.title} will be removed.`,
      confirmText: 'Delete',
    })
    if (!ok) return
    await deleteItem('achievements', item.id)
    toast.success('Achievement deleted')
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Achievements Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{achievements.length} achievement(s)</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="gradient-bg inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25"
        >
          <Plus className="h-4 w-4" /> New Achievement
        </button>
      </div>

      {loading ? (
        <div className="skeleton h-64" />
      ) : achievements.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements yet"
          description="Add awards, rankings and milestones to impress visitors."
          actionLabel="New Achievement"
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {achievements.map((item) => {
            const Icon = iconMap[item.icon] || Trophy
            return (
              <div key={item.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-orange-500">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-500/10"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="mt-3 font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                <span className="mt-3 inline-block text-xs font-black uppercase tracking-wider text-purple-500">
                  {item.year}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Achievement' : 'New Achievement'}>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Title *" value={form.title} onChange={setField('title')} error={errors.title} placeholder="Winner — National Hackathon" />
          <FormField
            as="textarea"
            rows={3}
            label="Description *"
            value={form.description}
            onChange={setField('description')}
            error={errors.description}
            placeholder="What did you accomplish?"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Icon</span>
              <select value={form.icon} onChange={setField('icon')} className="input-field">
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <FormField label="Year" value={form.year || ''} onChange={setField('year')} placeholder="2024" />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="gradient-bg inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editing ? 'Save' : 'Add achievement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
