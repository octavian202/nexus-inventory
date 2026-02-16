import { NavLink } from 'react-router-dom'

export function Sidebar({
  pathname,
  inventoryCount,
  alertsCount,
}: {
  pathname: string
  inventoryCount: number
  alertsCount: number
}) {
  const isActive = (path: string) => (path === '/' ? pathname === '/' : pathname.startsWith(path))

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo">
          <div className="logo-icon">N</div>
          <span>Nexus</span>
        </div>
      </div>

      <nav className="nav-menu">
        <div className="nav-section">
          <div className="nav-label">Main</div>
          <NavLink to="/" className={({ isActive: a }) => `nav-item ${a && isActive('/') ? 'active' : ''}`}>
            <span className="icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/inventory"
            className={({ isActive: a }) => `nav-item ${a || isActive('/inventory') ? 'active' : ''}`}
          >
            <span className="icon">📦</span>
            <span>Inventory</span>
            <span className="badge">{inventoryCount}</span>
          </NavLink>

          <NavLink
            to="/receiving"
            className={({ isActive: a }) => `nav-item ${a || isActive('/receiving') ? 'active' : ''}`}
          >
            <span className="icon">📥</span>
            <span>Receiving</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-label">Analytics</div>
          <NavLink
            to="/reports"
            className={({ isActive: a }) => `nav-item ${a || isActive('/reports') ? 'active' : ''}`}
          >
            <span className="icon">📈</span>
            <span>Reports</span>
          </NavLink>
          <NavLink
            to="/alerts"
            className={({ isActive: a }) => `nav-item ${a || isActive('/alerts') ? 'active' : ''}`}
          >
            <span className="icon">⚠️</span>
            <span>Alerts</span>
            <span className="badge">{alertsCount}</span>
          </NavLink>
          <NavLink
            to="/audits"
            className={({ isActive: a }) => `nav-item ${a || isActive('/audits') ? 'active' : ''}`}
          >
            <span className="icon">📋</span>
            <span>Audits</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-label">Account</div>
          <NavLink
            to="/users"
            className={({ isActive: a }) => `nav-item ${a || isActive('/users') ? 'active' : ''}`}
          >
            <span className="icon">👥</span>
            <span>Users</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}

