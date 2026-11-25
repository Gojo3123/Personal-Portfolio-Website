import { Link } from 'react-router-dom'
import { cls, initials } from '../utils/helpers'

/**
 * Avatar with graceful fallback: if the remote image fails to load
 * (offline preview, typo in URL) we show styled initials instead.
 */
export default function Avatar({ src, name = '', className, size = 'md' }) {
  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-28 w-28 sm:h-36 sm:w-36 text-4xl',
  }

  const handleError = (event) => {
    event.currentTarget.style.display = 'none'
    const fallback = event.currentTarget.nextElementSibling
    if (fallback) fallback.style.display = 'flex'
  }

  return (
    <span className={cls('relative inline-flex shrink-0 overflow-hidden rounded-full', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          onError={handleError}
          className="h-full w-full object-cover"
        />
      ) : null}
      <span
        style={{ display: src ? 'none' : 'flex' }}
        className={cls(
          'h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 font-bold text-white',
          sizes[size]
        )}
      >
        {initials(name)}
      </span>
    </span>
  )
}

export function Logo({ name = 'Portfolio', to = '/' }) {
  return (
    <Link to={to} className="group flex items-center gap-2.5" aria-label="Home">
      <span className="gradient-bg flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-white shadow-lg shadow-purple-500/25 transition group-hover:rotate-6">
        {initials(name)}
      </span>
      <span className="hidden text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:block">
        {name.split(' ')[0]}
        <span className="gradient-text">.</span>
      </span>
    </Link>
  )
}
