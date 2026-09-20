import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import AuthInput from './AuthInput'

export default function PasswordInput({ error, ...props }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthInput
      type={showPassword ? 'text' : 'password'}
      error={error}
      rightElement={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
        </button>
      }
      {...props}
    />
  )
}
