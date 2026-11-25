import { useMemo, useState } from 'react'
import { Search, FolderKanban, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import ProjectDetailModal from '../components/ProjectDetailModal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonGrid } from '../components/Skeletons.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { useData } from '../context/DataContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { cls } from '../utils/helpers'

export default function Projects() {
  usePageTitle('Projects', 'Showcase of web apps, e-commerce builds and AI/ML projects.')
  const { projects, loading } = useData()
  const { count } = useCart()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)

  const categories = useMemo(
    () => ['All', ...Array.from(new Set((projects || []).map((p) => p.category).filter(Boolean)))],
    [projects]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (projects || []).filter((project) => {
      const matchesCategory = category === 'All' || project.category === category
      const matchesQuery =
        !q ||
        project.name?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        (project.tech || []).some((tech) => tech.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [projects, query, category])

  return (
    <main className="pb-20">
      <section className="relative overflow-hidden pb-4 pt-14">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
          <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl" />
        </div>
        <Container>
          <SectionHeading
            eyebrow="Projects"
            title="Things I've built"
            subtitle="Search and filter my work, then save favourites to your cart — a bookmark list that persists across visits."
          />

          {/* Toolbar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4.5 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, description or technology…"
                className="input-field !pl-11"
                aria-label="Search projects"
              />
            </div>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <ShoppingCart className="h-4 w-4" /> Cart
              {count > 0 && (
                <span className="gradient-bg rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>

          {/* Category chips */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cls(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  category === item
                    ? 'gradient-bg text-white shadow-lg shadow-purple-500/25'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                )}
              >
                {item}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects found"
              description={
                query || category !== 'All'
                  ? 'Try a different search term or category filter.'
                  : 'Projects added by the admin will appear here.'
              }
              actionLabel={query || category !== 'All' ? 'Clear filters' : undefined}
              onAction={() => {
                setQuery('')
                setCategory('All')
              }}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} onView={setSelected} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
    </main>
  )
}
