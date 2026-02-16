import { useEffect, useMemo, useState } from 'react'
import type { ProductCreate } from '../api/types'
import { Modal } from './Modal'

function toNumber(v: string): number | null {
  const n = Number(v)
  if (!Number.isFinite(n)) return null
  return n
}

export function ProductFormModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (dto: ProductCreate) => void | Promise<void>
}) {
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('0')
  const [stockQuantity, setStockQuantity] = useState('0')
  const [minStockLevel, setMinStockLevel] = useState('5')
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setSku('')
    setName('')
    setCategory('')
    setPrice('0')
    setStockQuantity('0')
    setMinStockLevel('5')
    setSubmitting(false)
    setLocalError(null)
  }, [open])

  const canSubmit = useMemo(() => {
    if (!sku.trim() || !name.trim()) return false
    const p = toNumber(price)
    const s = toNumber(stockQuantity)
    const m = toNumber(minStockLevel)
    if (p === null || p < 0) return false
    if (s === null || s < 0) return false
    if (m === null || m < 0) return false
    return true
  }, [sku, name, price, stockQuantity, minStockLevel])

  async function handleSubmit() {
    setLocalError(null)
    const p = toNumber(price)
    const s = toNumber(stockQuantity)
    const m = toNumber(minStockLevel)
    if (!sku.trim()) return setLocalError('SKU is required.')
    if (!name.trim()) return setLocalError('Name is required.')
    if (p === null) return setLocalError('Price must be a number.')
    if (p < 0) return setLocalError('Price must be zero or greater.')
    if (s === null || s < 0) return setLocalError('Stock quantity cannot be negative.')
    if (m === null || m < 0) return setLocalError('Minimum stock level cannot be negative.')

    setSubmitting(true)
    try {
      await onSubmit({
        sku: sku.trim(),
        name: name.trim(),
        category: category.trim() ? category.trim() : null,
        price: p,
        stockQuantity: Math.trunc(s),
        minStockLevel: Math.trunc(m),
      })
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Failed to create product')
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} title="Add Item" onClose={onClose}>
      {localError ? (
        <div className="form-error" role="alert">
          {localError}
        </div>
      ) : null}

      <div className="form-grid">
        <label className="form-field">
          <span className="form-label">SKU *</span>
          <input className="form-input" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. WH-2847" />
        </label>

        <label className="form-field">
          <span className="form-label">Name *</span>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Premium Wireless Headphones"
          />
        </label>

        <label className="form-field">
          <span className="form-label">Category</span>
          <input className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Electronics" />
        </label>

        <label className="form-field">
          <span className="form-label">Unit Price *</span>
          <input
            className="form-input"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>

        <label className="form-field">
          <span className="form-label">Stock Quantity</span>
          <input
            className="form-input"
            type="number"
            inputMode="numeric"
            min={0}
            step="1"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
        </label>

        <label className="form-field">
          <span className="form-label">Minimum Stock Level</span>
          <input
            className="form-input"
            type="number"
            inputMode="numeric"
            min={0}
            step="1"
            value={minStockLevel}
            onChange={(e) => setMinStockLevel(e.target.value)}
          />
        </label>
      </div>

      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={() => void handleSubmit()} disabled={!canSubmit || submitting}>
          {submitting ? 'Creating…' : 'Create'}
        </button>
      </div>
    </Modal>
  )
}

