import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, fetchCurrentUser } from '../api/client'
import { setAuth } from '../store/authSlice'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const tokenData = await loginUser({ email, password })
      const user = await fetchCurrentUser()
      dispatch(setAuth({ token: tokenData.access_token, user }))
      navigate('/')
    } catch (err) {
      setError('Unable to sign in. Please check your credentials.')
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
          <button className="btn-primary" type="submit">Login</button>
          <div className="auth-link-row">
            <span>Need an account?</span>
            <Link to="/register">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
