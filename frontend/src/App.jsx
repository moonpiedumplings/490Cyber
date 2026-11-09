import './App.css'

function App() {
  return (
    <main className="login-page">
      <section className="login-content" aria-labelledby="login-title">
        <div className="brand-accent" aria-hidden="true"></div>

        <h1 className="login-title" id="login-title">
          CYBER <span>RANGE</span>
        </h1>

        <p className="login-description">
          Sign in to access the Cyber Range.
        </p>

        <button className="oidc-button" type="button">
          Sign in with OpenID Connect
        </button>
      </section>
    </main>
  )
}

export default App