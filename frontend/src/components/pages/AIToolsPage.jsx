import { FiCpu, FiMic, FiSearch, FiTrendingUp, FiFileText, FiMessageSquare, FiZap } from 'react-icons/fi'
import { TfiLightBulb } from "react-icons/tfi";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/Card"
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export default function AIToolsPage() {
  const aiTools = [
    {
      icon: FiMessageSquare,
      name: 'AI Interaction Assistant',
      description: 'Get help logging interactions, extract information from natural language, and improve follow-up suggestions.',
      status: 'Active',
      color: 'blue',
    },
    {
      icon: FiMic,
      name: 'Voice Note Summarization',
      description: 'Convert voice notes into structured interaction data with topics, outcomes, and action items.',
      status: 'Active',
      color: 'purple',
    },
    {
      icon: TfiLightBulb,
      name: 'Follow-up Suggestions',
      description: 'AI-powered recommendations for next steps based on interaction context and HCP history.',
      status: 'Active',
      color: 'green',
    },
    {
      icon: FiSearch,
      name: 'Semantic Interaction Search',
      description: 'Find similar past interactions using natural language queries and semantic understanding.',
      status: 'Active',
      color: 'orange',
    },
    {
      icon: FiTrendingUp,
      name: 'Territory Summary',
      description: 'AI-generated insights about territory performance, rep activity, and HCP engagement patterns.',
      status: 'Active',
      color: 'indigo',
    },
    {
      icon: FiFileText,
      name: 'Interaction Classification',
      description: 'Automatically categorize interactions by type, outcome, and priority using machine learning.',
      status: 'Beta',
      color: 'pink',
    },
    {
      icon: FiZap,
      name: 'AI Insights',
      description: 'Discover patterns, opportunities, and risks in your interaction data with advanced analytics.',
      status: 'Coming Soon',
      color: 'gray',
    },
    {
      icon: FiCpu,
      name: 'HCP Intelligence',
      description: 'Comprehensive AI analysis of HCP behavior, preferences, and engagement patterns.',
      status: 'Coming Soon',
      color: 'cyan',
    },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      pink: 'bg-pink-100 text-pink-600',
      gray: 'bg-gray-100 text-gray-600',
      cyan: 'bg-cyan-100 text-cyan-600',
    }
    return colors[color] || colors.blue
  }

  const getStatusBadge = (status) => {
    if (status === 'Active') return 'success'
    if (status === 'Beta') return 'warning'
    return 'info'
  }

  return (
    <div className="h-full p-6 overflow-hidden">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Tools</h1>
        <p className="text-sm text-gray-500 mt-1">Powered AI capabilities to enhance your HCP engagement</p>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-120px)] overflow-y-auto">
        {aiTools.map((tool, index) => {
          const Icon = tool.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-12 h-12 ${getColorClasses(tool.color)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                      <Badge variant={getStatusBadge(tool.status)}>
                        {tool.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
                  </div>
                </div>
                <Button 
                  variant={tool.status === 'Coming Soon' ? 'secondary' : 'primary'} 
                  className="w-full mt-3"
                  disabled={tool.status === 'Coming Soon'}
                >
                  {tool.status === 'Coming Soon' ? 'Coming Soon' : 'Launch Tool'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}