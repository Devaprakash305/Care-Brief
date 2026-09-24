import React from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'

export interface SuccessStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-emerald-50/50 rounded-xl border border-emerald-200 shadow-2xs">
      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
        <CheckCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-emerald-950">{title}</h3>
      <p className="text-xs text-emerald-800 max-w-md mt-1 mb-5 leading-relaxed">{description}</p>
      <div className="flex items-center gap-3">
        {secondaryActionLabel && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="outline" size="sm">
            {secondaryActionLabel}
          </Button>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="success" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
