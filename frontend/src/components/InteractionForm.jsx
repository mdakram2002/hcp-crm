import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setField, addFollowUpAction } from '../store/interactionSlice'
import { searchHcps } from '../api/client'

const SENTIMENTS = [
  { value: 'Positive', emoji: '🙂' },
  { value: 'Neutral', emoji: '😐' },
  { value: 'Negative', emoji: '🙁' },
]

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 text-gray-900">{label}</label>
      {children}
    </div>
  )
}

export default function InteractionForm() {
  const form = useSelector((state) => state.interaction)
  const dispatch = useDispatch()
  const [hcpQuery, setHcpQuery] = useState(form.hcp_name || '')
  const [hcpOptions, setHcpOptions] = useState([])
  const [showHcpOptions, setShowHcpOptions] = useState(false)

  const update = (field, value) => dispatch(setField({ field, value }))

  const handleFollowUpClick = (followUp) => {
    const currentActions = form.follow_up_actions || []
    if (!currentActions.includes(followUp)) {
      dispatch(setField({ field: 'follow_up_actions', value: [...currentActions, followUp] }))
    }
  }

  useEffect(() => {
    setHcpQuery(form.hcp_name || '')
  }, [form.hcp_name])

  useEffect(() => {
    if (!hcpQuery.trim()) {
      setHcpOptions([])
      setShowHcpOptions(false)
      return
    }

    const timeout = window.setTimeout(async () => {
      try {
        const results = await searchHcps(hcpQuery)
        setHcpOptions(results || [])
        setShowHcpOptions(true)
      } catch (error) {
        setHcpOptions([])
        setShowHcpOptions(false)
      }
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [hcpQuery])

  const handleHcpSelect = (option) => {
    setHcpQuery(option.name)
    update('hcp_name', option.name)
    update('hcp_id', option.id)
    setShowHcpOptions(false)
  }

  const handleHcpInputChange = (value) => {
    setHcpQuery(value)
    update('hcp_name', value)
    if (!value.trim()) {
      update('hcp_id', null)
    }
  }

  const inputClassName = useMemo(() => (showHcpOptions && hcpOptions.length > 0 ? 'autocomplete-open' : ''), [showHcpOptions, hcpOptions.length])

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col min-h-0 h-full overflow-hidden">
      <div className="p-3.5 px-5 border-b border-gray-200 font-semibold text-sm flex items-center gap-2 flex-shrink-0">Interaction Details</div>
      <div className="p-5 flex flex-col gap-4.5 overflow-y-auto flex-1 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          <Field label="HCP Name">
            <div className="relative">
              <input
                type="text"
                className={`w-full border ${showHcpOptions && hcpOptions.length > 0 ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-2.25 px-2.75 text-sm font-family text-gray-900 bg-white transition-all duration-200`}
                placeholder="Search or select HCP..."
                value={hcpQuery}
                onChange={(e) => handleHcpInputChange(e.target.value)}
                onFocus={() => hcpQuery.trim() && setShowHcpOptions(true)}
                onBlur={() => window.setTimeout(() => setShowHcpOptions(false), 120)}
              />
              {showHcpOptions && hcpOptions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-[calc(100%+4px)] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  {hcpOptions.map((option) => (
                    <button
                      type="button"
                      className="w-full border-0 bg-white p-2.5 px-3 flex flex-col items-start gap-0.5 cursor-pointer text-left"
                      key={option.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleHcpSelect(option)}
                    >
                      <span>{option.name}</span>
                      {option.institution && <small className="text-gray-500 text-xs">{option.institution}</small>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>
          <Field label="Interaction Type">
            <div className="relative">
              <select
                className="w-full border border-gray-200 rounded-lg p-2.25 px-2.75 text-sm font-family text-gray-900 bg-white appearance-none"
                value={form.interaction_type}
                onChange={(e) => update('interaction_type', e.target.value)}
              >
                <option>Meeting</option>
                <option>Call</option>
                <option>Email</option>
                <option>Conference</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">⌄</div>
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          <Field label="Date">
            <input type="date" className="w-full border border-gray-200 rounded-lg p-2.25 px-2.75 text-sm font-family text-gray-900 bg-white" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </Field>
          <Field label="Time">
            <input type="time" className="w-full border border-gray-200 rounded-lg p-2.25 px-2.75 text-sm font-family text-gray-900 bg-white" value={form.time} onChange={(e) => update('time', e.target.value)} />
          </Field>
        </div>

        <Field label="Attendees">
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg p-2.25 px-2.75 text-sm font-family text-gray-900 bg-white"
            placeholder="Enter names or search..."
            value={(form.attendees || []).join(', ')}
            onChange={(e) =>
              update(
                'attendees',
                e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </Field>

        <Field label="Topics Discussed">
          <textarea
            className="w-full border border-gray-200 rounded-lg p-2.25 px-2.75 text-sm font-family text-gray-900 bg-white resize-y min-h-16"
            placeholder="Enter key discussion points..."
            value={form.topics_discussed}
            onChange={(e) => update('topics_discussed', e.target.value)}
          />
        </Field>
        <button type="button" className="border border-gray-200 bg-gray-50 rounded-lg p-1.75 px-3 text-xs font-semibold cursor-pointer text-gray-900 -mt-1.5">
          🎙 Summarize from Voice Note (Requires Consent)
        </button>

        <div>
          <div className="text-xs font-semibold mb-2">Materials Shared / Samples Distributed</div>

          <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3 px-3.5 mb-2">
            <div>
              <div className="text-xs font-semibold mb-0.5">Materials Shared</div>
              {form.materials_shared.length === 0 ? (
                <div className="text-xs text-gray-500 italic">No materials added.</div>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {form.materials_shared.map((m) => (
                    <span className="bg-blue-100 text-blue-600 rounded-full px-2.5 py-0.75 text-xs font-semibold" key={m}>
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button type="button" className="border border-gray-200 bg-white rounded-lg p-1.75 px-3 text-xs font-semibold cursor-pointer text-gray-900 whitespace-nowrap hover:border-blue-500 hover:text-blue-500">
              🔍 Search/Add
            </button>
          </div>

          <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3 px-3.5">
            <div>
              <div className="text-xs font-semibold mb-0.5">Samples Distributed</div>
              {form.samples_distributed.length === 0 ? (
                <div className="text-xs text-gray-500 italic">No samples added.</div>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {form.samples_distributed.map((m) => (
                    <span className="bg-blue-100 text-blue-600 rounded-full px-2.5 py-0.75 text-xs font-semibold" key={m}>
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button type="button" className="border border-gray-200 bg-white rounded-lg p-1.75 px-3 text-xs font-semibold cursor-pointer text-gray-900 whitespace-nowrap hover:border-blue-500 hover:text-blue-500">
              📦 Add Sample
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold mb-2">Observed/Inferred HCP Sentiment</div>
          <div className="flex gap-5.5">
            {SENTIMENTS.map((s) => (
              <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer" key={s.value}>
                <input
                  type="radio"
                  name="sentiment"
                  className="accent-blue-600 w-3.75 h-3.75"
                  checked={form.sentiment === s.value}
                  onChange={() => update('sentiment', s.value)}
                />
                <span className="text-base">{s.emoji}</span>
                {s.value}
              </label>
            ))}
          </div>
        </div>

        <Field label="Outcomes">
          <textarea
            className="w-full border border-gray-200 rounded-lg p-2.25 px-2.75 text-sm font-family text-gray-900 bg-white resize-y min-h-16"
            placeholder="Key outcomes or agreements..."
            value={form.outcomes}
            onChange={(e) => update('outcomes', e.target.value)}
          />
        </Field>

        <Field label="Follow-up Actions">
          <textarea
            className="w-full border border-gray-200 rounded-lg p-2.25 px-2.75 text-sm font-family text-gray-900 bg-white resize-y min-h-16"
            placeholder="Enter next steps or tasks..."
            value={(form.follow_up_actions || []).join('\n')}
            onChange={(e) =>
              update(
                'follow_up_actions',
                e.target.value.split('\n').filter((s) => s.length > 0)
              )
            }
          />
        </Field>

        {/* AI Suggested Follow-ups - Clickable */}
        {form.ai_suggested_follow_ups && form.ai_suggested_follow_ups.length > 0 && (
          <div className="mt-1 text-xs">
            <div className="font-semibold mb-1.5 text-gray-900">AI Suggested Follow-ups:</div>
            <ul className="m-0 p-0 list-none flex flex-col gap-1">
              {form.ai_suggested_follow_ups.map((f, i) => (
                <li key={i}>
                  <button
                    className="bg-none border-none p-0 m-0 text-blue-600 no-underline cursor-pointer text-xs font-family text-left inline"
                    onClick={() => handleFollowUpClick(f)}
                  >
                    + {f}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-gray-500 italic text-xs">Click any suggestion to add it to Follow-up Actions</p>
          </div>
        )}
      </div>
    </div>
  )
}