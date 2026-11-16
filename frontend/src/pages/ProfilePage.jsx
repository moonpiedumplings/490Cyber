import { useState } from 'react'
import { LOGOUT_URL, initialsFor } from '../lib/currentUser'
import { ROUTES, navigate } from '../lib/router'
import './ProfilePage.css'

// SCRUM-105: profile page opened from the avatar button in the top bar.
// Data comes from the placeholder user in lib/currentUser.js for now.
export default function ProfilePage({ user, onUpdateProfile, onLogout }) {
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(user.displayName)

  const trimmed = nameDraft.trim()
  const canSaveName = trimmed.length > 0 && trimmed !== user.displayName

  const saveName = (e) => {
    e.preventDefault()
    if (!canSaveName) return
    onUpdateProfile({ displayName: trimmed })
    setEditingName(false)
  }

  const cancelName = () => {
    setNameDraft(user.displayName)
    setEditingName(false)
  }

  const joined = new Date(`${user.joined}T00:00:00`).toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="profile-page">
      <button type="button" className="text-button back-link" onClick={() => navigate(ROUTES.range)}>
        ← Back to range
      </button>

      <section className="profile-card" aria-labelledby="profile-name">
        <div className="profile-hero">
          <div className="profile-avatar" aria-hidden="true">
            {initialsFor(user.displayName)}
          </div>

          <div className="profile-identity">
            {editingName ? (
              <form className="name-form" onSubmit={saveName}>
                <label htmlFor="display-name" className="visually-hidden">
                  Display name
                </label>
                <input
                  id="display-name"
                  value={nameDraft}
                  maxLength={60}
                  autoFocus
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && cancelName()}
                />
                <button type="submit" className="btn btn-primary" disabled={!canSaveName}>
                  Save
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelName}>
                  Cancel
                </button>
              </form>
            ) : (
              <div className="name-row">
                <h1 id="profile-name">{user.displayName}</h1>
                <button type="button" className="text-button" onClick={() => setEditingName(true)}>
                  Edit name
                </button>
              </div>
            )}
            <span className="profile-role">{user.role}</span>
          </div>
        </div>

        <dl className="profile-details">
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Username</dt>
            <dd>
              <code>{user.username}</code>
            </dd>
          </div>
          <div>
            <dt>Sign-in method</dt>
            <dd>OpenID Connect</dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>{joined}</dd>
          </div>
        </dl>

        <div className="profile-stats" aria-label="Range activity">
          <div>
            <strong>0</strong>
            <span>Labs completed</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Attacks defended</span>
          </div>
          <div>
            <strong>—</strong>
            <span>Last session</span>
          </div>
        </div>

        <div className="profile-footer">
          <button type="button" className="btn btn-danger" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </section>
    </div>
  )
}
