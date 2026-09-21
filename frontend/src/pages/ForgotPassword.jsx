import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      navigate(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <main className="auth-form-panel">
        <div className="auth-form-wrap">

          {submitted ? (
            <div className="check-email-card">
              <div className="check-email-icon">📨</div>
              <h1>Check your email</h1>
              <p>
                If <strong>{email}</strong> is registered, you&apos;ll receive a
                password reset link shortly.
              </p>
              <p className="check-email-sub">The link expires in <strong>1 hour</strong>.</p>
              <p className="auth-footer" style={{ marginTop: '1.5rem' }}>
                <Link to="/login">← Back to sign in</Link>
              </p>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <h1>Reset password</h1>
                <p className="auth-subtitle-text">Enter your email and we&apos;ll send you a reset link.</p>
              </div>

              {error && (
                <div className="alert alert-error" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="email">Email address</label>
                  <div className="input-wrap">
                    <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? <><span className="btn-spinner" /> Sending…</> : 'Send reset link'}
                </button>
              </form>

              <p className="auth-footer">
                <Link to="/login">← Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
