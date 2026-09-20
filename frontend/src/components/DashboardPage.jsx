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
    return <div className="min-h-screen flex flex-col p-5 py-5 px-6 overflow-y-auto"><div className="text-gray-500 p-5">Loading team insights…</div></div>
  }

  return (
    <div className="min-h-screen flex flex-col p-5 py-5 px-6 overflow-y-auto">
      <div className="flex justify-between items-center gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold m-0 tracking-tight">Manager Dashboard</h1>
          <div className="text-gray-500 text-xs font-normal block">Team activity and follow-up opportunities</div>
        </div>
        <div className="flex items-center gap-2 p-2 px-2.5 border border-gray-200 rounded-full bg-white text-xs text-gray-500">
          <span>{user?.email || 'Signed in'} • {user?.role || 'manager'}</span>
          <button className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs font-semibold cursor-pointer text-gray-900 whitespace-nowrap hover:border-blue-500 hover:text-blue-500" onClick={() => navigate('/')}>Back to CRM</button>
        </div>
      </div>

      {error ? <div className="text-red-500 text-xs">{error}</div> : null}

      {summary ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{summary.total_interactions_this_week}</div>
              <div className="text-xs text-gray-500 mt-1">Interactions this week</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{summary.total_interactions_this_month}</div>
              <div className="text-xs text-gray-500 mt-1">Interactions this month</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{summary.sentiment_breakdown?.Positive || 0}</div>
              <div className="text-xs text-gray-500 mt-1">Positive sentiment</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{summary.sentiment_breakdown?.Negative || 0}</div>
              <div className="text-xs text-gray-500 mt-1">Negative sentiment</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_minmax(320px,1fr)] gap-4.5 items-stretch flex-1 min-h-0 mb-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col min-h-0 h-full overflow-hidden">
              <div className="p-3.5 px-5 border-b border-gray-200 font-semibold text-sm flex items-center gap-2 flex-shrink-0">Activity volume</div>
              <div className="p-5 grid gap-4.5 overflow-y-auto flex-1 min-h-0">
                <div className="h-60 mt-2">
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

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col min-h-0 h-full overflow-hidden">
              <div className="p-3.5 px-5 border-b border-gray-200 font-semibold text-sm flex items-center gap-2 flex-shrink-0">Top materials & samples</div>
              <div className="p-5 grid gap-4.5 overflow-y-auto flex-1 min-h-0">
                {summary.top_materials?.length ? (
                  <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                    {summary.top_materials.map((item, index) => (
                      <li className="flex justify-between items-center gap-2.5 p-2.5 px-3 border border-gray-200 rounded-lg bg-gray-50" key={`${item.name}-${index}`}>
                        <div>
                          <strong>{item.name}</strong>
                          <div className="text-xs font-semibold text-gray-500">No activity in the last 7 days</div>
                        </div>
                        <span className="bg-blue-100 text-blue-600 rounded-full px-2.5 py-0.75 text-xs font-semibold">{item.count} uses</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 p-5">No material usage recorded yet.</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col min-h-0 h-full overflow-hidden">
            <div className="p-3.5 px-5 border-b border-gray-200 font-semibold text-sm flex items-center gap-2 flex-shrink-0">Reps needing attention</div>
            <div className="p-5 grid gap-4.5 overflow-y-auto flex-1 min-h-0">
              {summary.needs_attention?.length ? (
                <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                  {summary.needs_attention.map((rep) => (
                    <li className="flex justify-between items-center gap-2.5 p-2.5 px-3 border border-gray-200 rounded-lg bg-gray-50" key={rep.email}>
                      <div>
                        <strong>{rep.email}</strong>
                        <div className="text-xs font-semibold text-gray-500">No activity in the last 7 days</div>
                      </div>
                      <span className="bg-blue-100 text-blue-600 rounded-full px-2.5 py-0.75 text-xs font-semibold">{rep.role}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 p-5">All reps are active this week.</div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
