import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { ActivityLog } from '../../types'
import { Sparkles, ShieldCheck, Edit3, CheckCircle2, Send, Clock } from 'lucide-react'

interface ActivityTimelineProps {
  activities: ActivityLog[]
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getIcon = (action: ActivityLog['action']) => {
    switch (action) {
      case 'Summary generated':
        return <Sparkles className="w-3.5 h-3.5 text-sky-600" />
      case 'Fact check completed':
        return <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
      case 'Clinician edited':
        return <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
      case 'Summary approved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      case 'Released to patient':
        return <Send className="w-3.5 h-3.5 text-slate-600" />
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />
    }
  }

  const getBg = (action: ActivityLog['action']) => {
    switch (action) {
      case 'Summary generated':
        return 'bg-sky-50 border-sky-200'
      case 'Fact check completed':
        return 'bg-teal-50 border-teal-200'
      case 'Clinician edited':
        return 'bg-indigo-50 border-indigo-200'
      case 'Summary approved':
        return 'bg-emerald-50 border-emerald-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Recent Clinical Activity</CardTitle>
          <p className="text-xs text-slate-500">Live audit log of generation, verification & approvals</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {activities.map((item) => (
            <div key={item.id} className="relative flex items-start justify-between gap-3 text-xs">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center bg-white ${getBg(
                  item.action
                )}`}
              >
                {getIcon(item.action)}
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {item.action} — <span className="font-normal text-slate-600">{item.patientName}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">By {item.actor}</p>
              </div>
              <span className="text-[11px] font-medium text-slate-400 shrink-0">{item.timestamp}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
