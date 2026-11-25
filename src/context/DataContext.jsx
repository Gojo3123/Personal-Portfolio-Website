import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage, isFirebaseConfigured } from '../firebase/config'
import { buildDefaultData } from '../utils/defaultData'
import { readFileAsDataURL, uid } from '../utils/helpers'

const DataContext = createContext(null)

const LOCAL_KEY = 'portfolio_content_v1'

/* Single-document collections (profile / settings) live under `content`. */
const COLLECTIONS = ['skills', 'projects', 'education', 'certificates', 'achievements', 'messages']
const SINGLE_DOCS = { profile: 'profile', settings: 'settings' }

function replaceLegacyIdentity(value) {
  if (typeof value === 'string') {
    return value
      .replace(/\b(?:A(?:r)?yan|Arayan)\s+Kapoor\b/gi, 'Deepak Raj')
      .replace(/\bGautam Kumar\b/g, 'Deepak Raj')
      .replace(/\bgautam kumar\b/g, 'Deepak Kumar')
      .replace(/\bI'm Gautam\b/g, "I'm Deepak")
      .replace(/\bGautam\b/g, 'Deepak')
      .replace(/gautam\.kumar@example\.com/gi, '2500030575@kluniversity.in')
      .replace(/^https?:\/\/github\.com\/gautamkumar\/?$/gi, 'https://github.com/dashboard')
      .replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\/gautamkumar\/?$/gi, 'https://www.linkedin.com/feed/')
      .replace(/^https?:\/\/(?:x\.com\/gautamkumar|twitter\.com\/gautamkumar)\/?$/gi, 'https://x.com/home?lang=en')
  }
  if (Array.isArray(value)) return value.map(replaceLegacyIdentity)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceLegacyIdentity(item)])
    )
  }
  return value
}

function loadLocalData() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return buildDefaultData()
    const parsed = replaceLegacyIdentity(JSON.parse(raw))
    if (parsed.profile) {
      parsed.profile.avatar = '/deepak-raj.jpg'
      parsed.profile.email = '2500030575@kluniversity.in'
      parsed.profile.socials = {
        ...(parsed.profile.socials || {}),
        github: 'https://github.com/dashboard',
        linkedin: 'https://www.linkedin.com/feed/',
        twitter: 'https://x.com/home?lang=en',
      }
    }
    if (parsed.settings) {
      parsed.settings.contactEmail = '2500030575@kluniversity.in'
      parsed.settings.socials = {
        ...(parsed.settings.socials || {}),
        github: 'https://github.com/dashboard',
        linkedin: 'https://www.linkedin.com/feed/',
        twitter: 'https://x.com/home?lang=en',
      }
    }
    const defaults = buildDefaultData()
    return { ...defaults, ...parsed, profile: { ...defaults.profile, ...parsed.profile } }
  } catch {
    return buildDefaultData()
  }
}

/**
 * Central content store.
 * - Firestore mode (Firebase configured): every read/write hits the cloud.
 * - Local mode (fresh clone / preview): content persists in localStorage so the
 *   whole admin dashboard stays fully functional without credentials.
 */
