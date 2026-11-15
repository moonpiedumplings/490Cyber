import { readJSON, writeJSON } from './storage'

// SCRUM-105: placeholder user until the frontend can call the backend.
// Django's `home` view already returns { user, email } for the logged-in
// OIDC user — once CORS/proxying is set up, fetch that here instead.

const PROFILE_KEY = 'cyberrange.profile'

const MOCK_USER = {
  username: 'oidc:mock-user',
  email: 'student@example.com',
  displayName: 'Range Student',
  role: 'Student',
  joined: '2026-11-01',
}

export function getCurrentUser() {
  return { ...MOCK_USER, ...readJSON(PROFILE_KEY, {}) }
}

export function saveProfile(changes) {
  const next = { ...readJSON(PROFILE_KEY, {}), ...changes }
  writeJSON(PROFILE_KEY, next)
  return getCurrentUser()
}

export function initialsFor(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

// Same backend URL style as the login button on the login page.
export const LOGOUT_URL = 'http://localhost:8000/logout/'
