import { useState } from 'react'
import upperhillLockup from '../assets/upperhill-lockup.svg'

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
    <section className="login-shell login-shell--branded">
      <article className="login-card login-card--school">
        <div className="login-hero">
          <div className="login-branding">
            <img className="login-logo" src={upperhillLockup} alt="Upper Hill Academy Morit official logo" />
            <div>
              <p className="section-kicker login-kicker">UpperHill Morit</p>
              <h2>School Finance</h2>
              <p className="muted-copy login-copy">
                Sign in to manage school cashbook and records.
              </p>
            </div>
          </div>
          <div className="login-banner">
            <span>Admin Access</span>
            <p>Sign in to continue</p>
          </div>
        </div>

        {!isSupabaseReady ? (
          <div className="form-message form-message--error">
            Supabase credentials missing. Add project URL and anon key.
          </div>
        ) : null}

        <form className="transaction-form login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="admin@school.ac.ke"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          {errorMessage ? <p className="form-message form-message--error">{errorMessage}</p> : null}

          <div className="login-actions">
            <button type="submit" disabled={isSubmitting || !isSupabaseReady}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </article>
    </section>
  )
}
