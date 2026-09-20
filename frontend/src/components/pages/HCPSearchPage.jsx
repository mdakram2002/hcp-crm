import { useState } from 'react'
import { FiSearch, FiFilter, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'

export default function HCPSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')

  const specialties = ['All', 'Cardiology', 'Oncology', 'Neurology', 'Pediatrics', 'Internal Medicine']
  const locations = ['All', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']

  // Mock HCP data
  const hcps = [
    {
      id: 1,
      name: 'Dr. Sarah Patel',
      specialty: 'Cardiology',
      organization: 'City Hospital, Metro City',
      location: 'New York',
      lastInteraction: 'Sep 20, 2026',
      sentiment: 'Positive',
      followUpStatus: 'Scheduled'
    },
    {
      id: 2,
      name: 'Dr. James Wilson',
      specialty: 'Oncology',
      organization: 'Cancer Center, Westside',
      location: 'Los Angeles',
      lastInteraction: 'Sep 18, 2026',
      sentiment: 'Neutral',
      followUpStatus: 'Pending'
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      specialty: 'Neurology',
      organization: 'Neuro Institute, Downtown',
      location: 'Chicago',
      lastInteraction: 'Sep 15, 2026',
      sentiment: 'Positive',
      followUpStatus: 'Completed'
    },
    {
      id: 4,
      name: 'Dr. Michael Brown',
      specialty: 'Pediatrics',
      organization: 'Children\'s Hospital, Eastside',
      location: 'Houston',
      lastInteraction: 'Sep 12, 2026',
      sentiment: 'Neutral',
      followUpStatus: 'None'
    },
  ]

  const getSentimentBadge = (sentiment) => {
    const variants = {
      'Positive': 'success',
      'Neutral': 'info',
      'Negative': 'danger'
    }
    return variants[sentiment] || 'info'
  }

  return (
    <div className="h-full p-6 overflow-hidden">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">HCP Search</h1>
        <p className="text-sm text-gray-500 mt-1">Search and manage healthcare professional profiles</p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search HCPs by name, specialty, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary">
          <FiFilter className="mr-2" size={16} />
          Filters
        </Button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Specialty:</span>
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedSpecialty === specialty
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* HCP Results Grid */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-320px)] overflow-y-auto">
        {hcps.map((hcp) => (
          <Card key={hcp.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{hcp.name}</h3>
                    <p className="text-sm text-gray-500">{hcp.specialty}</p>
                  </div>
                </div>
                <Badge variant={getSentimentBadge(hcp.sentiment)}>
                  {hcp.sentiment}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMapPin size={14} className="text-gray-400" />
                  {hcp.organization}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail size={14} className="text-gray-400" />
                  {hcp.location}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-500">Last interaction:</span>
                  <span className="text-gray-900 ml-1">{hcp.lastInteraction}</span>
                </div>
                <Badge variant={hcp.followUpStatus === 'Scheduled' ? 'warning' : hcp.followUpStatus === 'Completed' ? 'success' : 'info'}>
                  {hcp.followUpStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}