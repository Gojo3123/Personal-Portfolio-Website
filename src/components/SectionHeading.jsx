import { cls } from '../utils/helpers'

/** Consistent section heading with eyebrow label, title and subtitle. */
export default function SectionHeading({ eyebrow, title, subtitle, center = true, className }) {
  return (
    <div className={cls('mb-10 max-w-2xl sm:mb-12', center && 'mx-auto text-center', className)}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-500 dark:text-purple-300">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  )
}
