/** Small shared helpers. */

export function cls(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function formatDate(value) {
  if (!value) return ''
  try {
    const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value
    if (Number.isNaN(date.getTime())) return String(value)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return String(value)
  }
}

export function formatTimeAgo(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(date)
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?'
}

export function truncate(text = '', max = 120) {
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}…`
}

/** Downloads a plain-text resume generated from the profile (used when no resume URL is set). */
export function downloadTextResume(profile) {
  const lines = [
    profile.name || 'Resume',
    profile.title || '',
    '',
    `Email: ${profile.email || '-'}`,
    `Phone: ${profile.phone || '-'}`,
    `Location: ${profile.location || '-'}`,
    profile.socials?.github ? `GitHub: ${profile.socials.github}` : '',
    profile.socials?.linkedin ? `LinkedIn: ${profile.socials.linkedin}` : '',
    '',
    'ABOUT',
    profile.about?.introduction || profile.intro || '',
    '',
    'CAREER OBJECTIVES',
    profile.about?.objectives || '',
    '',
    'PROFESSIONAL GOALS',
    profile.about?.goals || '',
    '',
  ].filter((line) => line !== undefined)

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${(profile.name || 'resume').replace(/\s+/g, '_')}_Resume.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function readFileAsDataURL(file, maxSizeMB = 2) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file selected'))
    if (file.size > maxSizeMB * 1024 * 1024) {
      return reject(new Error(`Image must be smaller than ${maxSizeMB}MB`))
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read the file'))
    reader.readAsDataURL(file)
  })
}
