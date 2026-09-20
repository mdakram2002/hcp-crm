import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LogInteractionPage from './components/pages/LogInteractionPage'
import DashboardPage from './components/pages/DashboardPage'
import HCPProfilePage from './components/pages/HCPProfilePage'
import HCPSearchPage from './components/pages/HCPSearchPage'
import InteractionsPage from './components/pages/InteractionsPage'
import TerritorySummaryPage from './components/pages/TerritorySummaryPage'
import ReportsPage from './components/pages/ReportsPage'
import AIToolsPage from './components/pages/AIToolsPage'
import SettingsPage from './components/pages/SettingsPage'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ProtectedRoute from './components/common/ProtectedRoute'
import Layout from './components/Layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<LogInteractionPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/hcp/:id" element={<HCPProfilePage />} />
            <Route path="/hcp-search" element={<HCPSearchPage />} />
            <Route path="/interactions" element={<InteractionsPage />} />
            <Route path="/territory-summary" element={<TerritorySummaryPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/ai-tools" element={<AIToolsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
