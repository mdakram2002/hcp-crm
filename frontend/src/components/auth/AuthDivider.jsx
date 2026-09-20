export default function AuthDivider({ text = 'OR' }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-gray-500 text-xs font-medium uppercase tracking-wider">
          {text}
        </span>
      </div>
    </div>
  )
}
