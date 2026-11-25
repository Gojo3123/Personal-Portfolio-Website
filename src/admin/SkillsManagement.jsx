import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Loader2, Sparkles, Save } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import Modal from '../components/Modal.jsx'
import FormField from '../components/FormField.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { skillCategories } from '../utils/defaultData.js'
import { validateRequired } from '../utils/validators.js'

const emptyForm = { name: '', category: skillCategories[0], level: 70 }

export default function SkillsManagement() {
  const { skills = [], createItem, updateItem, deleteItem, loading } = useData()
  const toast = useToast()
  const confirm = useConfirm()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const categories = ['All', ...skillCategories]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return skills.filter((skill) => {
      const matchesCategory = category === 'All' || skill.category === category
      const matchesQuery = !q || skill.name?.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [skills, query, category])

  const grouped = useMemo(() => {
    return filtered.reduce((acc, skill) => {
      acc[skill.category] = acc[skill.category] || []
      acc[skill.category].push(skill)
      return acc
    }, {})
  }, [filtered])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (skill) => {
    setEditing(skill)
    setForm({ name: skill.name, category: skill.category, level: skill.level })
    setErrors({})
    setModalOpen(true)
  }

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nameError = validateRequired(form.name, 'Skill name')
    if (nameError) {
      setErrors({ name: nameError })
      return
    }
    const payload = {
      name: form.name.trim(),
      category: form.category,
      level: Math.max(0, Math.min(100, Number(form.level) || 0)),
    }
    setSaving(true)
    try {
      if (editing) {
        await updateItem('skills', editing.id, payload)
        toast.success('Skill updated')
      } else {
        await createItem('skills', payload)
        toast.success('Skill added')
      }
      setModalOpen(false)
    } catch (error) {
      toast.error(error.message || 'Could not save skill')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (skill) => {
    const ok = await confirm({
      title: `Delete ${skill.name}?`,
      message: 'This skill will be removed from your portfolio.',
      confirmText: 'Delete',
    })
    if (!ok) return
    await deleteItem('skills', skill.id)
    toast.success('Skill deleted')
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Skills Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {skills.length} skill{skills.length !== 1 ? 's' : ''} across {skillCategories.length} categories
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="gradient-bg inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition"
        >
          <Plus className="h-4 w-4" /> New Skill
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills…"
            className="input-field !pl-11"
            aria-label="Search skills"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="input-field sm:w-56"
          aria-label="Filter category"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="skeleton h-64" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No skills found"
          description="Add skills so visitors can see your technical strengths."
          actionLabel="New Skill"
          onAction={openCreate}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5 dark:border-white/5 dark:bg-white/[0.03]">
                <h3 className="font-bold text-slate-900 dark:text-white">{group}</h3>
                <span className="text-xs font-bold text-purple-500">{items.length}</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {items.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                          {skill.name}
                        </p>
                        <span className="text-xs font-bold text-purple-500">{skill.level}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div className="gradient-bg h-full rounded-full" style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEdit(skill)}
                      className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-500/10"
                      aria-label="Edit skill"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(skill)}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10"
                      aria-label="Delete skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'New Skill'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Skill Name *" value={form.name} onChange={setField('name')} error={errors.name} placeholder="React" />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Category</span>
            <select value={form.category} onChange={setField('category')} className="input-field">
              {skillCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span>Proficiency</span>
              <span className="text-purple-500">{form.level}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={form.level}
              onChange={(event) => setForm((current) => ({ ...current, level: event.target.value }))}
              className="w-full accent-purple-600"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
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
              {editing ? 'Save' : 'Add skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
