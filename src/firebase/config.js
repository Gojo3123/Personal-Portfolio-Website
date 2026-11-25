import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

/**
 * Firebase is configured entirely through environment variables.
 * Copy `.env.example` to `.env` and fill in your Firebase project credentials.
 * NEVER hardcode or commit real credentials in this file.
 */
const env = import.meta.env

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
)

/** Lowercase emails that are granted the admin role (enforced by firestore.rules). */
export const adminEmails = (env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

let app = null
let auth = null
let db = null
let storage = null

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (error) {
    console.error('[Firebase] Initialization failed:', error)
  }
}

export { app, auth, db, storage }

export const FIREBASE_SETUP_MESSAGE =
  'Firebase is not configured yet. Copy .env.example to .env, add your Firebase credentials, and restart the dev server. Until then the site runs in local demo mode.'
