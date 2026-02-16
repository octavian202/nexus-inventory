import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function TopBar({
  search,
  onSearchChange,
}: {
  search: string
  onSearchChange: (v: string) => void
}) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const initials =
    user?.user_metadata?.full_name?.[0] ||
    user?.email?.[0] ||
    'U'

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true, state: { signedOut: true } })
  }

  return (
    <div className="top-bar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products, SKU, categories..."
        />
      </div>
      <div className="top-actions">
        <div className="user-avatar" title={user?.email ?? 'Signed in user'}>
          {initials.toString().toUpperCase()}
        </div>
        <button className="btn btn-logout" onClick={() => void handleSignOut()} aria-label="Sign out">
          <span className="btn-logout-icon">⎋</span>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  )
}

