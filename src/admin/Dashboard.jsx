import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  Users,
  MessageSquare,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Mail,
  Clock,
} from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { SkeletonText } from '../components/Skeletons.jsx'
import { formatTimeAgo, truncate } from '../utils/helpers'

export default function Dashboard() {
  const { projects, skills, messages, education, certificates, achievements, users, loading, loadUsers, mode } = useData()
  const { user } = useAuth()
  const [usersReady, setUsersReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadUsers().finally(() => !cancelled && setUsersReady(true))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = [
    { label: 'Total Projects', value: projects?.length ?? 0, icon: FolderKanban, color: 'from-blue-500 to-indigo-600', to: '/admin/projects' },
    { label: 'Registered Users', value: users?.length ?? 0, icon: Users, color: 'from-purple-500 to-fuchsia-600', to: '/admin/users' },
    { label: 'Contact Messages', value: messages?.length ?? 0, icon: MessageSquare, color: 'from-pink-500 to-rose-600', to: '/admin/messages' },
    { label: 'Skills Listed', value: skills?.length ?? 0, icon: Sparkles, color: 'from-emerald-500 to-teal-600', to: '/admin/skills' },
  ]

  const recentMessages = useMemo(
    () => [...(messages || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [messages]
  )

  const recentProjects = useMemo(
    () => [...(projects || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    [projects]
  )

  const contentCounts = [
    { label: 'Education', value: education?.length ?? 0, to: '/admin/education' },
    { label: 'Certificates', value: certificates?.length ?? 0, to: '/admin/certificates' },
    { label: 'Achievements', value: achievements?.length ?? 0, to: '/admin/achievements' },
    { label: 'Unread Messages', value: (messages || []).filter((m) => m.status === 'unread').length, to: '/admin/messages' },
  ]

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white shadow-xl shadow-purple-500/20 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/75">Welcome back</p>
          <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            {user?.displayName || 'Administrator'} 👋
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/85">
            You have <strong>{(messages || []).filter((m) => m.status === 'unread').length}</strong> unread
            message(s) and <strong>{projects?.length ?? 0}</strong> projects live on your portfolio.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/admin/projects"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-purple-700 shadow-lg transition hover:scale-105"
            >
              Manage projects
            </Link>
            <Link
              to="/admin/messages"
              className="rounded-xl border border-white/40 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
            >
              View inbox
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, to }) => (
          <Link key={label} to={to} className="card card-hover group p-5">
            <div className="flex items-start justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="h-6 w-6" />
              </span>
              <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 transition group-hover:opacity-100 dark:text-slate-600" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '—' : value}
            </p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          </Link>
        ))}
      </div>

      {/* Content counts */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {contentCounts.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            {item.label}
            <span className="gradient-bg rounded-full px-2.5 py-0.5 text-xs font-bold text-white">
              {loading ? '…' : item.value}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent messages */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Mail className="h-4 w-4 text-purple-500" /> Recent messages
            </h3>
            <Link to="/admin/messages" className="text-xs font-bold text-purple-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {loading ? (
              <div className="space-y-3 p-5">
                <SkeletonText lines={5} />
              </div>
            ) : recentMessages.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-400">
                No messages yet — they&apos;ll appear when visitors use the contact form.
              </p>
            ) : (
              recentMessages.map((message) => (
                <div key={message.id} className="flex items-start gap-3 px-5 py-4">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      message.status === 'unread' ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                        {message.name}
                      </p>
                      <span className="shrink-0 text-[11px] text-slate-400">
                        {formatTimeAgo(message.createdAt)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-medium">{message.subject}</span> — {truncate(message.message, 60)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent projects + activity */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <TrendingUp className="h-4 w-4 text-purple-500" /> Recent activity
            </h3>
            <Link to="/admin/projects" className="text-xs font-bold text-purple-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {loading ? (
              <div className="space-y-3 p-5">
                <SkeletonText lines={5} />
              </div>
            ) : (
              <>
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center gap-3 px-5 py-4">
                    <span className="gradient-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white">
                      {project.name?.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                        {project.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {project.category} · added {formatTimeAgo(project.createdAt)}
                      </p>
                    </div>
                    {project.featured && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-300">
                        Featured
                      </span>
                    )}
                  </div>
                ))}
                {recentProjects.length === 0 && (
                  <p className="p-6 text-center text-sm text-slate-400">No projects yet.</p>
                )}
                <div className="flex items-center gap-2 px-5 py-3.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  Data source: {mode === 'firestore' ? 'Firebase Firestore' : 'Local storage (demo)'}
                  {usersReady ? ` · ${users?.length ?? 0} user(s) loaded` : ''}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
