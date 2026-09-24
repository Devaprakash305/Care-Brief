import React from 'react'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'

export interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  trendPositive?: boolean
  icon: React.ReactNode
  accentColor?: 'blue' | 'amber' | 'emerald' | 'teal'
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  icon,
  accentColor = 'blue'
}) => {
  const iconBg = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200/60',
    amber: 'bg-amber-50 text-amber-600 border-amber-200/60',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
    teal: 'bg-teal-50 text-teal-600 border-teal-200/60'
  }

  return (
    <Card hoverEffect className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'text-xs font-medium px-1.5 py-0.5 rounded-full',
                  trendPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                )}
              >
                {trend}
              </span>
              <span className="text-[11px] text-slate-400">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl border shrink-0', iconBg[accentColor])}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
