import { useEffect, useMemo, useState } from 'react'
import type { Product } from '../api/types'
import { Modal } from './Modal'

function toInt(v: string): number | null {
  const n = Number(v)
  if (!Number.isFinite(n)) return null
  return Math.trunc(n)
}

export function StockAdjustModal({
  open,
  product,
  onClose,
  onSubmit,
}: {
  open: boolean
  product: Product | null
  onClose: () => void
  onSubmit: (productId: string, adjustment: number) => void | Promise<void>
}) {
  const [adjustment, setAdjustment] = useState('10')
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setAdjustment('10')
    setSubmitting(false)
    setLocalError(null)
  }, [open])

  const canSubmit = useMemo(() => {
    const a = toInt(adjustment)
    return product != null && a != null && a !== 0
  }, [adjustment, product])

  async function handleSubmit() {
    setLocalError(null)
    if (!product) return
    const a = toInt(adjustment)
    if (a == null) return setLocalError('Adjustment must be a number.')
    if (a === 0) return setLocalError('Adjustment must be non-zero.')
    setSubmitting(true)
    try {
      await onSubmit(product.id, a)
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Failed to update stock')
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} title="Adjust stock level" onClose={onClose}>
      {product ? (
        <div className="mini-product">
          <div className="mini-product-title">{product.name}</div>
          <div className="mini-product-subtitle">
            SKU: {product.sku} · Current stock: <b>{product.stockQuantity ?? 0}</b> · Min: {product.minStockLevel ?? 0}
          </div>
        </div>
      ) : null}

      {localError ? (
        <div className="form-error" role="alert">
          {localError}
        </div>
      ) : null}

      <div className="form-grid">
        <label className="form-field" style={{ gridColumn: '1 / -1' }}>
          <span className="form-label">Quantity to add or subtract</span>
          <input
            className="form-input"
            type="number"
            inputMode="numeric"
            step="1"
            value={adjustment}
            onChange={(e) => setAdjustment(e.target.value)}
            placeholder="e.g. 10 or -3"
          />
          <span className="form-help">Enter a positive number to add stock (e.g. after a count) or a negative number to subtract (e.g. damage or shrinkage). The change is recorded in the audit log.</span>
        </label>
      </div>

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={() => void handleSubmit()} disabled={!canSubmit || submitting}>
          {submitting ? 'Saving…' : 'Apply adjustment'}
        </button>
      </div>
    </Modal>
  )
}

