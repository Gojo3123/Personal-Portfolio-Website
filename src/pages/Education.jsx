import { GraduationCap, CalendarDays, Building2, Award } from 'lucide-react'
import Container from '../components/Container.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SkeletonText } from '../components/Skeletons.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { useData } from '../context/DataContext.jsx'

export default function Education() {
  usePageTitle('Education', 'Academic background, degrees and coursework.')
  const { education, loading } = useData()

  return (
    <main className="pb-20">
      <section className="relative overflow-hidden pb-4 pt-14">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/3 -top-16 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />
        </div>
        <Container>
          <SectionHeading
            eyebrow="Education"
            title="My academic journey"
            subtitle="Degrees, coursework and learning milestones that built my foundation in computer science."
          />

          {loading ? (
            <div className="mx-auto max-w-3xl space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card p-6">
                  <SkeletonText lines={4} />
                </div>
              ))}
            </div>
          ) : !education?.length ? (
            <EmptyState
              icon={GraduationCap}
              title="No education entries yet"
              description="Education records added from the admin dashboard will appear here."
            />
          ) : (
            <div className="relative mx-auto max-w-3xl">
              {/* Timeline line */}
              <div className="absolute left-[22px] top-2 bottom-2 hidden w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30 sm:block" />

              <div className="space-y-8">
                {education.map((item, index) => (
                  <article key={item.id} className="relative animate-fade-up" style={{ animationDelay: `${index * 90}ms` }}>
                    {/* Timeline dot */}
                    <span className="absolute left-0 top-6 hidden h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 sm:flex">
                      <GraduationCap className="h-5 w-5" />
                    </span>

                    <div className="card card-hover p-6 sm:ml-16">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {item.degree}
                          </h2>
                          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-purple-500">
                            <Building2 className="h-4 w-4" /> {item.institution}
                          </p>
                        </div>
                        <span className="chip">
                          <CalendarDays className="h-3 w-3" /> {item.period}
                        </span>
                      </div>

                      {item.grade && (
                        <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                          <Award className="h-3.5 w-3.5" /> {item.grade}
                        </p>
                      )}

                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}
