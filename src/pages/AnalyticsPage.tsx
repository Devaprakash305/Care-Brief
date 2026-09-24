import React from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatsCard } from '../components/dashboard/StatsCard'
import { BarChart3, TrendingUp, ShieldCheck, Clock, Globe2, BookOpen } from 'lucide-react'

export const AnalyticsPage: React.FC = () => {
  const languageData = [
    { name: 'Tamil', count: 42, percentage: 33 },
    { name: 'Spanish', count: 35, percentage: 27 },
    { name: 'Hindi', count: 22, percentage: 17 },
    { name: 'English', count: 15, percentage: 12 },
    { name: 'Mandarin', count: 8, percentage: 6 },
    { name: 'Others', count: 6, percentage: 5 }
  ]

  const readabilityDistribution = [
    { grade: 'Grade 3-5 (Very Simple)', percentage: 54 },
    { grade: 'Grade 6-7 (Simple)', percentage: 34 },
    { grade: 'Grade 8-9 (Standard)', percentage: 12 }
  ]

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Impact & Readability Analytics"
        subtitle="Quantitative metrics measuring health literacy improvement and factual safety."
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Avg Grade Level Reduction"
          value="13.8 → 5.2"
          subtitle="-8.6 grade points improved"
          trend="+34%"
          accentColor="teal"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          title="Factual Consistency Rate"
          value="99.4%"
          subtitle="Zero hallucination errors"
          trend="+0.4%"
          accentColor="emerald"
          icon={<ShieldCheck className="w-5 h-5" />}
        />
        <StatsCard
          title="Time Saved per Summary"
          value="14.5 mins"
          subtitle="Reduced from 18m to 3.5m"
          trend="+78%"
          accentColor="blue"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatsCard
          title="Languages Supported"
          value="8 Languages"
          subtitle="Top: Tamil, Spanish, Hindi"
          accentColor="amber"
          icon={<Globe2 className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-teal-600" />
              Patient Language Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {languageData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{item.name}</span>
                  <span className="text-slate-500">{item.count} patients ({item.percentage}%)</span>
                </div>
                <ProgressBar value={item.percentage} variant="primary" showValueLabel={false} size="sm" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Readability Target Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Simplified Reading Level Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {readabilityDistribution.map((item) => (
              <div key={item.grade} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{item.grade}</span>
                  <span className="text-emerald-700 font-bold">{item.percentage}%</span>
                </div>
                <ProgressBar value={item.percentage} variant="success" showValueLabel={false} size="md" />
              </div>
            ))}

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
              <h4 className="font-bold text-slate-900">Why FKGL Readability Index Matters</h4>
              <p className="text-slate-600 leading-relaxed">
                Standard EHR discharge summaries are written at a college reading level (FKGL 13+), leading to 40% patient non-compliance. CareBrief AI targets Grade 5 comprehension, dramatically improving medication adherence.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
