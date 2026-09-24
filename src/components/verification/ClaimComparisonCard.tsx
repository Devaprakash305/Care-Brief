import React from 'react'
import { ClaimComparison } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { CheckCircle2, AlertTriangle, Info, ArrowRight, FileText, Sparkles } from 'lucide-react'

interface ClaimComparisonCardProps {
  claim: ClaimComparison
}

export const ClaimComparisonCard: React.FC<ClaimComparisonCardProps> = ({ claim }) => {
  const isMismatch = claim.status === 'POTENTIAL MISMATCH'
  const isSimplified = claim.status === 'SIMPLIFIED'

  return (
    <Card
      className={`transition-all duration-200 ${
        isMismatch
          ? 'border-rose-300 bg-rose-50/20 shadow-xs ring-1 ring-rose-300'
          : isSimplified
          ? 'border-sky-200 bg-sky-50/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-4 sm:p-5 space-y-3">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400 text-[11px] font-semibold">{claim.id}</span>
            {claim.category && (
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {claim.category}
              </span>
            )}
          </div>

          {/* Status Badge */}
          {claim.status === 'SUPPORTED' && (
            <Badge variant="success" size="sm" className="gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Supported
            </Badge>
          )}

          {claim.status === 'SIMPLIFIED' && (
            <Badge variant="info" size="sm" className="gap-1 font-bold">
              <Info className="w-3.5 h-3.5 text-sky-600" />
              Simplified
            </Badge>
          )}

          {claim.status === 'POTENTIAL MISMATCH' && (
            <Badge variant="danger" size="sm" className="gap-1 font-bold bg-rose-100 text-rose-800 border-rose-300">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Potential Mismatch
            </Badge>
          )}
        </div>

        {/* Claim Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Left: Source Clinical Note Quote */}
          <div className="p-3 rounded-lg bg-slate-100/80 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-500" />
              Source Clinical Note Quote
            </span>
            <p className="font-mono text-slate-800 leading-relaxed font-medium">
              "{claim.sourceQuote}"
            </p>
          </div>

          {/* Right: Generated Patient Claim */}
          <div
            className={`p-3 rounded-lg border space-y-1 ${
              isMismatch
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : isSimplified
                ? 'bg-sky-50/60 border-sky-200 text-sky-950'
                : 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 opacity-75">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Generated Instruction
            </span>
            <p className="font-medium leading-relaxed">
              "{claim.generatedClaim}"
            </p>
          </div>
        </div>

        {/* Mismatch Alert Detail callout */}
        {isMismatch && claim.mismatchDetail && (
          <div className="p-3 bg-rose-100/70 border border-rose-300 rounded-lg text-xs space-y-1.5 text-rose-950">
            <div className="flex items-center justify-between font-bold text-rose-900">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Value Discrepancy Detail:
              </span>
              <span className="text-[10px] font-bold uppercase bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                {claim.severity || 'High attention'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[11px]">Source Value: </span>
                <span className="font-bold text-rose-900">{claim.mismatchDetail.sourceValue}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <div>
                <span className="text-slate-500 text-[11px]">Generated Value: </span>
                <span className="font-bold text-rose-900">{claim.mismatchDetail.generatedValue}</span>
              </div>
            </div>
            {claim.explanation && (
              <p className="text-[11px] text-rose-800 leading-normal pt-1 border-t border-rose-200">
                {claim.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
