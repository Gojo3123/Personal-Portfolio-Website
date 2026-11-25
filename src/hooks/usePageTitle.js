import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Sets document title + meta description for SEO-friendly pages. */
export default function usePageTitle(title, description) {
  const location = useLocation()

  useEffect(() => {
    const siteName = 'Deepak Raj'
    document.title = title ? `${title} · ${siteName}` : `${siteName} — Developer Portfolio`

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    if (description) meta.setAttribute('content', description)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', window.location.origin + location.pathname)
  }, [title, description, location.pathname])
}
