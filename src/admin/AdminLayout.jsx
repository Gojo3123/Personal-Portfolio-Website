import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Sparkles,
  GraduationCap,
  BadgeCheck,
  Trophy,
  MessageSquare,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Home,
  ChevronLeft,
} from 'lucide-react'
import Avatar, { Logo } from '../components/Avatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { cls } from '../utils/helpers'

const navItems = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Sparkles },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/certificates', label: 'Certificates', icon: BadgeCheck },
  { to: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
]

/** Responsive sidebar shell for every admin page. */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { messages = [], mode } = useData()
  const confirm = useConfirm()
  const toast = useToast()
  const navigate = useNavigate()

  const unread = messages.filter((message) => message.status === 'unread').length

  useEffect(() => {
    setSidebarOpen(false)
  }, [])

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Log out of admin?',
      message: 'You will be returned to the admin login screen.',
      confirmText: 'Log out',
    })
    if (!ok) return
    await logout()
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Logo name="Admin Panel" to="/admin" />
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cls(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <Icon className="h-4.5 h-[18px] w-[18px]" />
            <span className="flex-1">{label}</span>
            {label === 'Messages' && unread > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pink-500 px-1.5 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
          <Avatar src={user?.photoURL} name={user?.displayName || user?.email} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user?.displayName || 'Admin'}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <Home className="h-4 w-4" /> View website
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900 lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 animate-slide-in bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900 shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass-strong">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-sm font-extrabold text-slate-900 dark:text-white sm:text-base">
                  Admin Dashboard
                </h1>
                <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                  Manage every section of your portfolio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cls(
                  'hidden rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider sm:inline-block',
                  mode === 'firestore'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                )}
              >
                {mode === 'firestore' ? 'Firestore live' : 'Local demo data'}
              </span>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Site
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
