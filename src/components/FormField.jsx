import { cls } from '../utils/helpers'

/** Labelled form input with inline error message. */
export default function FormField({
  label,
  error,
  as: Tag = 'input',
  className,
  hint,
  ...rest
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      <Tag
        className={cls('input-field', error && 'border-red-500 focus:border-red-500 focus:ring-red-500/25', className)}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-red-500">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-slate-400 dark:text-slate-500">{hint}</span>
      ) : null}
    </label>
  )
}
