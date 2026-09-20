import { FiPlus, FiSearch, FiCalendar, FiMessageSquare, FiFileText, FiPhone } from 'react-icons/fi'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'

export default function QuickActionsPanel() {
  const quickActions = [
    { icon: FiPlus, label: 'New Interaction', color: 'bg-blue-50 text-blue-600', hover: 'hover:bg-blue-100' },
    { icon: FiSearch, label: 'Search HCPs', color: 'bg-green-50 text-green-600', hover: 'hover:bg-green-100' },
    { icon: FiCalendar, label: 'Schedule Follow-up', color: 'bg-purple-50 text-purple-600', hover: 'hover:bg-purple-100' },
    { icon: FiMessageSquare, label: 'Send Message', color: 'bg-orange-50 text-orange-600', hover: 'hover:bg-orange-100' },
    { icon: FiFileText, label: 'View Reports', color: 'bg-indigo-50 text-indigo-600', hover: 'hover:bg-indigo-100' },
    { icon: FiPhone, label: 'Make Call', color: 'bg-pink-50 text-pink-600', hover: 'hover:bg-pink-100' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 transition-all ${action.color} ${action.hover} hover:shadow-md`}
              >
                <Icon size={24} className="mb-2" />
                <span className="text-xs font-medium text-center">{action.label}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800 font-medium mb-1">💡 Tip</p>
          <p className="text-xs text-blue-600">Use the AI Assistant to quickly log interactions by describing them in natural language.</p>
        </div>
      </CardContent>
    </Card>
  )
}