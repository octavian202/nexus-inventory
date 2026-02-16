import { useEffect, useState } from 'react'
import { getAllUsers } from '../api/users'

type AppUser = Awaited<ReturnType<typeof getAllUsers>>[number]

export function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">Team members with access to this account.</p>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          <div>
            <div className="alert-title">Something went wrong</div>
            <div className="alert-body">{error}</div>
          </div>
          <button className="alert-action" onClick={() => void load()} disabled={loading}>
            Try again
          </button>
        </div>
      ) : null}

      <div className="inventory-section">
        <div className="section-header">
          <h2 className="section-title">Users</h2>
          <div className="section-actions">
            <button className="btn btn-secondary" onClick={() => void load()} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Created</th>
                <th>Last login</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>Loading…</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4}>No users yet.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.displayName ?? '—'}</td>
                    <td>{new Date(u.createdAt).toLocaleString()}</td>
                    <td>{new Date(u.lastLoginAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

