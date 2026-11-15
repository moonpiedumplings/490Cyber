import TerraformEditor from '../components/TerraformEditor'
import './MainPage.css'

// SCRUM-85: main page the user lands on after signing in.
export default function MainPage({ user }) {
  return (
    <div className="main-page">
      <div className="page-intro">
        <div className="brand-accent" aria-hidden="true"></div>
        <h1>Welcome back, {user.displayName.split(' ')[0]}</h1>
        <p>Review or edit the terraform that defines your practice range.</p>
      </div>

      <TerraformEditor />
    </div>
  )
}
