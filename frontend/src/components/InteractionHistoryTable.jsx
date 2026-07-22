import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchInteractions } from '../api/client'

function SentimentBadge({ value }) {
  const normalized = (value || 'Neutral').toLowerCase()
  const className = `sentiment-badge ${normalized}`
  return <span className={className}>{value || 'Neutral'}</span>
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
    <div className="panel history-panel">
      <div className="panel-header">Interaction History</div>
      <div className="history-table-wrap">
        {loading ? (
          <div className="history-empty">Loading interaction history…</div>
        ) : items.length === 0 ? (
          <div className="history-empty">No logged interactions yet.</div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>HCP</th>
                <th>Date</th>
                <th>Type</th>
                <th>Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.hcp_id ? (
                      <Link className="history-link" to={`/hcp/${item.hcp_id}`}>
                        {item.hcp_name || 'Unknown HCP'}
                      </Link>
                    ) : (
                      item.hcp_name || 'Unknown HCP'
                    )}
                  </td>
                  <td>{item.date || '—'}</td>
                  <td>{item.interaction_type || '—'}</td>
                  <td><SentimentBadge value={item.sentiment} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
