import { useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, BadgeCheck, Save, ExternalLink } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import Modal from '../components/Modal.jsx'
import FormField from '../components/FormField.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { validateRequired } from '../utils/validators.js'
import { formatDate } from '../utils/helpers.js'

const emptyForm = { name: '', issuer: '', date: '', credentialId: '', link: '' }

export default function CertificatesManagement() {
  const { certificates = [], createItem, updateItem, deleteItem, loading } = useData()
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
      name: validateRequired(form.name, 'Certificate name'),
      issuer: validateRequired(form.issuer, 'Issuer'),
    }
    Object.keys(nextErrors).forEach((key) => !nextErrors[key] && delete nextErrors[key])
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      if (editing) {
        await updateItem('certificates', editing.id, form)
        toast.success('Certificate updated')
      } else {
        await createItem('certificates', form)
        toast.success('Certificate added')
      }
      setModalOpen(false)
    } catch (error) {
      toast.error(error.message || 'Could not save certificate')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    const ok = await confirm({
      title: 'Delete certificate?',
      message: `${item.name} will be removed.`,
      confirmText: 'Delete',
    })
    if (!ok) return
    await deleteItem('certificates', item.id)
    toast.success('Certificate deleted')
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Certificates Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{certificates.length} certificate(s)</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="gradient-bg inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25"
        >
          <Plus className="h-4 w-4" /> New Certificate
        </button>
      </div>

      {loading ? (
        <div className="skeleton h-64" />
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={BadgeCheck}
          title="No certificates yet"
          description="Add professional certifications to build trust with visitors."
          actionLabel="New Certificate"
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {certificates.map((item) => (
            <div key={item.id} className="card p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="gradient-bg flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg">
                  <BadgeCheck className="h-5 w-5" />
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
              <h3 className="mt-3 font-bold leading-snug text-slate-900 dark:text-white">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {item.issuer} · {formatDate(item.date)}
              </p>
              {item.credentialId && (
                <p className="mt-2 rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  {item.credentialId}
                </p>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-500 hover:underline"
                >
                  Verify <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Certificate' : 'New Certificate'}>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Certificate Name *" value={form.name} onChange={setField('name')} error={errors.name} placeholder="AWS Cloud Practitioner" />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Issuer *" value={form.issuer} onChange={setField('issuer')} error={errors.issuer} placeholder="Amazon Web Services" />
            <FormField label="Issue Date" type="date" value={form.date || ''} onChange={setField('date')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Credential ID" value={form.credentialId || ''} onChange={setField('credentialId')} placeholder="ABC-12345" />
            <FormField label="Verification URL" placeholder="https://…" value={form.link || ''} onChange={setField('link')} />
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
              {editing ? 'Save' : 'Add certificate'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
