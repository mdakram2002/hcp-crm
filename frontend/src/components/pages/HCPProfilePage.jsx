import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCalendar, FiTrendingUp } from 'react-icons/fi'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchHcpProfile, fetchHcpSentimentTrend } from '../../api/client'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

function SentimentBadge({ value }) {
  const normalized = (value || 'Neutral').toLowerCase()
  const variants = {
    positive: 'success',
    neutral: 'info',
    negative: 'danger'
  }
  return <Badge variant={variants[normalized] || 'info'}>{value || 'Neutral'}</Badge>
}

function truncate(text, length = 100) {
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
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading HCP profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">HCP profile not found</div>
      </div>
    )
  }

  return (
    <div className="h-full p-6 overflow-hidden">
      {/* Back Button */}
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          <FiArrowLeft size={16} />
          Back to Log Interaction
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-140px)]">
        {/* Left Column - HCP Info */}
        <div className="col-span-1 overflow-hidden">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>HCP Profile</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-60px)] overflow-y-auto">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <FiUser className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{profile.hcp.name}</h3>
                <p className="text-sm text-gray-500">{profile.hcp.specialty || 'Specialty not listed'}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="info">Cardiologist</Badge>
                  <Badge variant="success">Key Decision Maker</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiBriefcase className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">Organization</p>
                    <p className="text-sm text-gray-900">{profile.hcp.institution || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMail className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{profile.hcp.email || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiPhone className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{profile.hcp.phone || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">Metro City</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{profile.interactions?.length || 0}</p>
                    <p className="text-xs text-gray-500">Total Interactions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">4.2</p>
                    <p className="text-xs text-gray-500">Avg Sentiment</p>
                  </div>
                </div>
              </div>

              <Button variant="primary" className="w-full mt-4">
                View Full Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Sentiment Trend */}
        <div className="col-span-1 overflow-hidden">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Sentiment Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-60px)]">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[-1, 1]} ticks={[-1, 0, 1]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Interaction Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="text-sm font-medium text-gray-900">5 interactions</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Positive Rate</span>
                    <span className="text-sm font-medium text-green-600">80%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Follow-up Rate</span>
                    <span className="text-sm font-medium text-blue-600">75%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Interactions */}
        <div className="col-span-1 overflow-hidden">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Interactions</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-60px)] overflow-y-auto">
              {profile.interactions?.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No prior interactions recorded</div>
              ) : (
                <div className="space-y-3">
                  {profile.interactions.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" size={14} />
                          <span className="text-xs text-gray-500">{item.date || '—'}</span>
                        </div>
                        <SentimentBadge value={item.sentiment} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{item.interaction_type || 'Interaction'}</p>
                      <p className="text-xs text-gray-600 mb-2"><strong>Topics:</strong> {truncate(item.topics_discussed)}</p>
                      <p className="text-xs text-gray-600 mb-2"><strong>Outcomes:</strong> {truncate(item.outcomes)}</p>
                      {item.materials_shared?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.materials_shared.map((material, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {material}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
