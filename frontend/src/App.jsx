import { useEffect, useState } from 'react'
import './App.css'
import AppShell from './components/AppShell'
import { getCurrentUser, saveProfile } from './lib/currentUser'
import { ROUTES, navigate, useHashRoute } from './lib/router'
import SettingsProvider from './lib/SettingsProvider'
import MainPage from './pages/MainPage'
import ProfilePage from './pages/ProfilePage'

function LoginPage() {
  const handleLogin = () => {
    // Navigate the browser to Django's login route
    window.location.href = 'http://localhost:8000/login/'
  }

  return (
    <main className="login-page">
      <section className="login-content" aria-labelledby="login-title">
        <div className="brand-accent" aria-hidden="true"></div>

        <h1 className="login-title" id="login-title">
          CYBER <span>RANGE</span>
        </h1>

        <p className="login-description">
          Practice cybersecurity skills in a controlled environment.
        </p>

        <button className="oidc-button" type="button" onClick={handleLogin}>
          Sign in with OpenID Connect
        </button>
      </section>
    </main>
  )
}

// Routes (hash-based for now):
//   #/         login
//   #/range    main page (terraform editor, settings + profile buttons)
//   #/profile  profile page
function App() {
  const path = useHashRoute()
  const [user, setUser] = useState(getCurrentUser)
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    try {
      await fetch('/logout/', { credentials: 'include' })
    } finally {
      setUser(null)
      navigate(ROUTES.login)
    }
  }

  useEffect(() => {
    fetch('/api/me/', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data)
          if (window.location.hash === '' || window.location.hash === '#/') {
            navigate(ROUTES.range)
          }
        } else {
          setUser(null)
        }
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="loading-screen">Loading range...</div>
  }

  if (path !== ROUTES.range && path !== ROUTES.profile) {
    return <LoginPage />
  }

  return (
    <SettingsProvider>
      <AppShell user={user} activePath={path}>
        {path === ROUTES.profile ? (
          <ProfilePage 
            user={user} 
            onUpdateProfile={(changes) => setUser({ ...user, ...changes })} 
            onLogout={handleLogout}
          />
        ) : (
          <MainPage user={user} />
        )}
      </AppShell>
    </SettingsProvider>
  )
}

export default App
