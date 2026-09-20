import { FiUser, FiMail, FiPhone, FiBriefcase, FiMapPin } from 'react-icons/fi'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'

export default function HCPDetailsPanel({ hcp }) {
  if (!hcp) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-gray-500 text-sm">No HCP selected</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>HCP Details</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FiUser size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{hcp.name}</h3>
            <p className="text-sm text-gray-500">{hcp.specialty || 'No specialty'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FiBriefcase size={16} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Institution</p>
              <p className="text-sm text-gray-900">{hcp.institution || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiMail size={16} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{hcp.email || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiPhone size={16} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm text-gray-900">{hcp.phone || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiMapPin size={16} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm text-gray-900">Not specified</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Total Interactions</p>
          <p className="text-2xl font-bold text-blue-600">{hcp.interaction_count || 0}</p>
        </div>
      </CardContent>
    </Card>
  )
}