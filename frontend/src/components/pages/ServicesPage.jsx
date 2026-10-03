import { Link } from 'react-router-dom'
import { FiHeart, FiCalendar, FiActivity, FiMessageSquare, FiFileText, FiBarChart, FiClock, FiCheckCircle, FiShield } from 'react-icons/fi'

export default function ServicesPage() {
  const services = [
    {
      icon: FiCalendar,
      title: 'Interaction Scheduling',
      description: 'Plan and schedule meetings, calls, and visits with healthcare professionals efficiently.',
      features: ['Calendar integration', 'Automated reminders', 'Multi-user scheduling']
    },
    {
      icon: FiActivity,
      title: 'Engagement Tracking',
      description: 'Track all interactions and activities with HCPs to maintain comprehensive relationship records.',
      features: ['Activity logging', 'Interaction history', 'Notes and documentation']
    },
    {
      icon: FiMessageSquare,
      title: 'Communication Management',
      description: 'Manage all communications with healthcare professionals through a unified platform.',
      features: ['Email integration', 'Message templates', 'Follow-up tracking']
    },
    {
      icon: FiFileText,
      title: 'Compliance Documentation',
      description: 'Ensure all interactions meet regulatory requirements with built-in compliance tools.',
      features: ['Automated compliance checks', 'Document storage', 'Audit trails']
    },
    {
      icon: FiBarChart,
      title: 'Analytics & Reporting',
      description: 'Gain insights into your HCP relationships with comprehensive analytics and reports.',
      features: ['Custom dashboards', 'Performance metrics', 'Trend analysis']
    },
    {
      icon: FiClock,
      title: 'Territory Management',
      description: 'Optimize your territory planning and resource allocation for maximum impact.',
      features: ['Territory mapping', 'Route optimization', 'Resource allocation']
    }
  ]

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiHeart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HCP CRM</h1>
                <p className="text-xs text-gray-500">Better Relationships. Healthier Outcomes.</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium text-sm">
                Sign In
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive tools designed specifically for healthcare professional relationship management
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose HCP CRM?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Industry Specific</h3>
              <p className="text-sm text-gray-600">Built specifically for healthcare professional relationship management</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compliance Ready</h3>
              <p className="text-sm text-gray-600">Built-in compliance features to meet regulatory requirements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiActivity className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-sm text-gray-600">Intuitive interface designed for healthcare professionals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBarChart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Driven</h3>
              <p className="text-sm text-gray-600">Powerful analytics to inform your relationship strategies</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your HCP Relationships?</h3>
          <p className="text-blue-100 mb-8 text-lg">Start using our comprehensive platform today.</p>
          <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block">
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiHeart className="w-5 h-5" />
              </div>
              <span className="font-semibold">HCP CRM</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-gray-400">© 2024 HCP CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
