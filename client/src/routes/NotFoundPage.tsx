import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Page not found</h1>
        <p className="page-subtitle">The page you’re looking for doesn’t exist.</p>
      </div>

      <div className="inventory-section">
        <div className="modal-body">
          <Link className="btn btn-primary" to="/">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </>
  )
}

