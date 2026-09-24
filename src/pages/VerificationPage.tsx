import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Modal } from '../components/ui/Modal'
import { Textarea } from '../components/ui/Textarea'
import { LoadingState } from '../components/common/LoadingState'
import { ClaimComparisonCard } from '../components/verification/ClaimComparisonCard'
import { useToast } from '../components/ui/Toast'
import { verificationService } from '../services/supabaseVerificationService'
import { summaryService } from '../services/supabaseSummaryService'
import { VerificationReport, ClaimStatus, DischargeSummary } from '../types'
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowLeft,
  Edit3,
  Send,
  Info,
  Filter,
  BarChart3,
  ArrowRight,
  BookOpen
} from 'lucide-react'

export const VerificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<VerificationReport | null>(null)
  const [summaryRecord, setSummaryRecord] = useState<DischargeSummary | null>(null)
  const [activeFilter, setActiveFilter] = useState<'ALL' | ClaimStatus>('ALL')

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editedText, setEditedText] = useState('')

  useEffect(() => {
    async function loadVerificationData() {
      setLoading(true)
      try {
        const [rep, sum] = await Promise.all([
          verificationService.verifySummary(id || 'SUM-001'),
          summaryService.getSummaryById(id || 'SUM-001')
        ])
        setReport(rep)
        setSummaryRecord(sum)
        if (sum) {
          setEditedText(sum.content.headlineSummary)
        }
      } catch (err) {
        console.error('Failed to load verification report:', err)
      } finally {
        setLoading(false)
      }
    }
    loadVerificationData()
  }, [id])

  if (loading || !report) {
    return (
      <div className="py-12">
        <LoadingState
          title="Executing Source-Support Analysis..."
          description="Cross-checking medical claims against physician note and measuring Flesch readability indices."
        />
      </div>
    )
  }

  // Filter claim list
  const filteredClaims = report.claims.filter((c) => {
    if (activeFilter === 'ALL') return true
    return c.status === activeFilter
  })

  // Has potential mismatch issue
  const mismatchClaim = report.claims.find((c) => c.status === 'POTENTIAL MISMATCH')

  const handleSendToReview = async () => {
    if (summaryRecord) {
      await summaryService.updateSummary(summaryRecord.id, { status: 'awaiting_review' })
    }
    showToast('Sent to Review Queue', 'Summary sent for clinician review.', 'success')
    navigate(`/review?id=${id || 'SUM-001'}`)
  }

  const handleSaveEdits = async () => {
    if (summaryRecord) {
      await summaryService.updateSummary(summaryRecord.id, {
        status: 'edited',
        content: {
          ...summaryRecord.content,
          headlineSummary: editedText
        }
      })
    }
    setIsEditModalOpen(false)
    showToast('Edits Saved', 'Clinician modifications updated.', 'info')
  }

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* SECTION 1 — VERIFICATION HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="success" className="bg-teal-500/20 text-teal-300 border-teal-500/40 font-semibold gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Verification Complete
              </Badge>
              <span className="text-xs text-slate-300">
                Patient: <span className="font-bold text-white">{report.patientName}</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">AI Summary Verification</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Compare generated content against the source clinical note before clinician approval.
            </p>
          </div>

          {/* SECTION 8 — HEADER ACTIONS */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate(`/summary/${id || 'SUM-001'}`)}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Back to Summary
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              icon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit Summary
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendToReview}
              className={`${mismatchClaim ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold' : 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold'}`}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Send to Clinician Review
            </Button>
          </div>
        </div>

        {/* Source-Support Analysis Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-700/60 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Claims Checked</span>
            <span className="text-lg font-bold text-white">{report.claimsChecked}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60">
            <span className="text-emerald-400 block text-[11px]">Supported Claims</span>
            <span className="text-lg font-bold text-emerald-300">{report.supportedClaims}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/60">
            <span className="text-sky-400 block text-[11px]">Simplified Claims</span>
            <span className="text-lg font-bold text-sky-300">{report.simplifiedClaims}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60">
            <span className="text-rose-400 block text-[11px]">Potential Issues</span>
            <span className="text-lg font-bold text-rose-300">{report.mismatches}</span>
          </div>
        </div>
      </div>

      {/* SECTION 3 — ISSUE ALERT (PROMINENT IF MISMATCH DETECTED) */}
      {mismatchClaim && (
        <Card className="border-rose-300 bg-rose-50/90 shadow-sm animate-in fade-in duration-200">
          <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-rose-950 text-sm">Potential factual mismatch detected</h3>
                  <Badge variant="danger" size="sm" className="bg-rose-200 text-rose-900 border-rose-300 font-bold">
                    {mismatchClaim.severity || 'High attention'}
                  </Badge>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed max-w-3xl">
                  Discrepancy in <span className="font-bold underline">{mismatchClaim.category}</span>: Source specifies <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-rose-200 font-mono text-rose-950">"{mismatchClaim.mismatchDetail?.sourceValue}"</span> but generated text states <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-rose-200 font-mono text-rose-950">"{mismatchClaim.mismatchDetail?.generatedValue}"</span>.
                </p>
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              icon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Review & Fix Claim
            </Button>
          </CardContent>
        </Card>
      )}

      {/* METRICS & READABILITY DUAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 4 — SOURCE-SUPPORT METRICS */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="p-5 pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-600" />
                Source-Support Analysis Score
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-6">
              <div className="flex items-center justify-between p-4 bg-teal-50/60 border border-teal-200 rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-teal-900 block">Source Support</span>
                  <span className="text-3xl font-extrabold text-teal-950 tracking-tight">
                    {report.sourceSupportScore}%
                  </span>
                  <span className="text-[11px] text-teal-700 block mt-0.5 font-medium">
                    11 of 12 claims supported
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full bg-white border-4 border-teal-500 flex items-center justify-center font-bold text-teal-900 text-sm shadow-2xs">
                  {Math.round(report.sourceSupportScore)}%
                </div>
              </div>

              <ProgressBar
                value={report.sourceSupportScore}
                variant="success"
                showValueLabel={false}
                size="md"
              />

              {/* SECTION 4 MANDATORY TOOLTIP FOOTNOTE */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-600">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed italic">
                  "Percentage of generated claims supported by the source note. This is a prototype metric and is not a clinical validation score."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 5 — READABILITY ANALYSIS */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Readability Improvement Analysis
              </CardTitle>
              <Badge variant="success" size="md" className="font-bold">
                +{report.readabilityImprovementPoints} Readability Points
              </Badge>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              {/* Before vs After Readability Ease Comparison */}
              <div className="grid grid-cols-2 gap-4">
                {/* Before AI */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Before AI (EHR Note)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">{report.readabilityBefore.fleschEase}</span>
                    <span className="text-xs text-slate-500">Flesch Ease</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 block mt-1">
                    {report.readabilityBefore.readingLevel}
                  </span>
                </div>

                {/* After AI */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">After AI (Simplified)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-emerald-950">{report.readabilityAfter.fleschEase}</span>
                    <span className="text-xs text-emerald-700">Flesch Ease</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-900 block mt-1">
                    {report.readabilityAfter.readingLevel}
                  </span>
                </div>
              </div>

              {/* Sentence Level Analytics Grid */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Sentence Count</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {report.readabilityBefore.sentenceCount} → {report.readabilityAfter.sentenceCount}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Avg Sentence Length</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {report.readabilityBefore.avgSentenceLength}w → {report.readabilityAfter.avgSentenceLength}w
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Complex Words</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {report.readabilityBefore.complexWordsPct}% → {report.readabilityAfter.complexWordsPct}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 6 — BEFORE / AFTER COMPARISON */}
      <Card>
        <CardHeader className="p-5 pb-3 border-b border-slate-100">
          <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            Side-by-Side Clinical Simplification Demonstration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* RAW CLINICAL NOTE */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                RAW CLINICAL NOTE
              </span>
              <p className="font-mono text-slate-800 leading-relaxed font-medium">
                "{report.rawClinicalSnippet}"
              </p>
            </div>

            {/* PATIENT-FRIENDLY VERSION */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 text-teal-950">
              <span className="font-bold text-[11px] text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                PATIENT-FRIENDLY VERSION
              </span>
              <p className="font-medium leading-relaxed">
                "{report.simplifiedSnippet}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2 & 7 — CLAIM-BY-CLAIM COMPARISON LIST & FILTERS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Claim-by-Claim Source Support Analysis
            </h2>
            <p className="text-xs text-slate-500">
              Granular claim extraction and factual matching against physician note quotes.
            </p>
          </div>

          {/* SECTION 7 — FILTERS */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
            <span className="px-2 text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            <Button
              variant={activeFilter === 'ALL' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('ALL')}
            >
              All ({report.claims.length})
            </Button>
            <Button
              variant={activeFilter === 'SUPPORTED' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('SUPPORTED')}
            >
              Supported ({report.supportedClaims})
            </Button>
            <Button
              variant={activeFilter === 'SIMPLIFIED' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('SIMPLIFIED')}
            >
              Simplified ({report.simplifiedClaims})
            </Button>
            <Button
              variant={activeFilter === 'POTENTIAL MISMATCH' ? 'danger' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('POTENTIAL MISMATCH')}
            >
              Potential Issues ({report.mismatches})
            </Button>
          </div>
        </div>

        {/* Claim Cards List */}
        <div className="space-y-3">
          {filteredClaims.map((claim) => (
            <ClaimComparisonCard key={claim.id} claim={claim} />
          ))}
        </div>
      </div>

      {/* EDIT MODAL FOR CLINICIAN EDITING */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Resolve Claim Discrepancy"
        description="Edit the generated summary text to resolve potential mismatches before clinician signoff."
        maxWidth="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEdits}>
              Save Corrections
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          {mismatchClaim && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1 text-amber-900">
              <p className="font-bold">Detected Mismatch:</p>
              <p>Source note: "{mismatchClaim.sourceQuote}"</p>
              <p>Generated text: "{mismatchClaim.generatedClaim}"</p>
            </div>
          )}
          <Textarea
            rows={5}
            label="Edit Summary Headline Text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
}
