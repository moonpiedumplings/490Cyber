import { initialsFor } from '../lib/currentUser'
import { ROUTES, navigate } from '../lib/router'

// SCRUM-105: avatar button in the top bar that opens the profile page.
export default function ProfileButton({ user, active }) {
  return (
    <button
      type="button"
      className={`avatar-button${active ? ' is-active' : ''}`}
      aria-label={`Profile: ${user.displayName}`}
      title="Profile"
      aria-current={active ? 'page' : undefined}
      onClick={() => navigate(ROUTES.profile)}
    >
      {initialsFor(user.displayName)}
    </button>
  )
}
