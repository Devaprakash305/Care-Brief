import React from 'react'
import { useNavigate } from 'react-router-dom'
import { DischargeSummary } from '../../types'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table'
import { StatusIndicator } from '../ui/StatusIndicator'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ArrowUpRight, Globe2, BookOpen } from 'lucide-react'

interface RecentSummariesTableProps {
  summaries: DischargeSummary[]
  onViewSummary?: (summary: DischargeSummary) => void
}

export const RecentSummariesTable: React.FC<RecentSummariesTableProps> = ({ summaries, onViewSummary }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 text-base">Recent Patient Discharge Summaries</h3>
          <p className="text-xs text-slate-500">Overview of generated summaries across preferred languages</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/patient-summaries')}
          icon={<ArrowUpRight className="w-3.5 h-3.5" />}
        >
          View All
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Reading Level</TableHead>
            <TableHead>Readability Gain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaries.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-semibold text-slate-900">{s.patientName}</TableCell>
              <TableCell>{s.condition}</TableCell>
              <TableCell>
                <Badge variant="outline" size="sm" className="gap-1 font-normal text-slate-700">
                  <Globe2 className="w-3 h-3 text-slate-400" />
                  {s.language}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" size="sm" className="gap-1 text-xs">
                  <BookOpen className="w-3 h-3 text-indigo-500" />
                  {s.readingLevel}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  +{s.readabilityImprovementPct}% (Grade {s.simplifiedFKGL})
                </span>
              </TableCell>
              <TableCell>
                <StatusIndicator status={s.status} size="sm" />
              </TableCell>
              <TableCell className="text-xs text-slate-500">{s.updatedAt}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onViewSummary ? onViewSummary(s) : navigate(`/review?id=${s.id}`)
                  }
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
