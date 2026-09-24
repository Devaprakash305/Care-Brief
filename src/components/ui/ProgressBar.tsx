import React from 'react'
import { cn } from '../../utils/cn'

export interface ProgressBarProps {
  value: number // 0 to 100
  label?: string
  showValueLabel?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showValueLabel = true,
  variant = 'primary',
  size = 'md',
  className
}) => {
  const percentage = Math.min(100, Math.max(0, value))

  const variants = {
    primary: 'bg-slate-900',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    info: 'bg-sky-600'
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }

  return (
    <div className={cn('w-full', className)}>
      {(label || showValueLabel) && (
        <div className="flex justify-between items-center mb-1 text-xs text-slate-600">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showValueLabel && <span className="font-semibold text-slate-900">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50', heights[size])}>
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
