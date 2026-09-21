import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!email) {
      setError('Email is missing. Please request a new reset link.')
      return
    }

    setLoading(true)
    try {
      await resetPassword(email, otp, password)
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The OTP may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="auth-root">
        <div className="auth-form-panel" style={{ flex: 1 }}>
          <div className="check-email-card" style={{ margin: 'auto' }}>
            <h1>Missing Email</h1>
            <p>No email address found. Please request a new reset link.</p>
            <Link to="/forgot-password" className="btn-submit" style={{ display: 'flex', textDecoration: 'none', justifyContent: 'center', marginTop: '1rem' }}>Back to forgot password</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-root">
      <main className="auth-form-panel">
        <div className="auth-form-wrap">

          {done ? (
            <div className="check-email-card">
              <div className="check-email-icon">✅</div>
              <h1>Password reset!</h1>
              <p>Your password has been updated. Redirecting you to sign in…</p>
              <Link to="/login" className="btn-submit" style={{ display: 'flex', textDecoration: 'none', justifyContent: 'center', marginTop: '1rem' }}>
                Sign in now
              </Link>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <h1>New password</h1>
              </div>

              {error && (
                <div className="alert alert-error" role="alert">{error}</div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="otp">Verification Code</label>
                  <div className="input-wrap">
                    <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <input
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      className="otp-input"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="password">New password</label>
                  <div className="input-wrap">
                    <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowPassword(v => !v)}>
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="confirm">Confirm password</label>
                  <div className="input-wrap">
                    <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <input
                      id="confirm"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? <><span className="btn-spinner" /> Resetting…</> : 'Reset password'}
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
