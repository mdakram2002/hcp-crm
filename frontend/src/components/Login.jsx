import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, loginAsGuest, fetchCurrentUser } from '../api/client'
import { setAuth } from '../store/authSlice'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const tokenData = await loginUser({ email, password })
      // Save token to localStorage immediately so fetchCurrentUser can use it
      window.localStorage.setItem('hcp_crm_token', tokenData.access_token)
      const user = await fetchCurrentUser()
      dispatch(setAuth({ token: tokenData.access_token, user }))
      navigate('/')
    } catch (err) {
      setError('Unable to sign in. Please check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGuestLogin = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      const tokenData = await loginAsGuest()
      // Save token to localStorage immediately so fetchCurrentUser can use it
      window.localStorage.setItem('hcp_crm_token', tokenData.access_token)
      const user = await fetchCurrentUser()
      dispatch(setAuth({ token: tokenData.access_token, user }))
      navigate('/')
    } catch (err) {
      setError('Unable to sign in as a guest right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="panel auth-panel">
        <div className="panel-header">Sign in</div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-actions">
            <button className="btn-primary" type="submit" disabled={isSubmitting}>Login</button>
            <button className="btn-secondary" type="button" onClick={handleGuestLogin} disabled={isSubmitting}>Login as guest</button>
          </div>
          <div className="auth-divider">or</div>
          <div className="auth-link-row">
            <span>Need an account?</span>
            <Link to="/register">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
