import { FiUsers, FiTrendingUp, FiActivity, FiMapPin, FiCalendar, FiAlertCircle } from 'react-icons/fi'
import { StatCard } from '../ui/StatCard'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts'

export default function TerritorySummaryPage() {
  // Mock data
  const repActivity = [
    { name: 'Alex Reed', interactions: 45, sentiment: 4.2 },
    { name: 'Sarah Johnson', interactions: 38, sentiment: 4.5 },
    { name: 'Mike Chen', interactions: 52, sentiment: 3.8 },
    { name: 'Emily Davis', interactions: 41, sentiment: 4.1 },
  ]

  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981' },
    { name: 'Neutral', value: 25, color: '#6b7280' },
    { name: 'Negative', value: 10, color: '#ef4444' },
  ]

  const inactiveReps = [
    { name: 'John Smith', lastActivity: '14 days ago', region: 'West' },
    { name: 'Lisa Brown', lastActivity: '21 days ago', region: 'East' },
  ]

  const materialUsage = [
    { name: 'Product Brochure', usage: 120 },
    { name: 'Sample Pack A', usage: 85 },
    { name: 'Clinical Data', usage: 65 },
    { name: 'Demo Kit', usage: 45 },
  ]

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Territory Summary</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of territory performance and rep activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Interactions"
          value="176"
          change="+15% from last month"
          trend="up"
          icon={<FiActivity className="text-blue-600" />}
        />
        <StatCard
          title="Active HCPs"
          value="89"
          change="+8% from last month"
          trend="up"
          icon={<FiUsers className="text-green-600" />}
        />
        <StatCard
          title="Avg. Sentiment"
          value="4.1/5"
          change="+0.2 from last month"
          trend="up"
          icon={<FiTrendingUp className="text-purple-600" />}
        />
        <StatCard
          title="Follow-up Rate"
          value="78%"
          change="+5% from last month"
          trend="up"
          icon={<FiCalendar className="text-orange-600" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4 mb-6 h-64">
        <Card>
          <CardHeader>
            <CardTitle>Rep Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="interactions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4 h-64">
        <Card>
          <CardHeader>
            <CardTitle>Material & Sample Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Bar dataKey="usage" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reps Needing Attention</CardTitle>
          </CardHeader>
          <CardContent className="h-48 overflow-y-auto">
            <div className="space-y-3">
              {inactiveReps.map((rep, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <FiAlertCircle className="text-red-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{rep.name}</p>
                      <p className="text-xs text-gray-600">{rep.region} • Last activity: {rep.lastActivity}</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Reach out
                  </button>
                </div>
              ))}
              {inactiveReps.length === 0 && (
                <div className="text-center text-gray-500 py-8">All reps are active</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}