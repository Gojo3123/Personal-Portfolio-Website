import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/** Floating back-to-top button that appears after scrolling. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="gradient-bg fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-xl shadow-purple-500/30 transition hover:scale-110"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
