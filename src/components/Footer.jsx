import { Link } from 'react-router-dom'
import { Code as Github, Users as Linkedin, Send as Twitter, Mail, ArrowUp, Heart } from 'lucide-react'
import Container from './Container.jsx'
import { Logo } from './Avatar.jsx'
import { useData } from '../context/DataContext.jsx'

const quickLinks = [
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/education', label: 'Education' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const { settings, profile } = useData()
  const socials = settings?.socials || {}
  const year = new Date().getFullYear()

  const socialLinks = [
    socials.github && { href: socials.github, icon: Github, label: 'GitHub' },
    socials.linkedin && { href: socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
    socials.twitter && { href: socials.twitter, icon: Twitter, label: 'Twitter' },
  ].filter(Boolean)

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white dark:border-white/5 dark:bg-navy-900/60">
      <div className="pointer-events-none absolute -top-24 left-1/4 h-48 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      <Container className="relative py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo name={settings?.siteName || 'Portfolio'} />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {settings?.footerText ||
                'Crafting premium web experiences with modern technologies.'}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:-translate-y-1 hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-slate-400 dark:hover:text-purple-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:-translate-y-1 hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-slate-400 dark:hover:text-purple-300"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-600 transition hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              {settings?.contactEmail && (
                <li>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="transition hover:text-purple-600 dark:hover:text-purple-300"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {profile?.location && <li>{profile.location}</li>}
              <li>
                <Link
                  to="/login"
                  className="transition hover:text-purple-600 dark:hover:text-purple-300"
                >
                  Account &amp; Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-white/5 sm:flex-row">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {year} {settings?.siteName || 'Portfolio'}. Made with{' '}
            <Heart className="inline h-3.5 w-3.5 fill-red-500 text-red-500" /> React &amp; Tailwind CSS.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-slate-400 dark:hover:text-purple-300"
          >
            <ArrowUp className="h-3.5 w-3.5" /> Back to Top
          </button>
        </div>
      </Container>
    </footer>
  )
}
