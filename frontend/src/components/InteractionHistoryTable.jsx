import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchInteractions } from '../api/client'

function SentimentBadge({ value }) {
  const normalized = (value || 'Neutral').toLowerCase()
  const colors = {
    positive: 'bg-green-100 text-green-600',
    neutral: 'bg-blue-100 text-blue-600',
    negative: 'bg-red-100 text-red-600'
  }
  return <span className={`inline-flex items-center justify-center rounded-full px-1 py-0.5 text-xs font-bold capitalize ${colors[normalized] || colors.neutral}`}>{value || 'Neutral'}</span>
}

export default function InteractionHistoryTable() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const data = await fetchInteractions()
        if (isMounted) {
          setItems(data || [])
        }
      } catch (error) {
        if (isMounted) {
          setItems([])
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
  }, [])

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col min-h-0 h-full overflow-hidden mt-0">
      <div className="p-3.5 px-5 border-b border-gray-200 font-semibold text-sm flex items-center gap-2 flex-shrink-0">Interaction History</div>
      <div className="p-3 px-4 overflow-x-auto">
        {loading ? (
          <div className="text-gray-500 p-5 text-xs">Loading interaction history…</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500 p-5 text-xs">No logged interactions yet.</div>
        ) : (
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2.5 px-2 border-b border-gray-200 text-left text-gray-500 font-semibold">HCP</th>
                <th className="p-2.5 px-2 border-b border-gray-200 text-left text-gray-500 font-semibold">Date</th>
                <th className="p-2.5 px-2 border-b border-gray-200 text-left text-gray-500 font-semibold">Type</th>
                <th className="p-2.5 px-2 border-b border-gray-200 text-left text-gray-500 font-semibold">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="p-2.5 px-2 border-b border-gray-200">
                    {item.hcp_id ? (
                      <Link className="text-blue-600 no-underline font-semibold hover:underline" to={`/hcp/${item.hcp_id}`}>
                        {item.hcp_name || 'Unknown HCP'}
                      </Link>
                    ) : (
                      item.hcp_name || 'Unknown HCP'
                    )}
                  </td>
                  <td className="p-2.5 px-2 border-b border-gray-200">{item.date || '—'}</td>
                  <td className="p-2.5 px-2 border-b border-gray-200">{item.interaction_type || '—'}</td>
                  <td className="p-2.5 px-2 border-b border-gray-200"><SentimentBadge value={item.sentiment} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
