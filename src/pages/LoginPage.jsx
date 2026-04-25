import { useState } from 'react'

const initialForm = {
  email: '',
  password: '',
}

export default function LoginPage({ onLogin, isSubmitting, isSupabaseReady }) {
  const [formData, setFormData] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    if (!formData.email || !formData.password) {
      setErrorMessage('Email and password are required.')
      return
    }

    const result = await onLogin(formData)
    if (!result.ok) {
      setErrorMessage(result.message || 'Login failed. Please try again.')
    }
  }

  return (
    <section className="login-shell">
      <article className="login-card">
        <p className="section-kicker">Admin Access</p>
        <h2>Sign in to open the UpperHill Morit finance desk.</h2>
        <p className="muted-copy">
          Only approved administrator emails can access cashflow records, transaction entry,
          and the school cashbook.
        </p>

        {!isSupabaseReady ? (
          <div className="form-message form-message--error">
            Supabase credentials are missing. Add the project URL and anon key first.
          </div>
        ) : null}

        <form className="transaction-form login-form" onSubmit={handleSubmit}>
          <label>
            <span>Admin Email</span>
            <input
              type="email"
              name="email"
              placeholder="joanterer57@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          {errorMessage ? <p className="form-message form-message--error">{errorMessage}</p> : null}

          <button type="submit" disabled={isSubmitting || !isSupabaseReady}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </article>
    </section>
  )
}

