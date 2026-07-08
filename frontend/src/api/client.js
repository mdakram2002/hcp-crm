import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE,
})

export async function sendChatMessage(sessionId, message) {
  const res = await api.post('/api/chat', { session_id: sessionId, message })
  return res.data // { reply, field_updates, tool_calls }
}

export async function finalizeInteraction(sessionId) {
  const res = await api.post('/api/interactions/finalize', { session_id: sessionId })
  return res.data
}

export async function searchMaterials(q, itemType) {
  const res = await api.get('/api/materials/search', { params: { q, item_type: itemType } })
  return res.data
}
