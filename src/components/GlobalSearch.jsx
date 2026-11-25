import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, FolderKanban, Sparkles, ArrowRight } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import Modal from './Modal.jsx'

const PAGES = [
  { title: 'Home', to: '/', type: 'Page' },
  { title: 'About', to: '/about', type: 'Page' },
  { title: 'Skills', to: '/skills', type: 'Page' },
  { title: 'Projects', to: '/projects', type: 'Page' },
  { title: 'Education', to: '/education', type: 'Page' },
  { title: 'Certificates', to: '/certificates', type: 'Page' },
  { title: 'Contact', to: '/contact', type: 'Page' },
  { title: 'Cart / Saved Projects', to: '/cart', type: 'Page' },
  { title: 'Login', to: '/login', type: 'Page' },
  { title: 'Sign Up', to: '/signup', type: 'Page' },
  { title: 'Admin Login', to: '/admin/login', type: 'Page' },
]

/** Cmd/Ctrl+K global search across pages, projects and skills. */
export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { projects = [], skills = [] } = useData()

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const all = [
      ...PAGES,
      ...projects.map((p) => ({
        title: p.name,
        to: '/projects',
        type: 'Project',
        subtitle: p.category,
        icon: FolderKanban,
      })),
      ...skills.map((s) => ({
        title: s.name,
        to: '/skills',
        type: 'Skill',
        subtitle: s.category,
        icon: Sparkles,
      })),
    ]
    if (!q) return all.slice(0, 8)
    return all
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.subtitle || '').toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
      )
      .slice(0, 10)
  }, [query, projects, skills])

  const go = (item) => {
    if (!item) return
    onClose()
    navigate(item.to)
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current) => Math.min(current + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      go(results[active])
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Search">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-navy-800">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          placeholder="Search pages, projects, skills…"
          className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 dark:text-white"
          aria-label="Search"
        />
        <kbd className="hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-400 dark:border-white/10 dark:bg-white/5 sm:block">
          ESC
        </kbd>
      </div>

      <ul className="mt-4 max-h-80 space-y-1.5 overflow-y-auto">
        {results.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No results for “{query}”. Try another keyword.
          </li>
        )}
        {results.map((item, index) => {
          const Icon = item.icon || FileText
          return (
            <li key={`${item.type}-${item.title}-${index}`}>
              <button
                type="button"
                onClick={() => go(item)}
                onMouseEnter={() => setActive(index)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  index === active
                    ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{item.title}</span>
                  <span className="block text-xs text-slate-400 dark:text-slate-500">
                    {item.subtitle || item.type}
                  </span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.type}
                </span>
                <ArrowRight className="h-4 w-4 opacity-40" />
              </button>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}
