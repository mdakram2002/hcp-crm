import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hcp_name: '',
  hcp_id: null,
  interaction_type: 'Meeting',
  date: new Date().toISOString().slice(0, 10),
  time: new Date().toTimeString().slice(0, 5),
  attendees: [],
  topics_discussed: '',
  materials_shared: [],
  samples_distributed: [],
  sentiment: 'Neutral',
  outcomes: '',
  follow_up_actions: [],
  ai_suggested_follow_ups: [],
}

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    // Applied whenever the AI Assistant returns field_updates - this is the ONLY
    // way the form is meant to be populated per the assignment ("do not fill the
    // form manually"). Manual field components are still wired up for the
    // "structured form" fallback the spec also requires, but the primary flow is AI-driven.
    mergeFields(state, action) {
      const updates = action.payload || {}
      Object.entries(updates).forEach(([key, value]) => {
        if (key in state && value !== undefined && value !== null) {
          state[key] = value
        }
      })
    },
    setField(state, action) {
      const { field, value } = action.payload
      state[field] = value
    },
    addFollowUpAction(state, action) {
      state.follow_up_actions.push(action.payload)
    },
    resetForm() {
      return { ...initialState, date: new Date().toISOString().slice(0, 10) }
    },
  },
})

export const { mergeFields, setField, addFollowUpAction, resetForm } = interactionSlice.actions
export default interactionSlice.reducer
