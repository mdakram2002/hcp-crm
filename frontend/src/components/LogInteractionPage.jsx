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
    <div className="min-h-screen flex flex-col p-5 py-5 px-6 overflow-y-auto">
      <div className="flex justify-between items-center gap-3 mb-4">
        <h1 className="text-xl font-bold m-0 tracking-tight">Log HCP Interaction</h1>
        <div className="flex items-center gap-2 p-2 px-2.5 border border-gray-200 rounded-full bg-white text-xs text-gray-500">
          <span>{user?.email || 'Signed in'} • {user?.role || 'rep'}</span>
          {user?.role === 'manager' ? <button className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs font-semibold cursor-pointer text-gray-900 whitespace-nowrap hover:border-blue-500 hover:text-blue-500" onClick={() => navigate('/dashboard')}>Dashboard</button> : null}
          <button className="border border-gray-200 bg-white rounded px-3 py-1.5 text-xs font-semibold cursor-pointer text-gray-900 whitespace-nowrap hover:border-blue-500 hover:text-blue-500" onClick={() => dispatch(clearAuth())}>Logout</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_minmax(320px,1fr)] gap-4.5 items-stretch flex-1 min-h-0 mb-4">
        <InteractionForm />
        <AIAssistantPanel sessionId={sessionId} />
      </div>
      <InteractionHistoryTable />
    </div>
  )
}