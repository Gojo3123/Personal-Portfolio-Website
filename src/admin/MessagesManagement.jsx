import { useMemo, useState } from 'react'
import { Search, Trash2, Mail, MailOpen, MessageSquare, Inbox, ExternalLink } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Modal from '../components/Modal.jsx'
import { formatDate, formatTimeAgo, truncate } from '../utils/helpers.js'

export default function MessagesManagement() {
  const { messages = [], deleteMessage, markMessageRead, loading } = useData()
  const toast = useToast()
  const confirm = useConfirm()

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...messages]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((message) => {
        const matchesStatus = status === 'all' || message.status === status
        const matchesQuery =
          !q ||
          message.name?.toLowerCase().includes(q) ||
          message.email?.toLowerCase().includes(q) ||
          message.subject?.toLowerCase().includes(q)
        return matchesStatus && matchesQuery
      })
  }, [messages, query, status])

  const openMessage = async (message) => {
    setSelected(message)
    if (message.status === 'unread') {
      await markMessageRead(message.id)
      setSelected({ ...message, status: 'read' })
    }
  }

  const handleDelete = async (message) => {
    const ok = await confirm({
      title: 'Delete message?',
      message: `Message from ${message.name} will be permanently removed.`,
      confirmText: 'Delete',
    })
    if (!ok) return
    await deleteMessage(message.id)
    if (selected?.id === message.id) setSelected(null)
    toast.success('Message deleted')
  }

  const unread = messages.filter((m) => m.status === 'unread').length

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Contact Messages</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {messages.length} total · <span className="font-bold text-pink-500">{unread} unread</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email or subject…"
            className="input-field !pl-11"
            aria-label="Search messages"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="input-field sm:w-44"
          aria-label="Filter status"
        >
          <option value="all">All statuses</option>
          <option value="unread">Unread only</option>
          <option value="read">Read only</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton h-64" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={messages.length === 0 ? 'No messages yet' : 'No messages match your filters'}
          description={
            messages.length === 0
              ? 'Messages submitted through the contact form will land here instantly.'
              : 'Try a different search term or status filter.'
          }
        />
      ) : (
        <div className="card divide-y divide-slate-100 overflow-hidden dark:divide-white/5">
          {filtered.map((message) => (
            <div
              key={message.id}
              className="flex cursor-pointer items-start gap-4 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
              onClick={() => openMessage(message)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => event.key === 'Enter' && openMessage(message)}
            >
              <span
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  message.status === 'unread' ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-100">{message.name}</p>
                  <p className="text-xs text-slate-400">{message.email}</p>
                </div>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {message.subject}
                </p>
                <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                  {truncate(message.message, 100)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-[11px] text-slate-400">{formatTimeAgo(message.createdAt)}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      markMessageRead(message.id)
                      toast.info(message.status === 'unread' ? 'Marked as read' : 'Already read')
                    }}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-white/10"
                    aria-label="Toggle read"
                    title={message.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
                  >
                    {message.status === 'unread' ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleDelete(message)
                    }}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-500"
                    aria-label="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.subject || 'Message'}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="gradient-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black text-white">
                {selected.name?.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white">{selected.name}</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-1 text-sm text-purple-500 hover:underline"
                >
                  {selected.email} <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-xs text-slate-400">{formatDate(selected.createdAt)}</p>
              </div>
              <span
                className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                  selected.status === 'unread'
                    ? 'bg-pink-500/15 text-pink-500'
                    : 'bg-slate-500/15 text-slate-500'
                }`}
              >
                {selected.status}
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap dark:bg-white/5 dark:text-slate-300">
              {selected.message}
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => handleDelete(selected)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="gradient-bg inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg"
              >
                <MessageSquare className="h-4 w-4" /> Reply by email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
