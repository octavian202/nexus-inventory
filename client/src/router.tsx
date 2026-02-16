import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './routes/AppLayout'
import { DashboardPage } from './routes/DashboardPage'
import { InventoryPage } from './routes/InventoryPage'
import { ReceivingPage } from './routes/ReceivingPage'
import { ReportsPage } from './routes/ReportsPage'
import { AlertsPage } from './routes/AlertsPage'
import { AuditsPage } from './routes/AuditsPage'
import { UsersPage } from './routes/UsersPage'
import { NotFoundPage } from './routes/NotFoundPage'
import { LoginPage } from './routes/LoginPage'
import { AuthGuard } from './auth/AuthGuard'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'receiving', element: <ReceivingPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'audits', element: <AuditsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

