import { BadgeCheck, ExternalLink, Calendar, Building } from 'lucide-react'
import Container from '../components/Container.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import EmptyState from '../components/EmptyState.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { useData } from '../context/DataContext.jsx'
import { formatDate } from '../utils/helpers'

export default function Certificates() {
  usePageTitle('Certificates', 'Professional certifications and course completions.')
  const { certificates, loading } = useData()

  return (
    <main className="pb-20">
      <section className="relative overflow-hidden pb-4 pt-14">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl" />
        </div>
        <Container>
          <SectionHeading
            eyebrow="Certifications"
            title="Verified credentials"
            subtitle="Industry certifications that validate my skills across cloud, data and front-end engineering."
          />

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-48" />
              ))}
            </div>
          ) : !certificates?.length ? (
            <EmptyState
              icon={BadgeCheck}
              title="No certificates yet"
              description="Certificates added from the admin dashboard will appear here."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert, index) => (
                <article
                  key={cert.id}
                  className="card card-hover group relative overflow-hidden p-6 animate-fade-up"
                  style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition group-hover:scale-150" />
                  <div className="relative">
                    <span className="gradient-bg flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-purple-500/25">
                      <BadgeCheck className="h-7 w-7" />
                    </span>

                    <h2 className="mt-4 text-base font-bold leading-snug text-slate-900 dark:text-white">
                      {cert.name}
                    </h2>

                    <div className="mt-3 space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <p className="flex items-center gap-2">
                        <Building className="h-3.5 w-3.5 text-purple-500" /> {cert.issuer}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-purple-500" /> {formatDate(cert.date)}
                      </p>
                    </div>

                    {cert.credentialId && (
                      <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                        ID: {cert.credentialId}
                      </p>
                    )}

                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 transition hover:text-purple-500 dark:text-purple-400"
                      >
                        View credential <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}
