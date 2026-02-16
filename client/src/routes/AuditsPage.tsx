import { useMemo } from 'react'
import { useAuditLogs } from '../data/AuditLogsContext'

function formatActionType(action: string): string {
  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function AuditsPage() {
  const { entries, loading, error, refresh } = useAuditLogs()

  const rows = useMemo(() => entries, [entries])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Audit log</h1>
        <p className="page-subtitle">
          Every stock-related action is recorded with who made the change and what was done.
        </p>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          <div>
            <div className="alert-title">Something went wrong</div>
            <div className="alert-body">{error}</div>
          </div>
          <button className="alert-action" onClick={() => void refresh(50)} disabled={loading}>
            Try again
          </button>
        </div>
      ) : null}

      <div className="inventory-section">
        <div className="section-header">
          <h2 className="section-title">All actions</h2>
          <div className="section-actions">
            <button className="btn btn-secondary" onClick={() => void refresh(50)} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>Action</th>
                <th>Description</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>Loading…</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5}>No audit entries yet. Create a product or record a stock change to see entries here.</td>
                </tr>
              ) : (
                rows.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.createdAt).toLocaleString()}</td>
                    <td>
                      <span title={entry.userEmail}>
                        {entry.userDisplayName || entry.userEmail || entry.userId}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatActionType(entry.actionType)}</td>
                    <td>{entry.description}</td>
                    <td>{entry.details ?? '—'}</td>
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
