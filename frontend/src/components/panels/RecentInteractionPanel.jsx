import { FiClock, FiMessageSquare, FiCalendar } from 'react-icons/fi'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'

export default function RecentInteractionPanel({ interaction }) {
  if (!interaction) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-gray-500 text-sm">No recent interaction</div>
        </CardContent>
      </Card>
    )
  }

  const getSentimentBadge = (sentiment) => {
    const variants = {
      'Positive': 'success',
      'Negative': 'danger',
      'Neutral': 'info'
    }
    return variants[sentiment] || 'info'
  }

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return '🙂'
      case 'Negative': return '🙁'
      default: return '😐'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Interaction</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">{interaction.date || 'No date'}</span>
          <Badge variant={getSentimentBadge(interaction.sentiment)}>
            {getSentimentEmoji(interaction.sentiment)} {interaction.sentiment || 'Neutral'}
          </Badge>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <FiCalendar size={14} className="text-gray-400" />
            <span className="font-medium">{interaction.interaction_type || 'Meeting'}</span>
          </div>
        </div>

        {interaction.topics_discussed && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Topics Discussed</p>
            <p className="text-sm text-gray-900 line-clamp-3">{interaction.topics_discussed}</p>
          </div>
        )}

        {interaction.outcomes && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Outcomes</p>
            <p className="text-sm text-gray-900 line-clamp-2">{interaction.outcomes}</p>
          </div>
        )}

        {interaction.materials_shared && interaction.materials_shared.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Materials Shared</p>
            <div className="flex flex-wrap gap-1">
              {interaction.materials_shared.map((material, index) => (
                <span key={index} className="bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 text-xs">
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}

        {interaction.attendees && interaction.attendees.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Attendees</p>
            <div className="flex items-center gap-2">
              <FiMessageSquare size={14} className="text-gray-400" />
              <p className="text-sm text-gray-900">{interaction.attendees.join(', ')}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}