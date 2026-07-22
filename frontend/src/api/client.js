import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('hcp_crm_token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
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

export async function searchHcps(q) {
  const res = await api.get('/api/hcps/search', { params: { q } })
  return res.data
}

export async function fetchInteractions() {
  const res = await api.get('/api/interactions')
  return res.data
}

export async function fetchHcpProfile(hcpId) {
  const res = await api.get(`/api/hcps/${hcpId}`)
  return res.data
}

export async function fetchHcpSentimentTrend(hcpId) {
  const res = await api.get(`/api/hcps/${hcpId}/sentiment-trend`)
  return res.data
}

export async function loginUser(payload) {
  const res = await api.post('/api/auth/login', payload)
  return res.data
}

export async function registerUser(payload) {
  const res = await api.post('/api/auth/register', payload)
  return res.data
}

export async function fetchCurrentUser() {
  const res = await api.get('/api/auth/me')
  return res.data
}

export async function fetchDashboardSummary() {
  const res = await api.get('/api/dashboard/summary')
  return res.data
}
