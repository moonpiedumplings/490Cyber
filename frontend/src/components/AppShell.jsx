import { useCallback, useState } from 'react'
import { ROUTES, navigate } from '../lib/router'
import ProfileButton from './ProfileButton'
import SettingsButton from './SettingsButton'
import SettingsPanel from './SettingsPanel'
import './AppShell.css'

// Layout for every signed-in page: top bar (brand, settings, profile) + content.
export default function AppShell({ user, activePath, children }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  // Stable reference so the panel's focus/Escape effect doesn't re-run on every render.
  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  return (
    <div className="app-shell">
      <header className="top-bar">
        <a
          className="top-bar-brand"
          href={`#${ROUTES.range}`}
          onClick={(e) => {
            e.preventDefault()
            navigate(ROUTES.range)
          }}
        >
          CYBER <span>RANGE</span>
        </a>

        <nav className="top-bar-actions" aria-label="Account">
          <SettingsButton open={settingsOpen} onClick={() => setSettingsOpen(true)} />
          <ProfileButton user={user} active={activePath === ROUTES.profile} />
        </nav>
      </header>

      <main className="app-content">{children}</main>

      {settingsOpen && <SettingsPanel onClose={closeSettings} />}
    </div>
  )
}
