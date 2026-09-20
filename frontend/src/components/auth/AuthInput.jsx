import { forwardRef } from 'react'
import { FiUser, FiMail, FiLock } from 'react-icons/fi'

const AuthInput = forwardRef(({ 
  type = 'text', 
  placeholder, 
  icon, 
  error, 
  rightElement,
  className = '',
  ...props 
}, ref) => {
  const getIcon = () => {
    if (icon) return icon
    switch (type) {
      case 'email':
        return <FiMail className="w-5 h-5 text-gray-400" />
      case 'password':
        return <FiLock className="w-5 h-5 text-gray-400" />
      default:
        return <FiUser className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {getIcon()}
      </div>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'} rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
        {...props}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {rightElement}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
})

AuthInput.displayName = 'AuthInput'

export default AuthInput
