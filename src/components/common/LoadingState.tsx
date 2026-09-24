import React from 'react'
import { Loader2 } from 'lucide-react'

export interface LoadingStateProps {
  title?: string
  description?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Processing clinical data...',
  description = 'Generating plain-language patient summary and conducting factual consistency verification.'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 shadow-2xs">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">{description}</p>
    </div>
  )
}
