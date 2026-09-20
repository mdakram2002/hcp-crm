import { useState } from 'react'
import { FiSearch, FiFilter, FiCalendar, FiUser, FiMessageSquare, FiMoreVertical } from 'react-icons/fi'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'

export default function InteractionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('All')
  const [sentimentFilter, setSentimentFilter] = useState('All')

  const dateOptions = ['All', 'Today', 'This Week', 'This Month', 'Last 3 Months']
  const sentimentOptions = ['All', 'Positive', 'Neutral', 'Negative']

  // Mock interaction data
  const interactions = [
    {
      id: 1,
      hcp: 'Dr. Sarah Patel',
      date: 'Sep 20, 2026',
      type: 'Meeting',
      topics: 'Cardiovex efficacy, Safety profile',
      sentiment: 'Positive',
      outcome: 'Interest in product',
      followUp: 'Follow up next week',
      status: 'Logged'
    },
    {
      id: 2,
      hcp: 'Dr. James Wilson',
      date: 'Sep 19, 2026',
      type: 'Call',
      topics: 'Dosing guidelines, Patient outcomes',
      sentiment: 'Neutral',
      outcome: 'Requested more info',
      followUp: 'Send brochure',
      status: 'Logged'
    },
    {
      id: 3,
      hcp: 'Dr. Emily Chen',
      date: 'Sep 18, 2026',
      type: 'Conference',
      topics: 'New product launch, Clinical trials',
      sentiment: 'Positive',
      outcome: 'Agreed to trial',
      followUp: 'Schedule demo',
      status: 'Logged'
    },
    {
      id: 4,
      hcp: 'Dr. Michael Brown',
      date: 'Sep 15, 2026',
      type: 'Email',
      topics: 'Product information, Pricing',
      sentiment: 'Neutral',
      outcome: 'Reviewing proposal',
      followUp: 'Follow up in 2 weeks',
      status: 'Draft'
    },
    {
      id: 5,
      hcp: 'Dr. Lisa Anderson',
      date: 'Sep 12, 2026',
      type: 'Meeting',
      topics: 'Competitor comparison, Features',
      sentiment: 'Negative',
      outcome: 'No interest',
      followUp: 'None',
      status: 'Logged'
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
    return status === 'Logged' ? 'success' : 'warning'
  }

  return (
    <div className="h-full p-6 overflow-hidden">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Interactions</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all HCP interactions</p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search interactions by HCP, topic, or outcome..."
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
          <span className="text-sm text-gray-500">Sentiment:</span>
          {sentimentOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSentimentFilter(option)}
              className={`px-3 py-1 rounded-full text-sm ${
                sentimentFilter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Interactions Table */}
      <Card className="h-[calc(100vh-320px)] overflow-hidden">
        <CardContent className="p-0 h-full overflow-hidden">
          <div className="h-full overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">HCP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Topics</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sentiment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Outcome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Follow-up</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {interactions.map((interaction) => (
                  <tr key={interaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiUser className="text-blue-600" size={14} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{interaction.hcp}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{interaction.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{interaction.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{interaction.topics}</td>
                    <td className="px-4 py-3">
                      <Badge variant={getSentimentBadge(interaction.sentiment)}>
                        {interaction.sentiment}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{interaction.outcome}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{interaction.followUp}</td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadge(interaction.status)}>
                        {interaction.status}
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