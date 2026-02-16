import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function AuthGuard({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div className="login-logo" style={{ marginBottom: 16 }}>
            <div className="logo-icon">N</div>
            <span>Nexus</span>
          </div>
          <p className="login-subtitle" style={{ marginBottom: 0 }}>Loading session…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

