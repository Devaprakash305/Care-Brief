import React, { useEffect, useState } from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { StatsCard } from '../components/dashboard/StatsCard'
import { QuickActions } from '../components/dashboard/QuickActions'
import { RecentSummariesTable } from '../components/dashboard/RecentSummariesTable'
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline'
import { LoadingState } from '../components/common/LoadingState'
import { summaryService } from '../services/supabaseSummaryService'
import { DashboardStats, DischargeSummary, ActivityLog, UserProfile } from '../types'
import { FileText, Clock, CheckCircle2, TrendingUp, Sparkles, Filter } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [summaries, setSummaries] = useState<DischargeSummary[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      try {
        const results = await Promise.allSettled([
          summaryService.getCurrentUser(),
          summaryService.getDashboardStats(),
          summaryService.getRecentSummaries(6),
          summaryService.getActivityTimeline()
        ])

        const [userResult, statsResult, summariesResult, activitiesResult] = results
        if (userResult.status === 'fulfilled') setCurrentUser(userResult.value)
        if (statsResult.status === 'fulfilled') setStats(statsResult.value)
        if (summariesResult.status === 'fulfilled') setSummaries(summariesResult.value)
        if (activitiesResult.status === 'fulfilled') setActivities(activitiesResult.value)

        results.forEach((result) => {
          if (result.status === 'rejected') console.error('Dashboard data request failed:', result.reason)
        })
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="py-12">
        <LoadingState title="Loading Clinical Dashboard..." description="Fetching patient summaries, factual verification logs, and queue metrics." />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Morning Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Clinical Discharge Assistant Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Clinical dashboard, {currentUser?.name || 'Clinician'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Review and prepare patient-friendly discharge instructions. Convert complex clinical jargon into verified, accessible language.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => navigate('/review')}
          >
            Review Queue ({stats?.awaitingReview || 0})
          </Button>
          <Button
            className="bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold"
            onClick={() => navigate('/new-summary')}
          >
            + New Summary
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Summaries Created"
          value={stats?.summariesCreated ?? 0}
          subtitle="Total discharge instructions generated"
          trend="" 
          accentColor="blue"
          icon={<FileText className="w-5 h-5" />}
        />
        <StatsCard
          title="Awaiting Review"
          value={stats?.awaitingReview ?? 0}
          subtitle="Requires physician approval"
          trend=""
          accentColor="amber"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatsCard
          title="Approved"
          value={stats?.approvedToday ?? 0}
          subtitle="Released or approved for patient care"
          trend=""
          accentColor="emerald"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatsCard
          title="Readability Improvement"
          value={`+${stats?.avgReadabilityImprovement ?? 0}%`}
          subtitle="Average patient-language improvement"
          trend=""
          accentColor="teal"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Prominent Quick Actions */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
        <QuickActions />
      </div>

      {/* Table & Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentSummariesTable summaries={summaries} />
        </div>
        <div>
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  )
}
