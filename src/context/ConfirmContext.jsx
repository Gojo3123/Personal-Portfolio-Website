import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

const ConfirmContext = createContext(null)

/**
 * Promise-based confirmation dialogs, e.g.
 *   const confirm = useConfirm()
 *   if (await confirm({ title: 'Delete?', message: '...' })) { ... }
 */
export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null)
  const resolverRef = useRef(null)

  const confirm = useCallback((options = {}) => {
    const config = {
      title: options.title || 'Are you sure?',
      message: options.message || 'This action cannot be undone.',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      danger: options.danger !== false,
    }
    setDialog(config)
    return new Promise((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const close = useCallback((result) => {
    setDialog(null)
    if (resolverRef.current) {
      resolverRef.current(result)
      resolverRef.current = null
    }
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => close(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-fade-up dark:border-white/10 dark:bg-navy-900">
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                dialog.danger ? 'bg-red-500/15 text-red-500' : 'bg-purple-500/15 text-purple-500'
              }`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3
              id="confirm-title"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {dialog.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {dialog.message}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                {dialog.cancelText}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => close(true)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition ${
                  dialog.danger
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    : 'gradient-bg-hover'
                }`}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) throw new Error('useConfirm must be used within ConfirmProvider')
  return context
}
