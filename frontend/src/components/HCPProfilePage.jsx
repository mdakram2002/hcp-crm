import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchHcpProfile, fetchHcpSentimentTrend } from '../api/client'

function SentimentBadge({ value }) {
  const normalized = (value || 'Neutral').toLowerCase()
  const colors = {
    positive: 'bg-green-100 text-green-600',
    neutral: 'bg-blue-100 text-blue-600',
    negative: 'bg-red-100 text-red-600'
  }
  return <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-bold capitalize ${colors[normalized] || colors.neutral}`}>{value || 'Neutral'}</span>
}

function truncate(text, length = 120) {
  if (!text) return '—'
  return text.length > length ? `${text.slice(0, length)}…` : text
}

export default function HCPProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const [hcpData, trendData] = await Promise.all([
          fetchHcpProfile(id),
          fetchHcpSentimentTrend(id),
        ])
        if (isMounted) {
          setProfile(hcpData)
          setTrend(trendData || [])
        }
      } catch (error) {
        if (isMounted) {
          setProfile(null)
          setTrend([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [id])

  const chartData = useMemo(() => trend.map((item) => ({ ...item, value: item.sentiment })), [trend])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col p-5 py-5 px-6 overflow-y-auto">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col min-h-0 h-full overflow-hidden mt-1">
          <div className="p-3.5 px-5 border-b border-gray-200 font-semibold text-sm flex items-center gap-2 flex-shrink-0">Loading HCP profile…</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col p-5 py-5 px-6 overflow-y-auto">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col min-h-0 h-full overflow-hidden mt-1">
          <div className="p-3.5 px-5 border-b border-gray-200 font-semibold text-sm flex items-center gap-2 flex-shrink-0">HCP profile not found</div>
          <div className="text-gray-500 p-5">The requested HCP could not be found.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-5 py-5 px-6 overflow-y-auto">
      <div className="flex justify-start mb-3">
        <Link className="text-blue-600 no-underline font-semibold hover:underline" to="/">← Back to log screen</Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col min-h-0 h-full overflow-hidden mt-1">
        <div className="p-3.5 px-5 border-b border-gray-200 font-semibold text-sm flex items-center gap-2 flex-shrink-0">
          <div>
            <div className="text-base font-bold">{profile.hcp.name}</div>
            <div className="text-gray-500 text-xs font-normal block">{profile.hcp.specialty || 'Specialty not listed'} • {profile.hcp.institution || 'Institution not listed'}</div>
          </div>
        </div>
        <div className="p-4.5 px-5 grid gap-4.5">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="text-xs font-semibold mb-2">Sentiment trend</div>
            <div className="h-60 mt-2">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#e1e4e9" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[-1, 1]} ticks={[-1, 0, 1]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2f6feb" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="text-xs font-semibold mb-2">Past interactions</div>
            <div className="flex flex-col gap-2.5 mt-2">
              {profile.interactions.length === 0 ? (
                <div className="text-gray-500 p-5 text-xs">No prior interactions recorded for this HCP.</div>
              ) : (
                profile.interactions.map((item) => (
                  <div className="border border-gray-200 rounded-lg p-3 px-3.5 bg-white" key={item.date + item.topics_discussed + item.outcomes}>
                    <div className="flex justify-between items-center gap-2 mb-1.5">
                      <div className="text-xs font-semibold text-gray-500">{item.date || '—'}</div>
                      <SentimentBadge value={item.sentiment} />
                    </div>
                    <div className="text-xs font-semibold mb-1.5">{item.interaction_type || 'Interaction'}</div>
                    <div className="text-xs text-gray-900 mb-1"><strong>Topics:</strong> {truncate(item.topics_discussed)}</div>
                    <div className="text-xs text-gray-900 mb-1"><strong>Outcomes:</strong> {truncate(item.outcomes)}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2 text-xs text-gray-500">
                      {item.materials_shared?.length ? <span>Materials: {item.materials_shared.join(', ')}</span> : null}
                      {item.samples_distributed?.length ? <span>Samples: {item.samples_distributed.join(', ')}</span> : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
