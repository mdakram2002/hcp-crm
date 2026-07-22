import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LogInteractionPage from './components/LogInteractionPage'
import DashboardPage from './components/DashboardPage'
import HCPProfilePage from './components/HCPProfilePage'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<LogInteractionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/hcp/:id" element={<HCPProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
