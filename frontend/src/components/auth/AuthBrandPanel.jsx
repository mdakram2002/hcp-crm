import { FiHeart, FiCalendar, FiActivity, FiCheck } from 'react-icons/fi'

export default function AuthBrandPanel() {
  const features = [
    'Manage HCP relationships',
    'Track interactions & activities',
    'Stay compliant with regulations',
    'Improve engagement & outcomes'
  ]

  return (
    <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 flex flex-col justify-between text-white">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <FiHeart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">HCP CRM</h1>
            <p className="text-blue-100 text-sm">Better Relationships. Healthier Outcomes.</p>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-2 gap-6 mt-12">
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <FiCalendar className="w-8 h-8 mb-3 text-blue-200" />
            <h3 className="font-semibold mb-1">Schedule</h3>
            <p className="text-blue-100 text-sm">Plan and track your activities</p>
          </div>
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <FiActivity className="w-8 h-8 mb-3 text-blue-200" />
            <h3 className="font-semibold mb-1">Engage</h3>
            <p className="text-blue-100 text-sm">Build stronger relationships</p>
          </div>
        </div>
      </div>

      <div className="mt-8 lg:mt-0">
        <h3 className="font-semibold mb-4 text-lg">Key Features</h3>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <FiCheck className="w-5 h-5 text-blue-200 mt-0.5 flex-shrink-0" />
              <span className="text-blue-100">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
