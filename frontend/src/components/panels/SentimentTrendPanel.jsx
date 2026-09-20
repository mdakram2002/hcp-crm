import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiTrendingUp } from 'react-icons/fi'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'

export default function SentimentTrendPanel({ sentimentData }) {
  const chartData = sentimentData || [
    { month: 'Jan', positive: 8, neutral: 4, negative: 1 },
    { month: 'Feb', positive: 12, neutral: 3, negative: 2 },
    { month: 'Mar', positive: 10, neutral: 5, negative: 1 },
    { month: 'Apr', positive: 15, neutral: 4, negative: 2 },
    { month: 'May', positive: 18, neutral: 3, negative: 1 },
    { month: 'Jun', positive: 20, neutral: 4, negative: 1 },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sentiment Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)] overflow-y-auto">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="positive" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                name="Positive"
              />
              <Line 
                type="monotone" 
                dataKey="neutral" 
                stroke="#6b7280" 
                strokeWidth={2}
                dot={{ fill: '#6b7280', r: 4 }}
                name="Neutral"
              />
              <Line 
                type="monotone" 
                dataKey="negative" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                name="Negative"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">{chartData.reduce((sum, d) => sum + d.positive, 0)}</p>
            <p className="text-xs text-gray-500">Positive</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-600">{chartData.reduce((sum, d) => sum + d.neutral, 0)}</p>
            <p className="text-xs text-gray-500">Neutral</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <p className="text-lg font-bold text-red-600">{chartData.reduce((sum, d) => sum + d.negative, 0)}</p>
            <p className="text-xs text-gray-500">Negative</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}