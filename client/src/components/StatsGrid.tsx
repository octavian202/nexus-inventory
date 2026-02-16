export function StatsGrid({
  loading,
  totalItems,
  inventoryValue,
  lowStockItems,
  outOfStockItems,
  formatMoney,
}: {
  loading: boolean
  totalItems: number
  inventoryValue: number
  lowStockItems: number
  outOfStockItems: number
  formatMoney: (n: number) => string
}) {
  const stat = (value: React.ReactNode) => (loading ? <div className="skeleton skeleton-lg" /> : value)

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total Items</span>
          <div className="stat-icon blue">📦</div>
        </div>
        <div className="stat-value">{stat(totalItems.toLocaleString())}</div>
        <div className="stat-change positive">
          <span>↗</span>
          <span>Live from API</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Inventory Value</span>
          <div className="stat-icon green">💰</div>
        </div>
        <div className="stat-value">{stat(formatMoney(inventoryValue))}</div>
        <div className="stat-change positive">
          <span>↗</span>
          <span>Stock × Price</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Low Stock Items</span>
          <div className="stat-icon yellow">⚠️</div>
        </div>
        <div className="stat-value">{stat(lowStockItems.toLocaleString())}</div>
        <div className="stat-change negative">
          <span>↘</span>
          <span>Needs attention</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Out of Stock</span>
          <div className="stat-icon red">❌</div>
        </div>
        <div className="stat-value">{stat(outOfStockItems.toLocaleString())}</div>
        <div className="stat-change negative">
          <span>↗</span>
          <span>Immediate action required</span>
        </div>
      </div>
    </div>
  )
}

