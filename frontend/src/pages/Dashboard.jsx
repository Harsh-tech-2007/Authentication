import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initials = (user?.username || user?.email || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  return (
    <div className="dash-page">

      {/* ── Top nav ── */}
      <header className="dash-nav">
        <div className="nav-logo">
          <span className="logo-mark">A</span>
          <span className="logo-text">AuthApp</span>
        </div>
        <button className="nav-logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H9a1 1 0 110-2h5.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Sign out
        </button>
      </header>

      {/* ── Main content ── */}
      <main className="dash-main">

        {/* Profile hero */}
        <section className="profile-hero">
          <div className="profile-avatar">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="avatar-initials">{initials}</span>
            )}
          </div>
          <div className="profile-info">
            <h1>{user?.username || 'User'}</h1>
            <p>{user?.email}</p>
            <span className="badge">
              <span className="badge-dot" />
              Active
            </span>
          </div>
        </section>

        {/* Detail cards */}
        <section className="dash-cards">

          <div className="detail-card">
            <div className="card-icon user-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="card-body">
              <span className="card-label">Username</span>
              <span className="card-value">{user?.username ?? '—'}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="card-icon email-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="card-body">
              <span className="card-label">Email address</span>
              <span className="card-value">{user?.email}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="card-icon id-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm1 8a1 1 0 100 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h3a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="card-body">
              <span className="card-label">User ID</span>
              <span className="card-value mono">{user?.id}</span>
            </div>
          </div>

        </section>

      </main>
    </div>
  )
}
