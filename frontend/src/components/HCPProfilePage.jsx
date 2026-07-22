import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchHcpProfile, fetchHcpSentimentTrend } from '../api/client'

function SentimentBadge({ value }) {
  const normalized = (value || 'Neutral').toLowerCase()
  return <span className={`sentiment-badge ${normalized}`}>{value || 'Neutral'}</span>
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
      <div className="app-shell">
        <div className="panel profile-panel">
          <div className="panel-header">Loading HCP profile…</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="app-shell">
        <div className="panel profile-panel">
          <div className="panel-header">HCP profile not found</div>
          <div className="profile-empty">The requested HCP could not be found.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="page-actions">
        <Link className="back-link" to="/">← Back to log screen</Link>
      </div>
      <div className="panel profile-panel">
        <div className="panel-header">
          <div>
            <div className="profile-name">{profile.hcp.name}</div>
            <div className="subtitle">{profile.hcp.specialty || 'Specialty not listed'} • {profile.hcp.institution || 'Institution not listed'}</div>
          </div>
        </div>
        <div className="profile-body">
          <div className="profile-chart-card">
            <div className="section-label">Sentiment trend</div>
            <div className="chart-wrap">
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

          <div className="profile-history-card">
            <div className="section-label">Past interactions</div>
            <div className="history-list">
              {profile.interactions.length === 0 ? (
                <div className="history-empty">No prior interactions recorded for this HCP.</div>
              ) : (
                profile.interactions.map((item) => (
                  <div className="history-item" key={item.date + item.topics_discussed + item.outcomes}>
                    <div className="history-item-top">
                      <div className="history-item-date">{item.date || '—'}</div>
                      <SentimentBadge value={item.sentiment} />
                    </div>
                    <div className="history-item-type">{item.interaction_type || 'Interaction'}</div>
                    <div className="history-item-text"><strong>Topics:</strong> {truncate(item.topics_discussed)}</div>
                    <div className="history-item-text"><strong>Outcomes:</strong> {truncate(item.outcomes)}</div>
                    <div className="history-item-materials">
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
