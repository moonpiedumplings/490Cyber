import { useState } from 'react'
import TerraformEditor from '../components/TerraformEditor'
import './MainPage.css'

// SCRUM-85: main page the user lands on after signing in.
export default function MainPage({ user }) {
  const [activeView, setActiveView] = useState('dashboard')
  const firstName = user?.displayName?.trim()?.split(/\s+/)[0] || 'there'

  if (activeView === 'range') {
    return (
      <div className="main-page">
        <button
          className="back-link"
          type="button"
          onClick={() => setActiveView('dashboard')}
        >
          ← All features
        </button>

        <div className="page-intro">
          <div className="brand-accent" aria-hidden="true" />
          <h1>Range configuration</h1>
          <p>Review or edit the Terraform that defines your practice range.</p>
        </div>

        <TerraformEditor />
      </div>
    )
  }

  if (activeView === 'leaderboard') {
    return (
      <div className="main-page">
        <button
          className="back-link"
          type="button"
          onClick={() => setActiveView('dashboard')}
        >
          ← All features
        </button>

        <div className="page-intro">
          <div className="brand-accent" aria-hidden="true" />
          <h1>Leaderboard</h1>
          <p>View player rankings and scores.</p>
        </div>

        <section className="feature-placeholder">
          <div className="leaderboard-stats">
            <div>
              <span>Your rank</span>
              <strong>—</strong>
            </div>
            <div>
              <span>Your score</span>
              <strong>—</strong>
            </div>
          </div>
          <p>Leaderboard data will appear here when scoring is connected.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="main-page">
      <div className="page-intro">
        <div className="brand-accent" aria-hidden="true" />
        <h1>Welcome back, {firstName}</h1>
        <p>Choose a feature to continue.</p>
      </div>

      <section className="feature-grid" aria-label="Cyber Range features">
        <button
          className="feature-card"
          type="button"
          onClick={() => setActiveView('range')}
        >
          <span className="feature-label">Practice environment</span>
          <h2>Configure your range</h2>
          <p>
            Review or edit the Terraform configuration for your practice range.
          </p>
          <span className="feature-action">Open range configuration →</span>
        </button>

        <button
          className="feature-card"
          type="button"
          onClick={() => setActiveView('leaderboard')}
        >
          <span className="feature-label">Progress</span>
          <h2>Leaderboard</h2>
          <p>See player rankings and scores.</p>
          <span className="feature-action">View leaderboard →</span>
        </button>

                <button className="feature-card" type="button">
          <span className="feature-label">Administration</span>
          <h2>Admin</h2>
          <p>Manage users, ranges, and platform settings.</p>
          <span className="feature-action">Open admin →</span>
        </button>
      </section>
    </div>
  )
}