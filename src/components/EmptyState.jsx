import { Inbox } from 'lucide-react'
import Button from './Button.jsx'

/** Friendly empty state used across cart, projects, messages, etc. */
export default function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-purple-500 dark:text-purple-400">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {(actionLabel || actionTo) && (
        <div className="mt-6">
          <Button onClick={onAction} to={actionTo}>
            {actionLabel || 'Get started'}
          </Button>
        </div>
      )}
    </div>
  )
}
