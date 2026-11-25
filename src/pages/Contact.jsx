import { useState } from 'react'
import {
  Mail,
  MapPin,
  Send,
  Code as Github,
  Users as Linkedin,
  Send as Twitter,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react'
import Container from '../components/Container.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import FormField from '../components/FormField.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { validateContact } from '../utils/validators.js'

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  usePageTitle('Contact', 'Get in touch via the contact form, email or social links.')
  const { profile, settings, submitMessage } = useData()
  const toast = useToast()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateContact(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the highlighted fields')
      return
    }

    setSending(true)
    try {
      await submitMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      })
      setSent(true)
      setForm(initialForm)
      toast.success('Message sent successfully — I\'ll get back to you soon!')
    } catch (error) {
      toast.error(error?.message || 'Could not send your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const socials = settings?.socials || profile?.socials || {}

  return (
    <main className="pb-20">
      <section className="relative overflow-hidden pb-4 pt-14">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-10 top-0 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />
          <div className="absolute right-10 top-24 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" />
        </div>
        <Container>
          <SectionHeading
            eyebrow="Contact"
            title="Let's talk"
            subtitle="Have a project, question or opportunity? Fill out the form and it lands straight in my admin inbox."
          />

          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            {/* Info column */}
            <div className="space-y-5">
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact information</h3>
                <div className="mt-5 space-y-4 text-sm">
                  <a
                    href={`mailto:${settings?.contactEmail || profile?.email}`}
                    className="flex items-center gap-3 text-slate-600 transition hover:text-purple-600 dark:text-slate-400"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                      <Mail className="h-4 w-4" />
                    </span>
                    {settings?.contactEmail || profile?.email}
                  </a>
                  {profile?.location && (
                    <p className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                        <MapPin className="h-4 w-4" />
                      </span>
                      {profile.location}
                    </p>
                  )}
                  <p className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    Typical reply within 24 hours
                  </p>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Find me online</h3>
                <div className="mt-4 flex gap-3">
                  {[
                    { href: socials.github, icon: Github, label: 'GitHub' },
                    { href: socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
                    { href: socials.twitter, icon: Twitter, label: 'Twitter' },
                  ]
                    .filter((item) => item.href)
                    .map(({ href, icon: Icon, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={label}
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:-translate-y-1 hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-slate-400 dark:hover:text-purple-300"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
                  Messages are stored securely in Firebase Firestore and visible only to the site
                  administrator.
                </p>
              </div>
            </div>

            {/* Form column */}
            <div className="card p-6 sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-up">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                    Message delivered!
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Thanks for reaching out. I&apos;ll review your message and reply as soon as
                    possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-slate-200"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Full Name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={setField('name')}
                      error={errors.name}
                      autoComplete="name"
                    />
                    <FormField
                      label="Email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={setField('email')}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>
                  <FormField
                    label="Subject"
                    placeholder="Project enquiry, collaboration…"
                    value={form.subject}
                    onChange={setField('subject')}
                    error={errors.subject}
                  />
                  <FormField
                    as="textarea"
                    rows={6}
                    label="Message"
                    placeholder="Tell me more about what you need…"
                    value={form.message}
                    onChange={setField('message')}
                    error={errors.message}
                    className="resize-y"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="gradient-bg-hover flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
