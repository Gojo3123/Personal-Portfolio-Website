import { Loader2 } from 'lucide-react'

/** Full-screen branded loading state. */
export default function FullScreenLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-purple-500/25 border-t-purple-500" />
        <Loader2 className="absolute inset-0 m-auto h-6 w-6 animate-pulse text-purple-400" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}
