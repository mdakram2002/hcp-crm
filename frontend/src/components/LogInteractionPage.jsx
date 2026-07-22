import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import InteractionForm from './InteractionForm'
import AIAssistantPanel from './AIAssistantPanel'
import InteractionHistoryTable from './InteractionHistoryTable'
import { clearAuth } from '../store/authSlice'

function getSessionId() {
  let id = sessionStorage.getItem('hcp_crm_session_id')
  if (!id) {
    id = uuidv4()
    sessionStorage.setItem('hcp_crm_session_id', id)
  }
  return id
}

export default function LogInteractionPage() {
  const sessionId = useMemo(getSessionId, [])
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <div className="page-header-row">
        <h1 className="page-title">Log HCP Interaction</h1>
        <div className="user-chip">
          <span>{user?.email || 'Signed in'} • {user?.role || 'rep'}</span>
          {user?.role === 'manager' ? <button className="btn-outline" onClick={() => navigate('/dashboard')}>Dashboard</button> : null}
          <button className="btn-outline" onClick={() => dispatch(clearAuth())}>Logout</button>
        </div>
      </div>
      <div className="split-layout">
        <InteractionForm />
        <AIAssistantPanel sessionId={sessionId} />
      </div>
      <InteractionHistoryTable />
    </div>
  )
}