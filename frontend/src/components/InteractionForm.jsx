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
    <div className="field">
      <label>{label}</label>
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
    <div className="panel">
      <div className="panel-header">Interaction Details</div>
      <div className="form-body">
        <div className="form-row">
          <Field label="HCP Name">
            <div className="autocomplete-wrap">
              <input
                type="text"
                className={inputClassName}
                placeholder="Search or select HCP..."
                value={hcpQuery}
                onChange={(e) => handleHcpInputChange(e.target.value)}
                onFocus={() => hcpQuery.trim() && setShowHcpOptions(true)}
                onBlur={() => window.setTimeout(() => setShowHcpOptions(false), 120)}
              />
              {showHcpOptions && hcpOptions.length > 0 && (
                <div className="autocomplete-list">
                  {hcpOptions.map((option) => (
                    <button
                      type="button"
                      className="autocomplete-item"
                      key={option.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleHcpSelect(option)}
                    >
                      <span>{option.name}</span>
                      {option.institution && <small>{option.institution}</small>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>
          <Field label="Interaction Type">
            <div className="select-wrap">
              <select
                value={form.interaction_type}
                onChange={(e) => update('interaction_type', e.target.value)}
              >
                <option>Meeting</option>
                <option>Call</option>
                <option>Email</option>
                <option>Conference</option>
              </select>
            </div>
          </Field>
        </div>

        <div className="form-row">
          <Field label="Date">
            <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </Field>
          <Field label="Time">
            <input type="time" value={form.time} onChange={(e) => update('time', e.target.value)} />
          </Field>
        </div>

        <Field label="Attendees">
          <input
            type="text"
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
            placeholder="Enter key discussion points..."
            value={form.topics_discussed}
            onChange={(e) => update('topics_discussed', e.target.value)}
          />
        </Field>
        <button type="button" className="voice-btn">
          🎙 Summarize from Voice Note (Requires Consent)
        </button>

        <div>
          <div className="section-label">Materials Shared / Samples Distributed</div>

          <div className="materials-row">
            <div>
              <div className="materials-title">Materials Shared</div>
              {form.materials_shared.length === 0 ? (
                <div className="materials-empty">No materials added.</div>
              ) : (
                <div className="chip-list">
                  {form.materials_shared.map((m) => (
                    <span className="chip" key={m}>
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button type="button" className="btn-outline">
              🔍 Search/Add
            </button>
          </div>

          <div className="materials-row">
            <div>
              <div className="materials-title">Samples Distributed</div>
              {form.samples_distributed.length === 0 ? (
                <div className="materials-empty">No samples added.</div>
              ) : (
                <div className="chip-list">
                  {form.samples_distributed.map((m) => (
                    <span className="chip" key={m}>
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button type="button" className="btn-outline">
              📦 Add Sample
            </button>
          </div>
        </div>

        <div>
          <div className="section-label">Observed/Inferred HCP Sentiment</div>
          <div className="sentiment-group">
            {SENTIMENTS.map((s) => (
              <label className="sentiment-option" key={s.value}>
                <input
                  type="radio"
                  name="sentiment"
                  checked={form.sentiment === s.value}
                  onChange={() => update('sentiment', s.value)}
                />
                <span className="emoji">{s.emoji}</span>
                {s.value}
              </label>
            ))}
          </div>
        </div>

        <Field label="Outcomes">
          <textarea
            placeholder="Key outcomes or agreements..."
            value={form.outcomes}
            onChange={(e) => update('outcomes', e.target.value)}
          />
        </Field>

        <Field label="Follow-up Actions">
          <textarea
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
          <div className="suggested-followups">
            <div className="heading">AI Suggested Follow-ups:</div>
            <ul>
              {form.ai_suggested_follow_ups.map((f, i) => (
                <li key={i}>
                  <button
                    className="follow-up-link"
                    onClick={() => handleFollowUpClick(f)}
                  >
                    + {f}
                  </button>
                </li>
              ))}
            </ul>
            <p className="hint">Click any suggestion to add it to Follow-up Actions</p>
          </div>
        )}
      </div>
    </div>
  )
}