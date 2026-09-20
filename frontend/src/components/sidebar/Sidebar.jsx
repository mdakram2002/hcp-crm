import { useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiEdit3, FiSearch, FiList, FiTrendingUp, FiBarChart2, FiCpu, FiSettings, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi'
import { useSelector } from 'react-redux'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const mainNavItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/', icon: FiEdit3, label: 'Log Interaction' },
    { path: '/hcp-search', icon: FiSearch, label: 'HCP Search' },
    { path: '/interactions', icon: FiList, label: 'Interactions' },
  ]

  const insightsNavItems = [
    { path: '/territory-summary', icon: FiTrendingUp, label: 'Territory Summary' },
    { path: '/reports', icon: FiBarChart2, label: 'Reports' },
    { path: '/ai-tools', icon: FiCpu, label: 'AI Tools' },
  ]

  const systemNavItems = [
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const NavItem = ({ item }) => {
    const Icon = item.icon
    const isActive = location.pathname === item.path
    
    return (
      <button
        onClick={() => navigate(item.path)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
          isActive 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <Icon size={18} />
        <span>{item.label}</span>
        {isActive && (
          <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
        )}
      </button>
    )
  }

  const NavSection = ({ title, items }) => (
    <div className="mb-6">
      <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.path}>
            <NavItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FiCpu size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">HCP CRM</h1>
            <p className="text-xs text-gray-400">AI-Powered Healthcare CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <NavSection title="Main" items={mainNavItems} />
        <NavSection title="Insights" items={insightsNavItems} />
        <NavSection title="System" items={systemNavItems} />
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-750 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <FiUser size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.email || 'User'}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role || 'Field Representative'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}