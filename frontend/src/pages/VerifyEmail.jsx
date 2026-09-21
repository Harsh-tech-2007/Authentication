import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function VerifyEmail() {
  const { verifyEmail, resendVerification } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.')
      return
    }

    setLoading(true)
    try {
      await verifyEmail(email, otp)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    setSuccess('')
    setResending(true)
    try {
      await resendVerification(email)
      setSuccess('A new code has been sent!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend. Try again.')
    } finally {
      setResending(false)
    }
  }

  if (!email) {
    return (
      <div className="auth-root">
        <div className="auth-form-panel" style={{ flex: 1 }}>
          <div className="check-email-card" style={{ margin: 'auto' }}>
            <h1>Missing Email</h1>
            <p>No email address found. Please try logging in again.</p>
            <Link to="/login" className="btn-submit" style={{ display: 'flex', textDecoration: 'none', justifyContent: 'center', marginTop: '1rem' }}>Back to sign in</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-root">
      <main className="auth-form-panel">
        <div className="auth-form-wrap">

          <div className="auth-header">
            <h1>Verify email</h1>
            <p className="auth-subtitle-text">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>

          {error && <div className="alert alert-error" role="alert">{error}</div>}
          {success && <div className="alert alert-success" role="alert">{success}</div>}

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
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} /* numbers only */
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Verifying…</> : 'Verify Account'}
            </button>
          </form>

          <p className="auth-footer" style={{ marginTop: '1.25rem' }}>
            Didn't receive a code?{' '}
            <button type="button" className="text-btn" onClick={handleResend} disabled={resending}>
              {resending ? 'Resending…' : 'Resend'}
            </button>
          </p>
          
          <p className="auth-footer">
            <Link to="/login">← Back to sign in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
