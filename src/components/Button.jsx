import { Link } from 'react-router-dom'
import { cls } from '../utils/helpers'

const variants = {
  primary:
    'text-white shadow-lg shadow-purple-500/25 gradient-bg-hover hover:shadow-glow',
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:border-purple-400 hover:text-purple-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-purple-400/50 dark:hover:text-white',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-red-700',
}

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

/** Reusable button that renders <button>, <Link> or <a> depending on props. */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className,
  type = 'button',
  disabled,
  loading,
  onClick,
  icon: Icon,
  ...rest
}) {
  const classes = cls(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className
  )

  const content = (
    <>
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {!loading && Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer noopener' : undefined}
        onClick={onClick}
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} onClick={onClick} {...rest}>
      {content}
    </button>
  )
}
