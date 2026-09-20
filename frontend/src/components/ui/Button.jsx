export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-transparent',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200',
    success: 'bg-green-600 text-white hover:bg-green-700 border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}