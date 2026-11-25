import { useMemo, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  Loader2,
  FolderKanban,
  ExternalLink,
  Code as Github,
} from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import Modal from '../components/Modal.jsx'
import FormField from '../components/FormField.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { projectCategories } from '../utils/defaultData.js'
import { validateRequired } from '../utils/validators.js'
import { formatDate, truncate } from '../utils/helpers.js'

const emptyForm = {
  name: '',
  description: '',
  category: projectCategories[0],
  tech: '',
  github: '',
  live: '',
  image: '',
  featured: false,
}

export default function ProjectsManagement() {
  const { projects = [], createItem, updateItem, deleteItem, uploadImage, loading } = useData()
  const toast = useToast()
  const confirm = useConfirm()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const categories = ['All', ...projectCategories]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesCategory = category === 'All' || project.category === category
      const matchesQuery =
        !q || project.name?.toLowerCase().includes(q) || (project.tech || []).join(' ').toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [projects, query, category])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (project) => {
    setEditing(project)
    setForm({
      ...project,
      tech: (project.tech || []).join(', '),
    })
    setErrors({})
    setModalOpen(true)
  }

  const setField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'projects')
      setForm((current) => ({ ...current, image: url }))
      toast.success('Image uploaded')
    } catch (error) {
      toast.error(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {
      name: validateRequired(form.name, 'Project name'),
      description: validateRequired(form.description, 'Description'),
    }
    Object.keys(nextErrors).forEach((key) => !nextErrors[key] && delete nextErrors[key])
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      tech: form.tech
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean),
      github: form.github.trim(),
      live: form.live.trim(),
      image: form.image.trim(),
      featured: Boolean(form.featured),
    }

    setSaving(true)
    try {
      if (editing) {
        await updateItem('projects', editing.id, payload)
        toast.success('Project updated')
      } else {
        await createItem('projects', payload)
        toast.success('Project created')
      }
      setModalOpen(false)
    } catch (error) {
      toast.error(error.message || 'Could not save project')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (project) => {
    const ok = await confirm({
      title: `Delete ${project.name}?`,
      message: 'The project will be permanently removed from your portfolio.',
      confirmText: 'Delete project',
    })
    if (!ok) return
    await deleteItem('projects', project.id)
    toast.success('Project deleted')
  }

  const toggleFeature = async (project) => {
    await updateItem('projects', project.id, { featured: !project.featured })
    toast.info(project.featured ? 'Removed from featured' : 'Marked as featured')
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Projects Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="gradient-bg inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects…"
            className="input-field !pl-11"
            aria-label="Search projects"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="input-field sm:w-52"
          aria-label="Filter by category"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-44" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create your first project or adjust the filters."
          actionLabel="New Project"
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <div key={project.id} className="card overflow-hidden">
              <div className="relative h-32 bg-gradient-to-br from-navy-800 to-purple-950">
                {project.image ? (
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="gradient-text text-3xl font-black opacity-40">
                      {project.name?.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                {project.featured && (
                  <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase text-navy-950">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">{project.name}</h3>
                  <span className="chip shrink-0">{project.category}</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {truncate(project.description, 90)}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  {(project.tech || []).join(' · ') || 'No tech listed'} · {formatDate(project.createdAt)}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/5">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleFeature(project)}
                      title={project.featured ? 'Unfeature' : 'Feature'}
                      className={`rounded-lg p-2 transition ${
                        project.featured
                          ? 'text-amber-500 hover:bg-amber-500/10'
                          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${project.featured ? 'fill-current' : ''}`} />
                    </button>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/10"
                        aria-label="GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/10"
                        aria-label="Live demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(project)}
                      className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-500/10"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Project' : 'New Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Project Name *" value={form.name} onChange={setField('name')} error={errors.name} placeholder="My Awesome App" />
          <FormField
            as="textarea"
            rows={4}
            label="Description *"
            value={form.description}
            onChange={setField('description')}
            error={errors.description}
            placeholder="What does it do and why is it special?"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Category</span>
              <select value={form.category} onChange={setField('category')} className="input-field">
                {projectCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <FormField label="Tech Stack" value={form.tech} onChange={setField('tech')} placeholder="React, Firebase, Tailwind" hint="Comma separated" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="GitHub URL" placeholder="https://github.com/…" value={form.github} onChange={setField('github')} />
            <FormField label="Live Demo URL" placeholder="https://…" value={form.live} onChange={setField('live')} />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">Thumbnail</span>
            <div className="flex items-center gap-3">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-navy-800">
                {form.image && (
                  <img
                    src={form.image}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-purple-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Upload image
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>
            <div className="mt-2">
              <input
                className="input-field"
                value={form.image}
                onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
                placeholder="…or paste an image URL"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={setField('featured')}
              className="h-4 w-4 rounded accent-purple-600"
            />
            ⭐ Feature this project on the home page
          </label>

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
              disabled={saving || uploading}
              className="gradient-bg inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editing ? 'Save changes' : 'Create project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
