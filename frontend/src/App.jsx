import './App.css'

function App() {
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

export default App