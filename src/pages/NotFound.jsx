import { Link } from 'react-router-dom'
import { Home, Search, Compass } from 'lucide-react'
import Container from '../components/Container.jsx'
import usePageTitle from '../hooks/usePageTitle.js'

export default function NotFound() {
  usePageTitle('404 — Page not found', 'The page you are looking for does not exist.')

  return (
    <main className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <Container>
        <p className="gradient-text animate-fade-up text-[7rem] font-black leading-none sm:text-[10rem]">
          404
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          This page drifted off into space
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get
          you back on track.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="gradient-bg inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:scale-105"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
          >
            <Search className="h-4 w-4" /> Browse Projects
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
          >
            <Compass className="h-4 w-4" /> Contact
          </Link>
        </div>
      </Container>
    </main>
  )
}
