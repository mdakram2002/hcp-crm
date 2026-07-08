import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import InteractionForm from './InteractionForm'
import AIAssistantPanel from './AIAssistantPanel'

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

  return (
    <div className="app-shell">
      <h1 className="page-title">Log HCP Interaction</h1>
      <div className="split-layout">
        <InteractionForm />
        <AIAssistantPanel sessionId={sessionId} />
      </div>
    </div>
  )
}