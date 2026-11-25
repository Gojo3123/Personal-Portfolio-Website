import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cls } from '../utils/helpers'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-300',
  error: 'border-red-500/40 text-red-600 dark:text-red-300',
  info: 'border-blue-500/40 text-blue-600 dark:text-blue-300',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'info') => {
      const id = ++idRef.current
      setToasts((current) => [...current, { id, message, type }])
      window.setTimeout(() => dismiss(id), 4000)
      return id
    },
    [dismiss]
  )

  const toast = {
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    info: (message) => showToast(message, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-20 z-[120] flex w-[min(92vw,24rem)] flex-col gap-3 sm:top-24"
      >
        {toasts.map((item) => {
          const Icon = icons[item.type] || Info
          return (
            <div
              key={item.id}
              role="status"
              className={cls(
                'pointer-events-auto flex items-start gap-3 rounded-xl border bg-white/95 p-4 shadow-2xl backdrop-blur animate-slide-in dark:bg-navy-800/95',
                styles[item.type]
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-100">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
