import React, { useState } from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { Input } from '../components/ui/Input'
import { useToast } from '../components/ui/Toast'
import { mockCurrentUser } from '../data/mockData'
import { Settings, ShieldCheck, User, Bell, Sliders } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast()
  const [defaultLanguage, setDefaultLanguage] = useState('Tamil')
  const [defaultReadingLevel, setDefaultReadingLevel] = useState('Simple')
  const [confidenceThreshold, setConfidenceThreshold] = useState('95')

  const handleSave = () => {
    showToast('Settings Saved', 'CareBrief clinical preferences updated successfully.', 'success')
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <PageHeader
        title="Clinical Platform Settings"
        subtitle="Manage default summary adaptation targets, factual guardrails, and reviewer preferences."
      />

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-slate-700" />
            Clinician Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Clinician Name" value={mockCurrentUser.name} readOnly />
          <Input label="Role" value={mockCurrentUser.role} readOnly />
          <Input label="Department" value={mockCurrentUser.department} readOnly />
          <Input label="Hospital System" value={mockCurrentUser.hospital} readOnly />
        </CardContent>
      </Card>

      {/* AI & Verification Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-600" />
            AI Generation & Literacy Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Default Target Language"
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              options={[
                { value: 'Tamil', label: 'Tamil' },
                { value: 'Spanish', label: 'Spanish' },
                { value: 'Hindi', label: 'Hindi' },
                { value: 'English', label: 'English' }
              ]}
            />
            <Select
              label="Default Target Reading Level"
              value={defaultReadingLevel}
              onChange={(e) => setDefaultReadingLevel(e.target.value)}
              options={[
                { value: 'Simple', label: 'Simple (Grade 5-6)' },
                { value: 'Very Simple (Grade 3-5)', label: 'Very Simple (Grade 3-5)' },
                { value: 'Visual/Bullet Focus', label: 'Visual/Bullet Focus' }
              ]}
            />
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Factual Verification Threshold: {confidenceThreshold}%</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              CareBrief AI will flag any generated claim with less than {confidenceThreshold}% match confidence against the physician's note for mandatory manual signoff.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
