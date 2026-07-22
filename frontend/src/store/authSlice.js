import { createSlice } from '@reduxjs/toolkit'

const initialToken = typeof window !== 'undefined' ? window.localStorage.getItem('hcp_crm_token') : null
const initialUser = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('hcp_crm_user') || 'null') : null

const initialState = {
  token: initialToken || null,
  user: initialUser || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.token = action.payload.token
      state.user = action.payload.user
      if (typeof window !== 'undefined') {
        if (action.payload.token) {
          window.localStorage.setItem('hcp_crm_token', action.payload.token)
        } else {
          window.localStorage.removeItem('hcp_crm_token')
        }
        if (action.payload.user) {
          window.localStorage.setItem('hcp_crm_user', JSON.stringify(action.payload.user))
        } else {
          window.localStorage.removeItem('hcp_crm_user')
        }
      }
    },
    clearAuth(state) {
      state.token = null
      state.user = null
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('hcp_crm_token')
        window.localStorage.removeItem('hcp_crm_user')
      }
    },
  },
})

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
