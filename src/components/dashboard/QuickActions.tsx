import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../ui/Card'
import { FilePlus2, UploadCloud, CheckSquare, ArrowRight } from 'lucide-react'

export const QuickActions: React.FC = () => {
  const navigate = useNavigate()

  const actions = [
    {
      title: 'Create New Summary',
      description: 'Convert structured clinical note into plain-language instructions in 8+ languages.',
      icon: FilePlus2,
      action: () => navigate('/new-summary'),
      badge: 'Interactive AI Generator',
      color: 'from-slate-900 to-slate-800 text-white',
      iconBg: 'bg-white/10 text-white',
      buttonVariant: 'bg-white text-slate-900 hover:bg-slate-100'
    },
    {
      title: 'Upload Clinical Note',
      description: 'Upload EHR discharge summary, physician note, or paste raw text.',
      icon: UploadCloud,
      action: () => navigate('/new-summary?tab=upload'),
      badge: 'EHR / PDF / Text',
      color: 'bg-white border border-slate-200 text-slate-900',
      iconBg: 'bg-teal-50 text-teal-700 border border-teal-200/60',
      buttonVariant: 'bg-slate-100 text-slate-800 hover:bg-slate-200'
    },
    {
      title: 'Review Pending Summaries',
      description: 'Open the clinical review queue to verify AI drafts before patient release.',
      icon: CheckSquare,
      action: () => navigate('/review'),
      badge: 'Awaiting Review',
      color: 'bg-white border border-slate-200 text-slate-900',
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      buttonVariant: 'bg-amber-600 text-white hover:bg-amber-700'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {actions.map((act, index) => {
        const Icon = act.icon
        return (
          <Card
            key={index}
            hoverEffect
            className={`p-5 flex flex-col justify-between relative group cursor-pointer ${
              index === 0 ? 'bg-slate-900 text-white border-slate-800' : ''
            }`}
            onClick={act.action}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${act.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    index === 0
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {act.badge}
                </span>
              </div>
              <h3 className={`font-semibold text-base mb-1 ${index === 0 ? 'text-white' : 'text-slate-900'}`}>
                {act.title}
              </h3>
              <p className={`text-xs leading-relaxed ${index === 0 ? 'text-slate-300' : 'text-slate-500'}`}>
                {act.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100/10 flex items-center justify-between">
              <span className={`text-xs font-semibold flex items-center gap-1 group-hover:underline ${index === 0 ? 'text-teal-300' : 'text-slate-700'}`}>
                Proceed <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
