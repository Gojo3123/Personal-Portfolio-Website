import { Code as Github, ExternalLink, ShoppingCart, Check, Tag, Folder } from 'lucide-react'
import Modal from './Modal.jsx'
import { useCart } from '../context/CartContext.jsx'

/** Full project details dialog opened from "View Details". */
export default function ProjectDetailModal({ project, onClose }) {
  const { addToCart, removeFromCart, isInCart } = useCart()
  if (!project) return null
  const saved = isInCart(project.id)

  return (
    <Modal open={Boolean(project)} onClose={onClose} title={project.name} size="lg">
      <div className="space-y-5">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-purple-950">
          {project.image ? (
            <img
              src={project.image}
              alt={project.name}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="gradient-text text-6xl font-black opacity-40">
                {project.name?.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">
            <Folder className="h-3 w-3" /> {project.category || 'Project'}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-300">
              ⭐ Featured
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {project.description}
        </p>

        {project.tech?.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
              <Tag className="h-4 w-4 text-purple-500" /> Technology Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => (saved ? removeFromCart(project.id) : addToCart(project))}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              saved
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'gradient-bg-hover text-white shadow-lg'
            }`}
          >
            {saved ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            {saved ? 'Saved to Cart' : 'Add to Cart'}
          </button>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-white/15 dark:text-slate-200"
            >
              <Github className="h-4 w-4" /> Source Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-white/15 dark:text-slate-200"
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </Modal>
  )
}
