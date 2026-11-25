import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  ShoppingCart,
  Sun,
  Moon,
  Search,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
  Settings,
} from 'lucide-react'
import Container from './Container.jsx'
import Avatar, { Logo } from './Avatar.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { cls } from '../utils/helpers'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/education', label: 'Education' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/contact', label: 'Contact' },
]

export default function Header({ onSearchOpen }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef(null)
  const { theme, toggleTheme } = useTheme()
  const { count } = useCart()
  const { user, isAdmin, logout, demoMode } = useAuth()
  const { settings, mode } = useData()
  const confirm = useConfirm()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [window.location.pathname])

  useEffect(() => {
    const onClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleLogout = async () => {
    setProfileOpen(false)
    const ok = await confirm({
      title: 'Log out?',
      message: 'You will need to sign in again to access your account.',
      confirmText: 'Log out',
    })
    if (!ok) return
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Account'

  return (
    <header
      className={cls(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'glass-strong shadow-lg shadow-slate-900/5 dark:shadow-black/30' : 'bg-transparent'
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-3">
        {/* Logo */}
        <Logo name={settings?.siteName || 'Portfolio'} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cls(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'text-purple-600 dark:text-purple-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onSearchOpen}
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white sm:flex"
          >
            <Search className="h-4.5 w-4.5 h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <Link
            to="/cart"
            aria-label={`Saved projects (${count})`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="gradient-bg absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          {/* Auth area */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <Avatar src={user.photoURL} name={displayName} size="sm" />
                <span className="hidden max-w-[110px] truncate text-sm font-semibold text-slate-700 dark:text-slate-200 md:block">
                  {displayName}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-fade-up dark:border-white/10 dark:bg-navy-900">
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-white/5">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{displayName}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    <span
                      className={cls(
                        'mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                        isAdmin
                          ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300'
                          : 'bg-blue-500/15 text-blue-600 dark:text-blue-300'
                      )}
                    >
                      {isAdmin ? 'Administrator' : 'Member'}
                    </span>
                  </div>
                  <div className="p-2">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/cart"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <User className="h-4 w-4" /> Saved Projects
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <Settings className="h-4 w-4" /> Get in Touch
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 gradient-bg-hover sm:block"
            >
              Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Demo mode badge */}
      {(demoMode || mode === 'local') && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-center text-[11px] font-semibold tracking-wide text-amber-600 dark:text-amber-300">
          Demo mode — Firebase not configured. Content is stored locally. Add credentials in .env to go live.
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur-lg animate-fade-in dark:border-white/10 dark:bg-navy-950/95 lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                onSearchOpen()
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
            >
              <Search className="h-4 w-4" /> Search…
            </button>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cls(
                    'rounded-xl px-3 py-3 text-sm font-semibold transition',
                    isActive
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="my-2 border-t border-slate-200 dark:border-white/10" />
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  handleLogout()
                }}
                className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                Logout ({displayName})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="gradient-bg rounded-xl px-3 py-3 text-center text-sm font-bold text-white"
              >
                Login / Signup
              </Link>
            )}
          </Container>
        </div>
      )}
    </header>
  )
}
