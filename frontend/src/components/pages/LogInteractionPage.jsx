import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { FiSave, FiCheckCircle, FiCpu } from 'react-icons/fi'
import InteractionForm from '../InteractionForm'
import AIAssistantPanel from '../panels/AIAssistantPanel'
import HCPDetailsPanel from '../panels/HCPDetailsPanel'
import RecentInteractionPanel from '../panels/RecentInteractionPanel'
import SentimentTrendPanel from '../panels/SentimentTrendPanel'
import QuickActionsPanel from '../panels/QuickActionsPanel'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'
import { clearAuth } from '../../store/authSlice'

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
  const form = useSelector((state) => state.interaction)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Interaction</h1>
          <p className="text-sm text-gray-500 mt-1">Record your interaction with a healthcare professional. Use AI to get help, summarize notes, and improve your follow-ups.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">
            <FiSave className="mr-2" size={16} />
            Save Draft
          </Button>
          <Button variant="primary" size="sm">
            <FiCheckCircle className="mr-2" size={16} />
            Finalize Interaction
          </Button>
        </div>
      </div>

      {/* Primary workspace */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 min-h-[560px] h-[calc(100vh-190px)]">
        <div className="min-h-0 overflow-hidden">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Interaction Details</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-60px)] overflow-hidden">
              <InteractionForm />
            </CardContent>
          </Card>
        </div>

        <div className="min-h-0 overflow-hidden">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Assistant</CardTitle>
                <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  <FiCpu size={12} />
                  Groq LLM
                </span>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-60px)] overflow-hidden">
              <AIAssistantPanel sessionId={sessionId} />
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Additional context follows the primary workspace in the page scroll. */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions & HCP Context</h2>
          <p className="mt-1 text-sm text-gray-500">Shortcuts, profile details, and interaction history.</p>
        </div>
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
          <QuickActionsPanel />
          <div className="min-h-[250px]">
            <HCPDetailsPanel hcp={form.hcp_name ? { name: form.hcp_name, specialty: form.specialty } : null} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="min-h-[250px]">
              <RecentInteractionPanel interaction={form} />
            </div>
            <div className="h-[350px]">
              <SentimentTrendPanel />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}