import React from 'react'
import { SummaryStatus } from '../../types'
import { Badge } from './Badge'
import { Clock, CheckCircle2, Edit3, Send, FileText } from 'lucide-react'

export interface StatusIndicatorProps {
  status: SummaryStatus
  size?: 'sm' | 'md'
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 'md' }) => {
  switch (status) {
    case 'awaiting_review':
      return (
        <Badge variant="warning" size={size} className="gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Awaiting Review
        </Badge>
      )
    case 'edited':
      return (
        <Badge variant="info" size={size} className="gap-1">
          <Edit3 className="w-3.5 h-3.5 text-sky-600" />
          Clinician Edited
        </Badge>
      )
    case 'approved':
      return (
        <Badge variant="success" size={size} className="gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Approved
        </Badge>
      )
    case 'released':
      return (
        <Badge variant="secondary" size={size} className="gap-1">
          <Send className="w-3.5 h-3.5 text-indigo-600" />
          Released
        </Badge>
      )
    case 'draft':
    default:
      return (
        <Badge variant="default" size={size} className="gap-1">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          Draft
        </Badge>
      )
  }
}
