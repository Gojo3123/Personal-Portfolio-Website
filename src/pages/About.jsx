import {
  Target,
  Compass,
  Sparkles,
  Trophy,
  Flag,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Download,
} from 'lucide-react'
import Container from '../components/Container.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import Button from '../components/Button.jsx'
import Avatar from '../components/Avatar.jsx'
import { SkeletonText } from '../components/Skeletons.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { useData } from '../context/DataContext.jsx'
import { downloadTextResume } from '../utils/helpers'

const blocks = [
  { key: 'introduction', icon: Sparkles, title: 'Personal Introduction' },
  { key: 'education', icon: GraduationCap, title: 'Education Background' },
  { key: 'objectives', icon: Target, title: 'Career Objectives' },
  { key: 'interests', icon: Compass, title: 'Technical Interests' },
  { key: 'achievements', icon: Trophy, title: 'Personal Achievements' },
  { key: 'goals', icon: Flag, title: 'Professional Goals' },
]

export default function About() {
  usePageTitle('About', 'Learn about my background, objectives, interests and goals.')
  const { profile, loading } = useData()
  const about = profile?.about || {}

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden pb-10 pt-14">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        </div>
        <Container>
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <Avatar
              src={profile?.avatar}
              name={profile?.name}
              size="xl"
              className="ring-4 ring-purple-500/30"
            />
            <div>
              <span className="chip">About Me</span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                {profile?.name}
              </h1>
              <p className="gradient-text mt-2 text-lg font-semibold">{profile?.title}</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                {profile?.intro}
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                {profile?.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-purple-500" /> {profile.location}
                  </span>
                )}
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 hover:text-purple-500">
                    <Mail className="h-4 w-4 text-purple-500" /> {profile.email}
                  </a>
                )}
                {profile?.phone && (
                  <a href={`tel:${profile.phone}`} className="inline-flex items-center gap-1.5 hover:text-purple-500">
                    <Phone className="h-4 w-4 text-purple-500" /> {profile.phone}
                  </a>
                )}
              </div>
              <div className="mt-6">
                <Button
                  icon={Download}
                  onClick={() =>
                    profile?.resumeUrl
                      ? window.open(profile.resumeUrl, '_blank', 'noopener')
                      : downloadTextResume(profile || {})
                  }
                >
                  Download Resume
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Content blocks */}
      <section className="pt-6">
        <Container>
          <SectionHeading
            eyebrow="My Story"
            title="Everything you need to know about me"
            subtitle="All of this content is editable from the Admin Dashboard."
          />
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-6">
                  <SkeletonText lines={4} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blocks.map(({ key, icon: Icon, title }, index) => (
                <article
                  key={key}
                  className="card card-hover flex flex-col p-6 animate-fade-up"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <span className="gradient-bg flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg shadow-purple-500/20">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {about[key] || 'Coming soon.'}
                  </p>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}
