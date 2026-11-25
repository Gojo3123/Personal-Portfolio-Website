import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Download,
  Code as Github,
  Users as Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Award,
  GraduationCap,
  BadgeCheck,
  Send,
  Trophy,
  Users,
  Code,
} from 'lucide-react'
import Container from '../components/Container.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import Button from '../components/Button.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import ProjectDetailModal from '../components/ProjectDetailModal.jsx'
import Avatar from '../components/Avatar.jsx'
import { SkeletonGrid, SkeletonText } from '../components/Skeletons.jsx'
import EmptyState from '../components/EmptyState.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import useTypingEffect from '../hooks/useTypingEffect.js'
import { useData } from '../context/DataContext.jsx'
import { downloadTextResume, formatDate } from '../utils/helpers'

const iconMap = { Trophy, Users, Code, Github, Award, Sparkles }

export default function Home() {
  usePageTitle('Home', 'Personal developer portfolio — projects, skills and contact.')
  const { profile, skills, projects, education, certificates, achievements, loading, settings } = useData()
  const [selected, setSelected] = useState(null)

  const typed = useTypingEffect(profile?.titles?.length ? profile.titles : ['Full-Stack Developer'])

  const featured = (projects || []).filter((item) => item.featured).slice(0, 3)
  const topSkills = (skills || []).slice(0, 8)

  const handleResume = () => {
    if (profile?.resumeUrl) window.open(profile.resumeUrl, '_blank', 'noopener')
    else downloadTextResume(profile || {})
  }

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-20">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-purple-600/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-500/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.35] dark:opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)',
            }}
          />
        </div>

        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div className="animate-fade-up text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-600 dark:text-purple-300">
                <Sparkles className="h-3.5 w-3.5" /> Available for new opportunities
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Hi, I&apos;m <span className="gradient-text">{profile?.name || 'Developer'}</span>
              </h1>

              <p className="mt-4 text-xl font-semibold text-slate-700 sm:text-2xl dark:text-slate-200">
                {typed}
                <span className="ml-1 inline-block h-[1.1em] w-[3px] animate-pulse bg-purple-500 align-middle" />
              </p>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400 lg:mx-0">
                {profile?.intro}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400 lg:justify-start">
                {profile?.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-purple-500" /> {profile.location}
                  </span>
                )}
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1.5 transition hover:text-purple-500"
                  >
                    <Mail className="h-4 w-4 text-purple-500" /> {profile.email}
                  </a>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button size="lg" onClick={handleResume} icon={Download}>
                  Download Resume
                </Button>
                <Button size="lg" variant="secondary" to="/projects" icon={ArrowRight}>
                  View Projects
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
                {[
                  { href: profile?.socials?.github, icon: Github, label: 'GitHub' },
                  { href: profile?.socials?.linkedin, icon: Linkedin, label: 'LinkedIn' },
                  { href: profile?.email ? `mailto:${profile.email}` : undefined, icon: Mail, label: 'Email' },
                ]
                  .filter((item) => item.href)
                  .map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer noopener"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:-translate-y-1 hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-slate-400 dark:hover:text-purple-300"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
              </div>
            </div>

            {/* Avatar card */}
            <div className="relative mx-auto w-full max-w-sm animate-fade-up lg:max-w-none" style={{ animationDelay: '150ms' }}>
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-500/25 via-purple-500/25 to-pink-500/25 blur-2xl" />
              <div className="glass relative rounded-3xl p-6 shadow-2xl">
                <div className="animate-float">
                  <Avatar
                    src={profile?.avatar}
                    name={profile?.name}
                    size="xl"
                    className="mx-auto block w-28 ring-4 ring-purple-500/30 sm:w-36"
                  />
                </div>
                <div className="mt-5 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{profile?.name}</p>
                  <p className="gradient-text text-sm font-semibold">{profile?.title}</p>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Projects', value: projects?.length ?? 0 },
                    { label: 'Skills', value: skills?.length ?? 0 },
                    { label: 'Certificates', value: certificates?.length ?? 0 },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white/70 py-3 dark:bg-white/5">
                      <p className="text-xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <a
                  href={`mailto:${profile?.email || ''}`}
                  className="gradient-bg mt-5 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:opacity-90"
                >
                  <Send className="h-4 w-4" /> Let&apos;s work together
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================= ABOUT SNIPPET ================= */}
      <section className="section-pad bg-white/50 dark:bg-navy-900/40">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                center={false}
                eyebrow="About Me"
                title="Passionate about building things that matter"
              />
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                {profile?.about?.introduction?.slice(0, 260) || profile?.intro}
                {profile?.about?.introduction?.length > 260 ? '…' : ''}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/about" variant="secondary" icon={ArrowRight}>
                  More about me
                </Button>
                <Button to="/contact">Get in touch</Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: GraduationCap, title: 'Education', text: education?.[0]?.degree || 'Computer Science', to: '/education' },
                { icon: BadgeCheck, title: 'Certifications', text: `${certificates?.length || 0} professional certificates`, to: '/certificates' },
                { icon: Award, title: 'Achievements', text: `${achievements?.length || 0} milestone achievements`, to: '/about' },
                { icon: Sparkles, title: 'Interests', text: profile?.about?.interests?.slice(0, 60) || 'Web, AI & design', to: '/about' },
              ].map(({ icon: Icon, title, text, to }, index) => (
                <Link
                  key={title}
                  to={to}
                  className="card card-hover group p-5"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <span className="gradient-bg flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg shadow-purple-500/20 transition group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ================= SKILLS ================= */}
      <section className="section-pad">
        <Container>
          <SectionHeading
            eyebrow="Technical Skills"
            title="Technologies I work with"
            subtitle="A snapshot of the tools and technologies I use every day to design, build and ship products."
          />
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-24" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {topSkills.map((skill) => (
                <div key={skill.id} className="card card-hover p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white">{skill.name}</h3>
                    <span className="text-xs font-bold text-purple-500">{skill.level}%</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{skill.category}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="gradient-bg h-full rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Button to="/skills" variant="secondary" icon={ArrowRight}>
              View all skills
            </Button>
          </div>
        </Container>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section className="section-pad bg-white/50 dark:bg-navy-900/40">
        <Container>
          <SectionHeading
            eyebrow="Featured Work"
            title="Projects I'm proud of"
            subtitle="Selected builds that showcase my approach to clean architecture, delightful UI and reliable engineering."
          />
          {loading ? (
            <SkeletonGrid count={3} />
          ) : featured.length === 0 ? (
            <EmptyState
              title="No featured projects yet"
              description="Featured projects will appear here once they are marked in the admin dashboard."
              actionLabel="Browse all projects"
              actionTo="/projects"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} onView={setSelected} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Button to="/projects" icon={ArrowRight}>
              Explore all projects
            </Button>
          </div>
        </Container>
      </section>

      {/* ================= EDUCATION + CERTIFICATES ================= */}
      <section className="section-pad">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading center={false} eyebrow="Education" title="My academic journey" />
              {loading ? (
                <SkeletonText lines={6} />
              ) : (
                <div className="space-y-5">
                  {(education || []).slice(0, 2).map((item) => (
                    <div key={item.id} className="card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-slate-900 dark:text-white">{item.degree}</h3>
                        <span className="chip shrink-0">{item.period}</span>
                      </div>
                      <p className="mt-1.5 text-sm font-medium text-purple-500">{item.institution}</p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <Button to="/education" variant="secondary" size="sm" icon={ArrowRight}>
                  Full education
                </Button>
              </div>
            </div>

            <div>
              <SectionHeading center={false} eyebrow="Certifications" title="Verified credentials" />
              {loading ? (
                <SkeletonText lines={6} />
              ) : (
                <div className="space-y-4">
                  {(certificates || []).slice(0, 3).map((cert) => (
                    <div key={cert.id} className="card flex items-center gap-4 p-4">
                      <span className="gradient-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg">
                        <BadgeCheck className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-bold text-slate-900 dark:text-white">{cert.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {cert.issuer} · {formatDate(cert.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <Button to="/certificates" variant="secondary" size="sm" icon={ArrowRight}>
                  All certificates
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================= ACHIEVEMENTS ================= */}
      <section className="section-pad bg-white/50 dark:bg-navy-900/40">
        <Container>
          <SectionHeading
            eyebrow="Achievements"
            title="Milestones along the way"
            subtitle="Recognition and moments that shaped my journey as a developer."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(achievements || []).map((item) => {
              const Icon = iconMap[item.icon] || Trophy
              return (
                <div key={item.id} className="card card-hover p-6 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-purple-500 dark:text-purple-400">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wider text-purple-500">
                    {item.year}
                  </span>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ================= CONTACT CTA ================= */}
      <section className="section-pad">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-6 py-14 text-center shadow-2xl shadow-purple-500/20 sm:px-12">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Have a project in mind?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/85">
                I&apos;m currently open to freelance projects and full-time roles. Let&apos;s build
                something great together — {settings?.contactEmail || profile?.email}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={`mailto:${settings?.contactEmail || profile?.email}`}
                  className="rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-purple-700 shadow-xl transition hover:scale-105"
                >
                  Email Me
                </a>
                <Link
                  to="/contact"
                  className="rounded-xl border border-white/40 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Contact Form
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
    </main>
  )
}
