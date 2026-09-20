export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`}
      {...props}
    />
  )
}

export function TextArea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${className}`}
      {...props}
    />
  )
}

export function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}