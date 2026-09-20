import { useState } from 'react'
import { FiUser, FiBell, FiCpu, FiShield, FiUsers as FiUsersIcon, FiLock } from 'react-icons/fi'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'ai', label: 'AI Preferences', icon: FiCpu },
    { id: 'security', label: 'Security', icon: FiShield },
  ]

  return (
    <div className="h-full p-6 overflow-hidden">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-140px)]">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'profile' && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)] overflow-y-auto">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-blue-600" size={32} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">John Doe</h3>
                      <p className="text-sm text-gray-500">Field Representative</p>
                      <Button variant="secondary" size="sm" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <Input defaultValue="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <Input defaultValue="Doe" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input defaultValue="john.doe@example.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input defaultValue="+1 (555) 123-4567" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <Input defaultValue="Field Representative" disabled />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="primary">Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)] overflow-y-auto">
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications for new interactions', checked: true },
                    { label: 'Push notifications for follow-up reminders', checked: true },
                    { label: 'Weekly activity summary', checked: false },
                    { label: 'AI insight alerts', checked: true },
                    { label: 'Territory performance updates', checked: false },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{item.label}</span>
                      <button
                        className={`w-12 h-6 rounded-full transition-colors ${
                          item.checked ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            item.checked ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'ai' && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>AI Preferences</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Groq Llama 3.3 70B (Recommended)</option>
                      <option>Groq Gemma 2 9B</option>
                      <option>OpenAI GPT-4</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Response Length</label>
                    <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Concise</option>
                      <option>Balanced</option>
                      <option>Detailed</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Auto-apply AI suggestions</p>
                      <p className="text-xs text-gray-500">Automatically apply AI-generated field updates</p>
                    </div>
                    <button className="w-12 h-6 bg-blue-600 rounded-full">
                      <div className="w-5 h-5 bg-white rounded-full shadow translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Voice note processing</p>
                      <p className="text-xs text-gray-500">Enable AI voice-to-text conversion</p>
                    </div>
                    <button className="w-12 h-6 bg-blue-600 rounded-full">
                      <div className="w-5 h-5 bg-white rounded-full shadow translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Semantic search</p>
                      <p className="text-xs text-gray-500">Enable AI-powered interaction search</p>
                    </div>
                    <button className="w-12 h-6 bg-gray-300 rounded-full">
                      <div className="w-5 h-5 bg-white rounded-full shadow translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <Input type="password" placeholder="Enter current password" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <FiShield className="text-yellow-600 mt-0.5" size={20} />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">Password Requirements</p>
                        <ul className="text-xs text-yellow-800 mt-1 space-y-1">
                          <li>• Minimum 8 characters</li>
                          <li>• At least one uppercase letter</li>
                          <li>• At least one number</li>
                          <li>• At least one special character</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two-factor authentication</p>
                      <p className="text-xs text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Badge variant="info">Not Enabled</Badge>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="primary">Update Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}