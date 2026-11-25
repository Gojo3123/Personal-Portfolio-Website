import { useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, GraduationCap, Save } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import Modal from '../components/Modal.jsx'
import FormField from '../components/FormField.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { validateRequired } from '../utils/validators.js'

const emptyForm = { degree: '', institution: '', period: '', grade: '', description: '' }

export default function EducationManagement() {
  const { education = [], createItem, updateItem, deleteItem, loading } = useData()
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
      degree: validateRequired(form.degree, 'Degree'),
      institution: validateRequired(form.institution, 'Institution'),
      period: validateRequired(form.period, 'Period'),
    }
    Object.keys(nextErrors).forEach((key) => !nextErrors[key] && delete nextErrors[key])
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      if (editing) {
        await updateItem('education', editing.id, form)
        toast.success('Education entry updated')
      } else {
        await createItem('education', form)
        toast.success('Education entry added')
      }
      setModalOpen(false)
    } catch (error) {
      toast.error(error.message || 'Could not save entry')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    const ok = await confirm({
      title: 'Delete education entry?',
      message: `${item.degree} will be removed from your portfolio.`,
      confirmText: 'Delete',
    })
    if (!ok) return
    await deleteItem('education', item.id)
    toast.success('Entry deleted')
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Education Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{education.length} entry(ies)</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="gradient-bg inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25"
        >
          <Plus className="h-4 w-4" /> New Entry
        </button>
      </div>

      {loading ? (
        <div className="skeleton h-64" />
      ) : education.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education entries"
          description="Add your degrees, courses and academic milestones."
          actionLabel="New Entry"
          onAction={openCreate}
        />
      ) : (
        <div className="space-y-4">
          {education.map((item) => (
            <div key={item.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.degree}</h3>
                  <span className="chip">{item.period}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-purple-500">{item.institution}</p>
                {item.grade && (
                  <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.grade}</p>
                )}
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
              <div className="flex gap-1 sm:flex-col">
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
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Entry' : 'New Education Entry'}>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Degree *" value={form.degree} onChange={setField('degree')} error={errors.degree} placeholder="B.Tech in Computer Science" />
          <FormField label="Institution *" value={form.institution} onChange={setField('institution')} error={errors.institution} placeholder="University name" />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Period *" value={form.period} onChange={setField('period')} error={errors.period} placeholder="2021 — 2025" />
            <FormField label="Grade / Score" value={form.grade || ''} onChange={setField('grade')} placeholder="CGPA: 8.7/10" />
          </div>
          <FormField
            as="textarea"
            rows={4}
            label="Description"
            value={form.description || ''}
            onChange={setField('description')}
            placeholder="Highlights, coursework, activities…"
          />
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
              {editing ? 'Save' : 'Add entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
