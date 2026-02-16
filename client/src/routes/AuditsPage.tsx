import { useMemo } from 'react'
import { useStockMovements } from '../data/StockMovementsContext'

export function AuditsPage() {
  const { movements, loading, error, refresh } = useStockMovements()

  const rows = useMemo(() => movements, [movements])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Audits</h1>
        <p className="page-subtitle">History of stock changes: receipts, transfers, and adjustments.</p>
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
          <h2 className="section-title">Stock movement log</h2>
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
                <th>Type</th>
                <th>SKU</th>
                <th>Product</th>
                <th>Adjustment</th>
                <th>Result</th>
                <th>From → To</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>Loading…</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8}>No movements yet.</td>
                </tr>
              ) : (
                rows.map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.createdAt).toLocaleString()}</td>
                    <td style={{ fontWeight: 700 }}>{m.type}</td>
                    <td>{m.sku}</td>
                    <td>{m.productName}</td>
                    <td style={{ fontWeight: 700, color: m.adjustment >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {m.adjustment >= 0 ? `+${m.adjustment}` : m.adjustment}
                    </td>
                    <td>{m.resultingStock}</td>
                    <td>
                      {(m.fromBusiness ?? '—') + ' → ' + (m.toBusiness ?? '—')}
                    </td>
                    <td>{m.note ?? '—'}</td>
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

