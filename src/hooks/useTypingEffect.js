import { useEffect, useState } from 'react'

/**
 * Animated typing effect for the hero section.
 * Types, pauses, deletes, and cycles through the given phrases.
 */
export default function useTypingEffect(words = [], { typeSpeed = 85, deleteSpeed = 45, pause = 1800 } = {}) {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!words.length) return undefined
    const word = words[index % words.length]
    let timeout

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((current) => (current + 1) % words.length)
    } else {
      timeout = setTimeout(
        () => {
          setText((current) =>
            deleting ? word.slice(0, current.length - 1) : word.slice(0, current.length + 1)
          )
        },
        deleting ? deleteSpeed : typeSpeed
      )
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause])

  return text
}