export function DataProvider({ children }) {
  const firestore = isFirebaseConfigured && Boolean(db)
  const [data, setData] = useState(() => (firestore ? buildDefaultData() : loadLocalData()))
  const [loading, setLoading] = useState(firestore)
  const [error, setError] = useState(null)

  /* Persist local content */
  useEffect(() => {
    if (firestore) return
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
    } catch {
      /* ignore quota errors */
    }
  }, [data, firestore])

  /* Initial cloud load */
  const refresh = useCallback(async () => {
    if (!firestore) return
    setLoading(true)
    setError(null)
    try {
      const snapshot = await Promise.all(
        COLLECTIONS.map((name) => getDocs(collection(db, name)))
      )
      const next = {}
      COLLECTIONS.forEach((name, index) => {
        next[name] = snapshot[index].docs.map((item) => ({ id: item.id, ...item.data() }))
      })
      const [profileSnap, settingsSnap] = await Promise.all([
        getDoc(doc(db, SINGLE_DOCS.profile, 'main')),
        getDoc(doc(db, SINGLE_DOCS.settings, 'main')),
      ])
      const defaults = buildDefaultData()
      next.profile = replaceLegacyIdentity(
        profileSnap.exists() ? { ...defaults.profile, ...profileSnap.data() } : defaults.profile
      )
      next.profile.avatar = '/deepak-raj.jpg'
      next.profile.email = '2500030575@kluniversity.in'
      next.profile.socials = {
        ...(next.profile.socials || {}),
        github: 'https://github.com/dashboard',
        linkedin: 'https://www.linkedin.com/feed/',
        twitter: 'https://x.com/home?lang=en',
      }
      next.settings = replaceLegacyIdentity(
        settingsSnap.exists() ? { ...defaults.settings, ...settingsSnap.data() } : defaults.settings
      )
      next.settings.contactEmail = '2500030575@kluniversity.in'
      next.settings.socials = {
        ...(next.settings.socials || {}),
        github: 'https://github.com/dashboard',
        linkedin: 'https://www.linkedin.com/feed/',
        twitter: 'https://x.com/home?lang=en',
      }
      next.users = []
      setData((current) => ({ ...current, ...next }))
    } catch (err) {
      console.error('[Data] Load failed:', err)
      setError(
        'Could not load content from Firestore. Check your Firebase configuration and security rules.'
      )
    } finally {
      setLoading(false)
    }
  }, [firestore])

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------------- generic collection CRUD ---------------- */
  const mutate = async (name, action) => {
    // Local mode: state is updated directly by the callers below.
    if (!firestore) return null

    const target = collection(db, name)
    if (action.type === 'add') {
      // Firestore rejects `undefined` values — strip the client id entirely.
      const { id: _clientGeneratedId, ...payload } = action.payload
      const created = await addDoc(target, payload)
      return { ...payload, id: created.id }
    }
    if (action.type === 'update') {
      const { id, patch } = action
      const { id: _ignored, ...clean } = patch
      await setDoc(doc(db, name, id), clean, { merge: true })
      return null
    }
    if (action.type === 'delete') {
      await deleteDoc(doc(db, name, action.id))
      return null
    }
    return null
  }

  const createItem = useCallback(
    async (name, item) => {
      const record = { ...item, id: item.id || uid(name), createdAt: new Date().toISOString() }
      await mutate(name, { type: 'add', payload: record })
      const withId = firestore ? record : record
      setData((current) => ({ ...current, [name]: [record, ...(current[name] || [])] }))
      if (firestore) await refresh()
      return withId
    },
    [firestore, refresh]
  )

  const updateItem = useCallback(
    async (name, id, patch) => {
      await mutate(name, { type: 'update', id, patch })
      setData((current) => ({
        ...current,
        [name]: (current[name] || []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }))
      if (firestore) await refresh()
    },
    [firestore, refresh]
  )

  const deleteItem = useCallback(
    async (name, id) => {
      await mutate(name, { type: 'delete', id })
      setData((current) => ({
        ...current,
        [name]: (current[name] || []).filter((item) => item.id !== id),
      }))
      if (firestore) await refresh()
    },
    [firestore, refresh]
  )

  /* ---------------- single documents ---------------- */
  const saveProfile = useCallback(
    async (patch) => {
      setData((current) => ({ ...current, profile: { ...current.profile, ...patch } }))
      if (firestore) {
        await setDoc(doc(db, SINGLE_DOCS.profile, 'main'), patch, { merge: true })
        await refresh()
      }
    },
    [firestore, refresh]
  )

  const saveSettings = useCallback(
    async (patch) => {
      setData((current) => ({ ...current, settings: { ...current.settings, ...patch } }))
      if (firestore) {
        await setDoc(doc(db, SINGLE_DOCS.settings, 'main'), patch, { merge: true })
        await refresh()
      }
    },
    [firestore, refresh]
  )

  /* ---------------- messages ---------------- */
  const submitMessage = useCallback(
    async (message) => {
      const record = {
        ...message,
        id: uid('msg'),
        status: 'unread',
        createdAt: new Date().toISOString(),
      }
      if (firestore) {
        await addDoc(collection(db, 'messages'), {
          name: record.name,
          email: record.email,
          subject: record.subject,
          message: record.message,
          status: 'unread',
          createdAt: record.createdAt,
        })
        await refresh()
      } else {
        setData((current) => ({ ...current, messages: [record, ...current.messages] }))
      }
      return record
    },
    [firestore, refresh]
  )

  /* ---------------- image upload ---------------- */
  const uploadImage = useCallback(async (file, path = 'uploads') => {
    if (firestore && storage) {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      return getDownloadURL(snapshot.ref)
    }
    return readFileAsDataURL(file)
  }, [firestore])

  /* ---------------- registered users (admin view) ---------------- */
  const loadUsers = useCallback(async () => {
    if (firestore) {
      try {
        const snapshot = await getDocs(collection(db, 'users'))
        const users = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        setData((current) => ({ ...current, users }))
        return users
      } catch (err) {
        console.warn('[Data] Could not load users (check rules):', err)
        return []
      }
    }
    // Local demo mode: surface demo accounts so dashboard stats stay truthful.
    try {
      const demoUsers = JSON.parse(localStorage.getItem('portfolio_demo_users')) || []
      const safe = demoUsers.map(({ password, ...rest }) => rest)
      setData((current) => ({ ...current, users: safe }))
      return safe
    } catch {
      return []
    }
  }, [firestore])

  const deleteMessage = useCallback(
    (id) => deleteItem('messages', id),
    [deleteItem]
  )

  const markMessageRead = useCallback(
    async (id) => {
      await updateItem('messages', id, { status: 'read' })
    },
    [updateItem]
  )

  const resetLocalData = useCallback(() => {
    if (firestore) return
    const fresh = buildDefaultData()
    setData(fresh)
  }, [firestore])

  const value = useMemo(
    () => ({
      ...data,
      loading,
      error,
      mode: firestore ? 'firestore' : 'local',
      refresh,
      createItem,
      updateItem,
      deleteItem,
      saveProfile,
      saveSettings,
      submitMessage,
      uploadImage,
      loadUsers,
      deleteMessage,
      markMessageRead,
      resetLocalData,
    }),
    [
      data,
      loading,
      error,
      firestore,
      refresh,
      createItem,
      updateItem,
      deleteItem,
      saveProfile,
      saveSettings,
      submitMessage,
      uploadImage,
      loadUsers,
      deleteMessage,
      markMessageRead,
      resetLocalData,
    ]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
