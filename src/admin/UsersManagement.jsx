import { useEffect, useMemo, useState } from 'react'
import { Search, Users, ShieldCheck, User as UserIcon, Trash2, RefreshCw } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Avatar from '../components/Avatar.jsx'
import { adminEmails, db } from '../firebase/config.js'
import { doc, deleteDoc } from 'firebase/firestore'
import { formatDate } from '../utils/helpers.js'

export default function UsersManagement() {
  const { users = [], loadUsers, mode } = useData()
  const { user: currentUser } = useAuth()
  const toast = useToast()
  const confirm = useConfirm()

  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    await loadUsers()
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* In local demo mode, fall back to the demo account store so the page is never empty. */
  const allUsers = useMemo(() => {
    if (users.length > 0) return users
    if (mode === 'local') {
      try {
        const demo = JSON.parse(localStorage.getItem('portfolio_demo_users')) || []
        return demo.map(({ password, ...rest }) => rest)
      } catch {
        return []
      }
    }
    return users
  }, [users, mode])

  const decorated = useMemo(
    () =>
      allUsers.map((item) => ({
        ...item,
        role:
          item.role ||
          (adminEmails.includes((item.email || '').toLowerCase()) ? 'admin' : 'user'),
      })),
    [allUsers]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return decorated.filter((item) => {
      const matchesRole = roleFilter === 'all' || item.role === roleFilter
      const matchesQuery =
        !q ||
        item.email?.toLowerCase().includes(q) ||
        item.fullName?.toLowerCase().includes(q) ||
        item.displayName?.toLowerCase().includes(q)
      return matchesRole && matchesQuery
    })
  }, [decorated, query, roleFilter])

  const handleDelete = async (item) => {
    if (item.uid === currentUser?.uid) {
      toast.error('You cannot delete your own account')
      return
    }
    const ok = await confirm({
      title: `Remove ${item.fullName || item.email}?`,
      message:
        mode === 'firestore'
          ? 'This deletes the user profile document. The Firebase Auth account itself must be removed from the Firebase console.'
          : 'This removes the demo account from this browser.',
      confirmText: 'Remove user',
    })
    if (!ok) return

    if (mode === 'local') {
      try {
        const demo = JSON.parse(localStorage.getItem('portfolio_demo_users')) || []
        localStorage.setItem(
          'portfolio_demo_users',
          JSON.stringify(demo.filter((entry) => entry.uid !== item.uid))
        )
        await fetchUsers()
        toast.success('Demo account removed')
      } catch {
        toast.error('Could not remove account')
      }
      return
    }

    // Firestore mode: delete the user profile document (Auth record stays; see note in UI)
    try {
      await deleteDoc(doc(db, 'users', item.id || item.uid))
      await fetchUsers()
      toast.success('User profile removed')
    } catch (error) {
      toast.error(error.message || 'Could not remove user')
    }
  }

  const adminCount = decorated.filter((item) => item.role === 'admin').length

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Registered Users</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {decorated.length} account{decorated.length !== 1 ? 's' : ''} ·{' '}
            <span className="font-bold text-purple-500">{adminCount} admin(s)</span>
          </p>
        </div>
        <button
          type="button"
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or email…"
            className="input-field !pl-11"
            aria-label="Search users"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="input-field sm:w-44"
          aria-label="Filter by role"
        >
          <option value="all">All roles</option>
          <option value="admin">Admins</option>
          <option value="user">Members</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton h-64" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={decorated.length === 0 ? 'No users registered yet' : 'No users match'}
          description={
            decorated.length === 0
              ? 'Accounts created through signup will be listed here with their roles.'
              : 'Try a different search or role filter.'
          }
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-white/5">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((item) => {
                const name = item.fullName || item.displayName || 'Unnamed user'
                return (
                  <tr key={item.id || item.uid} className="transition hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={item.photoURL} name={name} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-800 dark:text-slate-100">{name}</p>
                          <p className="truncate text-xs text-slate-400">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          item.role === 'admin'
                            ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300'
                            : 'bg-blue-500/15 text-blue-600 dark:text-blue-300'
                        }`}
                      >
                        {item.role === 'admin' && <ShieldCheck className="h-3 w-3" />}
                        {item.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {item.createdAt
                        ? formatDate(item.createdAt?.toDate ? item.createdAt.toDate() : item.createdAt)
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={item.uid === currentUser?.uid}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Remove user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        <ShieldCheck className="mr-1 inline h-3.5 w-3.5" />
        Roles are enforced by Firestore security rules — public signups always receive the{' '}
        <code>user</code> role and can never grant themselves admin access.
      </p>
    </div>
  )
}
