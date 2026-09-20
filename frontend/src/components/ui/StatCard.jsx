import { Card, CardContent } from './Card'

export function StatCard({ title, value, change, trend = 'up', icon, className = '' }) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className={`text-xs font-medium mt-1 ${trendColor}`}>
                {trendIcon} {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-2 bg-blue-50 rounded-lg">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}