import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [
    {
      role: 'assistant',
      text:
        'Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.',
    },
  ],
  isLoading: false,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload)
    },
    setLoading(state, action) {
      state.isLoading = action.payload
    },
  },
})

export const { addMessage, setLoading } = chatSlice.actions
export default chatSlice.reducer
