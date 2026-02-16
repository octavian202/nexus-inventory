import { Outlet, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { ProductsProvider, useProducts } from '../data/ProductsContext'
import { MetaProvider } from '../data/MetaContext'
import { StockMovementsProvider } from '../data/StockMovementsContext'
import { getStatus } from '../utils/inventory'

const DEFAULT_BUSINESS = 'retail'

function InnerLayout() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const { products } = useProducts()

  const alertsCount = useMemo(() => {
    const low = products.filter((p) => getStatus(p) === 'low-stock').length
    const out = products.filter((p) => getStatus(p) === 'out-of-stock').length
    return low + out
  }, [products])

  return (
    <div className="app-container">
      <Sidebar
        pathname={location.pathname}
        inventoryCount={products.length}
        alertsCount={alertsCount}
      />

      <main className="main-content">
        <TopBar search={search} onSearchChange={setSearch} />
        <div className="content">
          <Outlet context={{ search, business: DEFAULT_BUSINESS }} />
        </div>
      </main>
    </div>
  )
}

export function AppLayout() {
  return (
    <MetaProvider>
      <ProductsProvider>
        <StockMovementsProvider>
          <InnerLayout />
        </StockMovementsProvider>
      </ProductsProvider>
    </MetaProvider>
  )
}

