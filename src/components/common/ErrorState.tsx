import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '../ui/Button'

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load clinical records',
  description = 'A system error occurred while retrieving clinical notes or processing summary state.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-rose-50/50 rounded-xl border border-rose-200 shadow-2xs">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-950">{title}</h3>
      <p className="text-xs text-rose-700 max-w-md mt-1 mb-4 leading-relaxed">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Retry Request
        </Button>
      )}
    </div>
  )
}
