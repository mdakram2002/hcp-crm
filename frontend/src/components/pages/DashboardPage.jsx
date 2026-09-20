import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { FiActivity, FiUsers, FiCalendar, FiTrendingUp, FiClock, FiCheckCircle, FiUser } from 'react-icons/fi'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from 'recharts'
import { fetchDashboardSummary } from '../../api/client'
import { StatCard } from '../ui/StatCard'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true)
        // For non-managers, we'll show mock data or a different view
        if (user?.role === 'manager') {
          const data = await fetchDashboardSummary()
          setSummary(data)
        } else {
          // Mock data for regular users
          setSummary({
            total_interactions_this_week: 12,
            total_interactions_this_month: 45,
            total_hcps: 23,
            pending_followups: 5,
            sentiment_breakdown: { Positive: 30, Neutral: 12, Negative: 3 },
            recent_interactions: [
              { hcp_name: 'Dr. Sarah Patel', interaction_type: 'Meeting', date: 'Sep 20, 2026', sentiment: 'Positive' },
              { hcp_name: 'Dr. James Wilson', interaction_type: 'Call', date: 'Sep 19, 2026', sentiment: 'Neutral' },
              { hcp_name: 'Dr. Emily Chen', interaction_type: 'Conference', date: 'Sep 18, 2026', sentiment: 'Positive' },
            ]
          })
        }
      } catch (err) {
        setError('Unable to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [user?.role])

  const activityData = useMemo(() => {
    if (!summary) return []
    return [
      { name: 'This Week', value: summary.total_interactions_this_week || 0 },
      { name: 'This Month', value: summary.total_interactions_this_month || 0 },
    ]
  }, [summary])

  const sentimentData = useMemo(() => {
    if (!summary?.sentiment_breakdown) return []
    return [
      { name: 'Positive', value: summary.sentiment_breakdown.Positive || 0 },
      { name: 'Neutral', value: summary.sentiment_breakdown.Neutral || 0 },
      { name: 'Negative', value: summary.sentiment_breakdown.Negative || 0 },
    ]
  }, [summary])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your HCP interactions and activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Interactions"
          value={summary?.total_interactions_this_month || 0}
          change="+12% from last month"
          trend="up"
          icon={<FiActivity className="text-blue-600" />}
        />
        <StatCard
          title="HCPs Contacted"
          value={summary?.total_hcps || 0}
          change="+5% from last month"
          trend="up"
          icon={<FiUsers className="text-green-600" />}
        />
        <StatCard
          title="Follow-ups Pending"
          value={summary?.pending_followups || 0}
          change="3 due today"
          trend="up"
          icon={<FiCalendar className="text-orange-600" />}
        />
        <StatCard
          title="Avg. Sentiment"
          value="4.2/5"
          change="+0.3 from last month"
          trend="up"
          icon={<FiTrendingUp className="text-purple-600" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4 mb-6 h-64">
        <Card>
          <CardHeader>
            <CardTitle>Interaction Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
              <BarChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4 h-64">
        <Card>
          <CardHeader>
            <CardTitle>Recent Interactions</CardTitle>
          </CardHeader>
          <CardContent className="h-48 overflow-y-auto">
            <div className="space-y-3">
              {summary?.recent_interactions?.slice(0, 4).map((interaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{interaction.hcp_name}</p>
                      <p className="text-xs text-gray-500">{interaction.interaction_type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{interaction.date}</p>
                    <span className={`text-xs font-medium ${
                      interaction.sentiment === 'Positive' ? 'text-green-600' :
                      interaction.sentiment === 'Negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {interaction.sentiment}
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-8">No recent interactions</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Insights & Suggested Actions</CardTitle>
          </CardHeader>
          <CardContent className="h-48 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <FiClock className="text-blue-600 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Follow-up Reminder</p>
                  <p className="text-xs text-gray-600">3 follow-ups due this week with high-priority HCPs</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <FiCheckCircle className="text-green-600 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Opportunity Detected</p>
                  <p className="text-xs text-gray-600">Dr. Smith showed increased interest in new product line</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <FiTrendingUp className="text-purple-600 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Sentiment Trend</p>
                  <p className="text-xs text-gray-600">Positive sentiment increased 15% this month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
