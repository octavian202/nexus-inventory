import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { createStockMovement } from '../api/stockMovements'
import type { StockMovementType } from '../api/types'
import { useProducts } from '../data/ProductsContext'
import { useStockMovements } from '../data/StockMovementsContext'

type LayoutContext = { search: string; business: string }

export function ReceivingPage() {
  const { business } = useOutletContext<LayoutContext>()
  const { products, loading: productsLoading, error: productsError, refresh: refreshProducts } = useProducts()
  const { movements, loading: movesLoading, error: movesError, refresh: refreshMoves } = useStockMovements()

  const [productId, setProductId] = useState<string>('')
  const [qty, setQty] = useState<string>('10')
  const [note, setNote] = useState<string>('Inbound delivery')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recent = useMemo(() => movements.filter((m) => m.type === 'RECEIVING'), [movements])

  async function submit() {
    setError(null)
    const n = Number(qty)
    if (!productId) return setError('Select a product.')
    if (!Number.isFinite(n) || n <= 0) return setError('Quantity must be a positive number.')

    setSubmitting(true)
    try {
      await createStockMovement({
        productId,
        type: 'RECEIVING' satisfies StockMovementType,
        adjustment: Math.trunc(n),
        toBusiness: business,
        note: note.trim() ? note.trim() : null,
      })
      setQty('10')
      await Promise.all([refreshProducts(), refreshMoves(50)])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to receive stock')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Receiving</h1>
        <p className="page-subtitle">Record incoming deliveries and update stock levels. Each receipt is logged for auditing.</p>
      </div>

      {(productsError || movesError || error) ? (
        <div className="alert alert-danger" role="alert">
          <div>
            <div className="alert-title">Something went wrong</div>
            <div className="alert-body">{error ?? productsError ?? movesError}</div>
          </div>
          <button className="alert-action" onClick={() => void Promise.all([refreshProducts(), refreshMoves(50)])}>
            Try again
          </button>
        </div>
      ) : null}

      <div className="inventory-section">
        <div className="section-header">
          <h2 className="section-title">New receipt</h2>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <label className="form-field" style={{ gridColumn: '1 / -1' }}>
              <span className="form-label">Product</span>
              <select className="form-input" value={productId} onChange={(e) => setProductId(e.target.value)}>
                <option value="">Select…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} — {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span className="form-label">Quantity</span>
              <input className="form-input" type="number" min={1} step={1} value={qty} onChange={(e) => setQty(e.target.value)} />
            </label>

            <label className="form-field" style={{ gridColumn: '1 / -1' }}>
              <span className="form-label">Note</span>
              <input className="form-input" value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => void Promise.all([refreshProducts(), refreshMoves(50)])} disabled={submitting}>
              Refresh
            </button>
            <button className="btn btn-primary" onClick={() => void submit()} disabled={submitting || productsLoading}>
              {submitting ? 'Saving…' : 'Receive'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="inventory-section">
        <div className="section-header">
          <h2 className="section-title">Recent receipts</h2>
          <div className="section-actions">
            <button className="btn btn-secondary" onClick={() => void refreshMoves(50)} disabled={movesLoading}>
              Refresh
            </button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>SKU</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Result</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {movesLoading ? (
                <tr>
                  <td colSpan={6}>Loading…</td>
                </tr>
              ) : recent.length === 0 ? (
                <tr>
                  <td colSpan={6}>No receipts yet.</td>
                </tr>
              ) : (
                recent.slice(0, 20).map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.createdAt).toLocaleString()}</td>
                    <td>{m.sku}</td>
                    <td>{m.productName}</td>
                    <td style={{ fontWeight: 800, color: 'var(--success)' }}>+{m.adjustment}</td>
                    <td>{m.resultingStock}</td>
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

