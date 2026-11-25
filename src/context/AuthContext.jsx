import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { adminEmails, auth, db, isFirebaseConfigured } from '../firebase/config'

const AuthContext = createContext(null)
const DEMO_KEY = 'portfolio_demo_auth'
const DEMO_USERS_KEY = 'portfolio_demo_users'

/**
 * The app uses REAL Firebase Authentication whenever Firebase is configured.
 * When no Firebase credentials exist (fresh clone / preview), a clearly labelled
 * local demo mode keeps the UI explorable. Configure `.env` to disable it —
 * demo credentials stop existing the moment Firebase is connected.
 */
function readDemoUsers() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY)) || []
  } catch {
    return []
  }
}

function writeDemoUsers(users) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

function ensureDemoAdmin() {
  const users = readDemoUsers()
  if (!users.some((user) => user.email === 'admin@portfolio.dev')) {
    users.push({
      uid: 'demo-admin',
      fullName: 'Demo Admin',
      email: 'admin@portfolio.dev',
      password: 'Admin@123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    })
    writeDemoUsers(users)
  }
}

function readDemoSession() {
  try {
    return JSON.parse(sessionStorage.getItem(DEMO_KEY) || localStorage.getItem(DEMO_KEY))
  } catch {
    return null
  }
}

function writeDemoSession(user, remember) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(DEMO_KEY, JSON.stringify(user))
}

function clearDemoSession() {
  localStorage.removeItem(DEMO_KEY)
  sessionStorage.removeItem(DEMO_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const demoMode = !isFirebaseConfigured

  /* ---------------- Firebase session listener ---------------- */
  useEffect(() => {
    if (demoMode) {
      ensureDemoAdmin()
      setUser(readDemoSession())
      setLoading(false)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }
      try {
        const snapshot = await getDoc(doc(db, 'users', firebaseUser.uid))
        const data = snapshot.exists() ? snapshot.data() : {}
        const email = (firebaseUser.email || '').toLowerCase()
        const role =
          adminEmails.includes(email) || data.role === 'admin' ? 'admin' : data.role || 'user'
        setUser({
          uid: firebaseUser.uid,
          email,
          displayName: data.fullName || firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          role,
          createdAt: data.createdAt || null,
        })
      } catch (error) {
        console.error('[Auth] Failed to load profile:', error)
        setUser({
          uid: firebaseUser.uid,
          email: (firebaseUser.email || '').toLowerCase(),
          displayName: firebaseUser.displayName || '',
          photoURL: '',
          role: adminEmails.includes((firebaseUser.email || '').toLowerCase()) ? 'admin' : 'user',
        })
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [demoMode])

  /* ---------------- Auth actions ---------------- */
  const signup = useCallback(async ({ fullName, email, password, remember = true }) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (demoMode) {
      const users = readDemoUsers()
      if (users.some((item) => item.email === normalizedEmail)) {
        throw new Error('An account with this email already exists.')
      }
      const record = {
        uid: `demo_${Date.now()}`,
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        role: adminEmails.includes(normalizedEmail) ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
      }
      writeDemoUsers([...users, record])
      const session = { ...record }
      delete session.password
      writeDemoSession(session, remember)
      setUser(session)
      return session
    }

    const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password)
    await updateFirebaseProfile(credential.user, { displayName: fullName.trim() })
    const role = adminEmails.includes(normalizedEmail) ? 'admin' : 'user'
    await setDoc(doc(db, 'users', credential.user.uid), {
      fullName: fullName.trim(),
      email: normalizedEmail,
      role,
      createdAt: serverTimestamp(),
    })
    return credential.user
  }, [demoMode])

  const login = useCallback(async ({ email, password, remember = true }) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (demoMode) {
      const users = readDemoUsers()
      const found = users.find((item) => item.email === normalizedEmail)
      if (!found || found.password !== password) {
        throw new Error('Invalid email or password.')
      }
      const session = { ...found }
      delete session.password
      writeDemoSession(session, remember)
      setUser(session)
      return session
    }

    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)
    const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password)
    const isAdminEmail = adminEmails.includes(normalizedEmail)
    const snapshot = await getDoc(doc(db, 'users', credential.user.uid))
    const role = isAdminEmail || snapshot.data()?.role === 'admin' ? 'admin' : 'user'
    return { ...credential.user, role }
  }, [demoMode])

  const logout = useCallback(async () => {
    if (demoMode) {
      clearDemoSession()
      setUser(null)
      return
    }
    await signOut(auth)
  }, [demoMode])

  const resetPassword = useCallback(
    async (email) => {
      if (demoMode) {
        throw new Error('Password reset requires Firebase to be configured.')
      }
      await sendPasswordResetEmail(auth, email.trim().toLowerCase())
    },
    [demoMode]
  )

  const updateDisplayName = useCallback(
    async (fullName) => {
      if (!user) return
      if (demoMode) {
        const updated = { ...user, displayName: fullName }
        setUser(updated)
        if (localStorage.getItem(DEMO_KEY)) writeDemoSession(updated, true)
        else writeDemoSession(updated, false)
        const users = readDemoUsers().map((item) =>
          item.uid === user.uid ? { ...item, fullName } : item
        )
        writeDemoUsers(users)
        return
      }
      if (auth.currentUser) await updateFirebaseProfile(auth.currentUser, { displayName: fullName })
      setUser((current) => (current ? { ...current, displayName: fullName } : current))
    },
    [user, demoMode]
  )

  const isAdmin = Boolean(user && (user.role === 'admin' || adminEmails.includes(user.email)))

  const value = useMemo(
    () => ({
      user,
      loading,
      demoMode,
      isAdmin,
      signup,
      login,
      logout,
      resetPassword,
      updateDisplayName,
      listDemoUsers: readDemoUsers,
    }),
    [user, loading, demoMode, isAdmin, signup, login, logout, resetPassword, updateDisplayName]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
