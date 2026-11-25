import { useState } from 'react'
import { Code as Github, ExternalLink, ShoppingCart, Check, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { cls, truncate } from '../utils/helpers'

/** Portfolio project card with save-to-cart and detail actions. */
export default function ProjectCard({ project, onView, index = 0 }) {
  const { addToCart, removeFromCart, isInCart } = useCart()
  const [imageFailed, setImageFailed] = useState(false)
  const saved = isInCart(project.id)

  const handleCart = (event) => {
    event.stopPropagation()
    if (saved) removeFromCart(project.id)
    else addToCart(project)
  }

  return (
    <article
      className="card card-hover group flex h-full flex-col overflow-hidden animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-purple-950">
        {project.image && !imageFailed ? (
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="gradient-text text-5xl font-black opacity-40">
              {project.name?.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent" />

        {project.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-950 shadow-lg">
            Featured
          </span>
        )}

        <button
          type="button"
          onClick={handleCart}
          aria-label={saved ? `Remove ${project.name} from saved` : `Save ${project.name} to cart`}
          className={cls(
            'absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition-all',
            saved
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/40'
              : 'bg-white/15 text-white hover:bg-white/30'
          )}
        >
          {saved ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="chip">{project.category || 'Project'}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-300">
          {project.name}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {truncate(project.description || '', 130)}
        </p>

        {project.tech?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 dark:bg-white/5 dark:text-slate-400"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-white/5 dark:text-slate-500">
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
          <button
            type="button"
            onClick={() => onView?.(project)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 transition hover:text-purple-500 dark:text-purple-400"
          >
            <Eye className="h-4 w-4" /> View Details
          </button>
          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub repository"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Live demo"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
