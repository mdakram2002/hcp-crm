import { ReactNode } from 'react'

export default function AuthLayout({ children }) {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">
        <div className="flex flex-col lg:flex-row h-full">
          {children}
        </div>
      </div>
    </div>
  )
}
