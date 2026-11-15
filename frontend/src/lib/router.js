import { useEffect, useState } from 'react'

// Tiny hash router so we don't need react-router yet.
// Routes look like "#/range" or "#/profile". Swap for a real router later if needed.

export const ROUTES = {
  login: '/',
  range: '/range',
  profile: '/profile',
}

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '')
  return hash === '' ? '/' : hash
}

export function navigate(path) {
  window.location.hash = path
}

export function useHashRoute() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const onChange = () => setPath(currentPath())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return path
}
