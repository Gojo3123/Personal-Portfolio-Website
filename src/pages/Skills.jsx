import { useState } from 'react'
import { Code2, Layers, Server, Database, Brain, Wrench } from 'lucide-react'
import Container from '../components/Container.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import EmptyState from '../components/EmptyState.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { useData } from '../context/DataContext.jsx'
import { cls } from '../utils/helpers'

const categoryMeta = {
  'Programming Languages': { icon: Code2, color: 'from-blue-500/15 to-blue-600/15 text-blue-500' },
  'Frontend Development': { icon: Layers, color: 'from-purple-500/15 to-purple-600/15 text-purple-500' },
  'Backend Development': { icon: Server, color: 'from-emerald-500/15 to-emerald-600/15 text-emerald-500' },
  Database: { icon: Database, color: 'from-amber-500/15 to-amber-600/15 text-amber-500' },
  'AI / Machine Learning': { icon: Brain, color: 'from-pink-500/15 to-pink-600/15 text-pink-500' },
  'Developer Tools': { icon: Wrench, color: 'from-cyan-500/15 to-cyan-600/15 text-cyan-500' },
}

export default function Skills() {
  usePageTitle('Skills', 'Technical skills across frontend, backend, databases, AI/ML and developer tools.')
  const { skills, loading } = useData()
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set((skills || []).map((s) => s.category)))]
  const filtered =
    activeCategory === 'All' ? skills || [] : (skills || []).filter((s) => s.category === activeCategory)

  const grouped = filtered.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <main className="pb-20">
      <section className="relative overflow-hidden pb-10 pt-14">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />
          <div className="absolute right-1/4 top-16 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" />
        </div>
        <Container>
          <SectionHeading
            eyebrow="Skills"
            title="My technical toolkit"
            subtitle="Organised by category with proficiency levels. Admins can add, edit or remove skills from the dashboard."
          />

          {/* Category filter */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cls(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  activeCategory === category
                    ? 'gradient-bg text-white shadow-lg shadow-purple-500/25'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-44" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No skills in this category"
              description="Skills added from the admin dashboard will show up here."
              actionLabel="Contact admin"
              actionTo="/contact"
            />
          ) : (
            <div className="space-y-12">
              {Object.entries(grouped).map(([category, items]) => {
                const meta = categoryMeta[category] || categoryMeta['Developer Tools']
                const Icon = meta.icon
                return (
                  <div key={category}>
                    <div className="mb-5 flex items-center gap-3">
                      <span className={cls('flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br', meta.color)}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{category}</h2>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          {items.length} skill{items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((skill, index) => (
                        <div
                          key={skill.id}
                          className="card card-hover p-5 animate-fade-up"
                          style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-bold text-slate-900 dark:text-white">{skill.name}</h3>
                            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-500 dark:text-purple-300">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                            <div
                              className="gradient-bg h-full rounded-full shadow-[0_0_12px_rgba(139,92,246,0.5)] transition-all duration-1000"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-slate-400">
                            <span>Beginner</span>
                            <span>Expert</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}
