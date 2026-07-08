import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setLoading } from '../store/chatSlice'
import { mergeFields, setField } from '../store/interactionSlice'
import { sendChatMessage } from '../api/client'

export default function AIAssistantPanel({ sessionId }) {
  const [draft, setDraft] = useState('')
  const messages = useSelector((state) => state.chat.messages)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const dispatch = useDispatch()
  const scrollRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    const text = draft.trim()
    if (!text || isLoading) return

    dispatch(addMessage({ role: 'user', text }))
    setDraft('')
    dispatch(setLoading(true))

    try {
      const data = await sendChatMessage(sessionId, text)
      
      if (data.field_updates && Object.keys(data.field_updates).length > 0) {
        dispatch(mergeFields(data.field_updates))
      }
      
      dispatch(
        addMessage({
          role: 'assistant',
          text: data.reply,
          tools: data.tool_calls || [],
        })
      )
    } catch (err) {
      dispatch(
        addMessage({
          role: 'assistant',
          text: 'Sorry, I could not reach the backend agent. Make sure the FastAPI server is running on port 8000.',
        })
      )
    } finally {
      dispatch(setLoading(false))
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="panel ai-panel">
      <div className="panel-header">
        <span className="icon">🤖</span>
        <div>
          AI Assistant
          <span className="subtitle">Log interaction via chat</span>
        </div>
      </div>

      <div className="chat-scroll" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-placeholder">
            <p>Log interaction details here</p>
            <p className="hint">(e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
            <div className="message-text">{m.text}</div>
            {m.tools && m.tools.length > 0 && (
              <div className="tool-tags">
                {m.tools.map((t, j) => (
                  <span className="tool-tag" key={j}>
                    🔧 {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble assistant">
            <span className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          placeholder="Describe interaction..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="btn-primary" onClick={handleSend} disabled={isLoading}>
          ➤ Log
        </button>
      </div>
    </div>
  )
}