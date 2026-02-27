import { Routes, Route, Navigate } from 'react-router-dom'
import { PageShell } from './components/templates/PageShell'
import { useAuthStore } from './stores/authStore'
import { ToastContainer } from './components/ui/toast'

// Page imports - lazy loaded for better performance
import { lazy, Suspense, ReactNode } from 'react'
import { LoadingScreen } from './components/custom/loading-screen'

const LoginPage = lazy(() => import('./pages/Login/LoginPage'))
const HomePage = lazy(() => import('./pages/Home/HomePage'))
const StaffPage = lazy(() => import('./pages/Staff/StaffPage'))
const JobsPage = lazy(() => import('./pages/Jobs/JobsPage'))
const StockPage = lazy(() => import('./pages/Stock/StockPage'))
const ScanStockPage = lazy(() => import('./pages/ScanStock/ScanStockPage'))
const CompliancePage = lazy(() => import('./pages/Compliance/CompliancePage'))
const QueuesPage = lazy(() => import('./pages/Queues/QueuesPage'))
const InsightsPage = lazy(() => import('./pages/Insights/InsightsPage'))
const SchedulePage = lazy(() => import('./pages/Schedule/SchedulePage'))
const TeamPage = lazy(() => import('./pages/Team/TeamPage'))

// Protected route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <PageShell>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/staff" element={<StaffPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/stock" element={<StockPage />} />
                  <Route path="/scan-stock" element={<ScanStockPage />} />
                  <Route path="/compliance" element={<CompliancePage />} />
                  <Route path="/queues" element={<QueuesPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PageShell>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </Suspense>
  )
}

export default App
