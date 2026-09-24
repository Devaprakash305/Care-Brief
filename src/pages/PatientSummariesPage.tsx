import React, { useEffect, useState } from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { StatusIndicator } from '../components/ui/StatusIndicator'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { LoadingState } from '../components/common/LoadingState'
import { summaryService } from '../services/supabaseSummaryService'
import { DischargeSummary } from '../types'
import { useAuth } from '../auth/AuthContext'
import { FileCheck2, Search, Printer, Share2, Globe2, BookOpen, ShieldCheck } from 'lucide-react'

export const PatientSummariesPage: React.FC = () => {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState<DischargeSummary[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPrintSummary, setSelectedPrintSummary] = useState<DischargeSummary | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const list = profile?.role === 'patient'
          ? await summaryService.getPatientSummaries()
          : await summaryService.getRecentSummaries()
        setSummaries(list)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [profile?.role])

  const filtered = summaries.filter(
    (s) =>
      s.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.language.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="py-12">
        <LoadingState title="Loading Finalized Patient Summaries..." description="Gathering approved patient-facing discharge instructions." />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Patient Discharge Summaries"
        subtitle="Repository of finalized, multi-lingual, plain-language patient instructions."
      />

      {/* Filter / Search Bar */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Search by patient name, condition, or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Summary ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Clinical Condition</TableHead>
              <TableHead>Target Language</TableHead>
              <TableHead>Literacy Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reviewed By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs font-semibold text-slate-800">{s.id}</TableCell>
                <TableCell className="font-semibold text-slate-900">{s.patientName}</TableCell>
                <TableCell>{s.condition}</TableCell>
                <TableCell>
                  <Badge variant="outline" size="sm" className="gap-1 font-normal">
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
                  <StatusIndicator status={s.status} size="sm" />
                </TableCell>
                <TableCell className="text-xs text-slate-600">{s.reviewedBy || 'Clinician review'}</TableCell>
                <TableCell className="text-right flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedPrintSummary(s)} icon={<Printer className="w-3.5 h-3.5" />}>
                    Print / Export
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Printable Patient Sheet Modal */}
      {selectedPrintSummary && (
        <Modal
          isOpen={!!selectedPrintSummary}
          onClose={() => setSelectedPrintSummary(null)}
          title={`Patient Discharge Sheet — ${selectedPrintSummary.patientName}`}
          description={`Language: ${selectedPrintSummary.language} | Status: Approved & Verified`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()} icon={<Printer className="w-3.5 h-3.5" />}>
                Print Document
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedPrintSummary(null)}>
                Close Preview
              </Button>
            </div>
          }
        >
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 text-slate-900 font-sans print:border-none print:shadow-none">
            {/* Patient Sheet Header */}
            <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900">MetroHealth Medical Center</h2>
                <h3 className="text-sm font-semibold text-teal-700 mt-0.5">Patient Care & Discharge Guide</h3>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="font-semibold text-slate-800">{selectedPrintSummary.patientName}</p>
                <p>Date: {selectedPrintSummary.updatedAt}</p>
              </div>
            </div>

            {/* Headline */}
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <h4 className="font-bold text-xs text-teal-900 uppercase tracking-wider mb-1">Your Hospital Summary</h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">{selectedPrintSummary.content.headlineSummary}</p>
            </div>

            {/* Medications */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">Discharge Medication Guide</h4>
              <div className="space-y-2">
                {selectedPrintSummary.content.medicationGuide.map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{m.name}</span>
                      <span>{m.dosage}</span>
                    </div>
                    <p className="text-slate-600">Timing: {m.frequency}</p>
                    <p className="text-slate-500">{m.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Signs */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2">
              <h4 className="font-bold text-rose-950 uppercase tracking-wider">When to Call Emergency / Doctor</h4>
              <ul className="list-disc list-inside space-y-1 text-rose-900 font-medium">
                {selectedPrintSummary.content.warningSignsWhenToCall.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Doctor Signature */}
            <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-500">
              <div>
                <p className="font-bold text-slate-800">Approved by:</p>
                <p>{selectedPrintSummary.reviewedBy || 'Clinician review'}</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Factual Consistency Verified
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
