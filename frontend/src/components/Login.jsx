import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, loginAsGuest, fetchCurrentUser } from '../api/client'
import { setAuth } from '../store/authSlice'
import AuthLayout from './auth/AuthLayout'
import AuthBrandPanel from './auth/AuthBrandPanel'
import AuthInput from './auth/AuthInput'
import PasswordInput from './auth/PasswordInput'
import AuthDivider from './auth/AuthDivider'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
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
      // Create a local guest user without backend authentication
      const guestUser = {
        id: 'guest-' + Date.now(),
        email: 'guest@local',
        role: 'guest',
        name: 'Guest User'
      }
      
      // Store guest data locally
      window.localStorage.setItem('hcp_crm_guest_user', JSON.stringify(guestUser))
      window.localStorage.setItem('hcp_crm_is_guest', 'true')
      
      // Set auth state with guest user
      dispatch(setAuth({ token: 'guest-token', user: guestUser }))
      navigate('/')
    } catch (err) {
      setError('Unable to sign in as a guest right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <AuthBrandPanel />
      <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your HCP CRM account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <AuthInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <PasswordInput
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isSubmitting}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Signing in...' : 'Login as Guest'}
            </button>
          </form>

          <AuthDivider text="Or continue with" />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
