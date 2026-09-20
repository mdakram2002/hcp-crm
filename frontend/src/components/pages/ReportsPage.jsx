import { useState } from 'react'
import { FiSearch, FiFilter, FiCalendar, FiUser, FiMessageSquare, FiMoreVertical, FiFileText, FiDownload } from 'react-icons/fi'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const dateOptions = ['All', 'Today', 'This Week', 'This Month', 'Last 3 Months']
  const statusOptions = ['All', 'Completed', 'In Progress', 'Pending', 'Cancelled']

  // Mock patient reports data
  const patientReports = [
    {
      id: 1,
      patientName: 'Patient Sarah Patel',
      reportType: 'Interaction Summary',
      date: 'Sep 20, 2026',
      hcpSpecialty: 'Cardiology',
      organization: 'City Hospital, Metro City',
      topics: 'Cardiovex efficacy, Safety profile, Dosing guidelines',
      sentiment: 'Positive',
      outcome: 'Interest in product',
      followUp: 'Follow up next week',
      status: 'Completed',
      materialsShared: ['Product brochure', 'Clinical data'],
      samplesDistributed: ['Cardiovex 10mg (5 packs)'],
    },
    {
      id: 2,
      patientName: 'Patient James Wilson',
      reportType: 'Interaction Summary',
      date: 'Sep 19, 2026',
      hcpSpecialty: 'Oncology',
      organization: 'Cancer Center, Westside',
      topics: 'Dosing guidelines, Patient outcomes',
      sentiment: 'Neutral',
      outcome: 'Requested more info',
      followUp: 'Send brochure',
      status: 'In Progress',
      materialsShared: ['Product information'],
      samplesDistributed: [],
    },
    {
      id: 3,
      patientName: 'Patient Emily Chen',
      reportType: 'Interaction Summary',
      date: 'Sep 18, 2026',
      hcpSpecialty: 'Neurology',
      organization: 'Neuro Institute, Downtown',
      topics: 'New product launch, Clinical trials',
      sentiment: 'Positive',
      outcome: 'Agreed to trial',
      followUp: 'Schedule demo',
      status: 'Completed',
      materialsShared: ['Demo kit', 'Trial protocol'],
      samplesDistributed: ['Sample pack A'],
    },
    {
      id: 4,
      patientName: 'Patient Michael Brown',
      reportType: 'Interaction Summary',
      date: 'Sep 15, 2026',
      hcpSpecialty: 'Pediatrics',
      organization: 'Children\'s Hospital, Eastside',
      topics: 'Product information, Pricing',
      sentiment: 'Neutral',
      outcome: 'Reviewing proposal',
      followUp: 'Follow up in 2 weeks',
      status: 'Pending',
      materialsShared: ['Pricing brochure'],
      samplesDistributed: [],
    },
    {
      id: 5,
      patientName: 'Patient Lisa Anderson',
      reportType: 'Interaction Summary',
      date: 'Sep 12, 2026',
      hcpSpecialty: 'Internal Medicine',
      organization: 'General Hospital, Northside',
      topics: 'Competitor comparison, Features',
      sentiment: 'Negative',
      outcome: 'No interest',
      followUp: 'None',
      status: 'Cancelled',
      materialsShared: [],
      samplesDistributed: [],
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

  const getStatusBadge = (status) => {
    const variants = {
      'Completed': 'success',
      'In Progress': 'warning',
      'Pending': 'info',
      'Cancelled': 'danger'
    }
    return variants[status] || 'info'
  }

  return (
    <div className="h-full p-6 overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Reports</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all patient reports and HCP interactions</p>
        </div>
        <Button variant="primary">
          <FiDownload className="mr-2" size={16} />
          Export Reports
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search patient reports by patient name, specialty, or topic..."
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
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Date:</span>
          {dateOptions.map((option) => (
            <button
              key={option}
              onClick={() => setDateFilter(option)}
              className={`px-3 py-1 rounded-full text-sm ${
                dateFilter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Status:</span>
          {statusOptions.map((option) => (
            <button
              key={option}
              onClick={() => setStatusFilter(option)}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Reports Table */}
      <Card className="h-[calc(100vh-320px)] overflow-hidden">
        <CardContent className="p-0 h-full overflow-hidden">
          <div className="h-full overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Report Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Topics</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sentiment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Outcome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patientReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiUser className="text-blue-600" size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.patientName}</p>
                          <p className="text-xs text-gray-500">{report.organization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FiFileText className="text-gray-400" size={14} />
                        <span className="text-sm text-gray-600">{report.reportType}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{report.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{report.hcpSpecialty}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{report.topics}</td>
                    <td className="px-4 py-3">
                      <Badge variant={getSentimentBadge(report.sentiment)}>
                        {report.sentiment}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{report.outcome}</td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadge(report.status)}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <FiMoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}