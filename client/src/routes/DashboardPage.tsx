import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatsGrid } from '../components/StatsGrid'
import { InventoryTable } from '../components/InventoryTable'
import { useProducts } from '../data/ProductsContext'
import { formatMoney } from '../utils/format'
import { getStatus, totalValue } from '../utils/inventory'

type FilterId = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'high-value'

export function DashboardPage() {
  const { products, loading, error, refresh } = useProducts()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterId>('all')

  const visible = useMemo(() => {
    return products.filter((p) => {
      const status = getStatus(p)
      if (filter === 'all') return true
      if (filter === 'high-value') return totalValue(p) >= 1000
      return status === filter
    })
  }, [products, filter])

  const computed = useMemo(() => {
    const totalSkus = products.length
    const inventoryValue = products.reduce((acc, p) => acc + totalValue(p), 0)
    const lowStockItems = products.filter((p) => getStatus(p) === 'low-stock').length
    const outOfStockItems = products.filter((p) => getStatus(p) === 'out-of-stock').length

    return { totalSkus, inventoryValue, lowStockItems, outOfStockItems }
  }, [products])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Monitor inventory performance and key metrics at a glance.</p>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          <div>
            <div className="alert-title">Something went wrong</div>
            <div className="alert-body">{error}</div>
          </div>
          <button className="alert-action" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      ) : null}

      <StatsGrid
        loading={loading}
        totalItems={computed.totalSkus}
        inventoryValue={computed.inventoryValue}
        lowStockItems={computed.lowStockItems}
        outOfStockItems={computed.outOfStockItems}
        formatMoney={formatMoney}
      />

      <InventoryTable
        products={visible}
        loading={loading}
        filter={filter}
        onFilterChange={setFilter}
        onAdd={() => navigate('/inventory')}
        onRestock={() => navigate('/inventory')}
      />
    </>
  )
}

