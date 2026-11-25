/** Lightweight form validation helpers (no external deps). */

export function validateEmail(value = '') {
  const email = value.trim()
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Enter a valid email address'
  return ''
}

export function validatePassword(value = '') {
  if (!value) return 'Password is required'
  if (value.length < 6) return 'Password must be at least 6 characters'
  return ''
}

export function validateSignup(form = {}) {
  const errors = {}
  if (!form.fullName?.trim()) errors.fullName = 'Full name is required'
  else if (form.fullName.trim().length < 2) errors.fullName = 'Name is too short'

  const emailError = validateEmail(form.email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(form.password)
  if (passwordError) errors.password = passwordError
  else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
    errors.password = 'Include at least one letter and one number'
  }

  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password'
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match'

  return errors
}

export function validateLogin(form = {}) {
  const errors = {}
  const emailError = validateEmail(form.email)
  if (emailError) errors.email = emailError
  const passwordError = validatePassword(form.password)
  if (passwordError) errors.password = passwordError
  return errors
}

export function validateContact(form = {}) {
  const errors = {}
  if (!form.name?.trim()) errors.name = 'Name is required'
  const emailError = validateEmail(form.email)
  if (emailError) errors.email = emailError
  if (!form.subject?.trim()) errors.subject = 'Subject is required'
  if (!form.message?.trim()) errors.message = 'Message is required'
  else if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters'
  return errors
}

export function validateRequired(value, label = 'This field') {
  if (!value || !String(value).trim()) return `${label} is required`
  return ''
}
