import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setLoading } from '../../store/chatSlice'
import { mergeFields, setField } from '../../store/interactionSlice'
import { sendChatMessage } from '../../api/client'

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
    <div className="flex flex-col h-full min-h-0">
      <div className="p-3.5 px-5 border-b border-gray-200 font-semibold text-sm flex items-center gap-2 flex-shrink-0 text-blue-600">
        <span className="text-base">🤖</span>
        <div>
          AI Assistant
          <span className="text-gray-500 text-xs font-normal block">Log interaction via chat</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 p-4 flex flex-col gap-2.5 overflow-y-auto" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-placeholder">
            <p>Log interaction details here</p>
            <p className="text-gray-500 italic text-xs mt-2">(e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`rounded-xl p-2.5 px-3.25 text-sm leading-relaxed max-w-[92%] ${m.role === 'user' ? 'bg-blue-600 text-white self-end rounded-tr-lg' : 'bg-blue-100 text-gray-900 self-start rounded-tl-lg'}`}>
            <div className="message-text">{m.text}</div>
            {m.tools && m.tools.length > 0 && (
              <div className="tool-tags">
                {m.tools.map((t, j) => (
                  <span className="inline-block mt-1.5 text-xs font-bold tracking-wider text-blue-600 bg-white rounded-full px-2 py-0.5" key={j}>
                    🔧 {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="rounded-xl p-2.5 px-3.25 text-sm leading-relaxed max-w-[92%] bg-blue-100 text-gray-900 self-start rounded-tl-lg">
            <span className="inline-flex gap-0.75">
              <span className="w-1.25 h-1.25 rounded-full bg-blue-600 opacity-50 animate-blink"></span>
              <span className="w-1.25 h-1.25 rounded-full bg-blue-600 opacity-50 animate-blink" style={{animationDelay: '0.2s'}}></span>
              <span className="w-1.25 h-1.25 rounded-full bg-blue-600 opacity-50 animate-blink" style={{animationDelay: '0.4s'}}></span>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 p-3.5 border-t border-gray-200 flex-shrink-0">
        <input
          type="text"
          className="flex-1 border border-gray-200 rounded-lg p-2.25 px-3 text-sm font-family"
          placeholder="Describe interaction..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="bg-blue-600 text-white border-none rounded-lg p-2.25 px-4 text-xs font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap disabled:opacity-55 disabled:cursor-not-allowed hover:bg-blue-700" onClick={handleSend} disabled={isLoading}>
          ➤ Log
        </button>
      </div>
    </div>
  )
}