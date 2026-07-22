import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchDashboardSummary } from '../api/client'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role !== 'manager') {
      navigate('/')
      return
    }

    async function loadSummary() {
      try {
        setLoading(true)
        const data = await fetchDashboardSummary()
        setSummary(data)
      } catch (err) {
        setError('Unable to load team dashboard right now.')
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [navigate, user?.role])

  const chartData = useMemo(() => {
    if (!summary) return []
    return [
      { name: 'This Week', value: summary.total_interactions_this_week },
      { name: 'This Month', value: summary.total_interactions_this_month },
    ]
  }, [summary])

  if (loading) {
    return <div className="app-shell"><div className="profile-empty">Loading team insights…</div></div>
  }

  return (
    <div className="app-shell">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Manager Dashboard</h1>
          <div className="subtitle">Team activity and follow-up opportunities</div>
        </div>
        <div className="user-chip">
          <span>{user?.email || 'Signed in'} • {user?.role || 'manager'}</span>
          <button className="btn-outline" onClick={() => navigate('/')}>Back to CRM</button>
        </div>
      </div>

      {error ? <div className="auth-error">{error}</div> : null}

      {summary ? (
        <>
          <div className="dashboard-grid">
            <div className="metric-card">
              <div className="metric-value">{summary.total_interactions_this_week}</div>
              <div className="metric-label">Interactions this week</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{summary.total_interactions_this_month}</div>
              <div className="metric-label">Interactions this month</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{summary.sentiment_breakdown?.Positive || 0}</div>
              <div className="metric-label">Positive sentiment</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{summary.sentiment_breakdown?.Negative || 0}</div>
              <div className="metric-label">Negative sentiment</div>
            </div>
          </div>

          <div className="split-layout dashboard-layout">
            <div className="panel">
              <div className="panel-header">Activity volume</div>
              <div className="profile-body">
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2f6feb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">Top materials & samples</div>
              <div className="profile-body">
                {summary.top_materials?.length ? (
                  <ul className="dashboard-list">
                    {summary.top_materials.map((item, index) => (
                      <li className="dashboard-list-item" key={`${item.name}-${index}`}>
                        <div>
                          <strong>{item.name}</strong>
                          <div className="history-item-date">{item.item_type}</div>
                        </div>
                        <span className="chip">{item.count} uses</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="profile-empty">No material usage recorded yet.</div>
                )}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">Reps needing attention</div>
            <div className="profile-body">
              {summary.needs_attention?.length ? (
                <ul className="dashboard-list">
                  {summary.needs_attention.map((rep) => (
                    <li className="dashboard-list-item" key={rep.email}>
                      <div>
                        <strong>{rep.email}</strong>
                        <div className="history-item-date">No activity in the last 7 days</div>
                      </div>
                      <span className="chip">{rep.role}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="profile-empty">All reps are active this week.</div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
