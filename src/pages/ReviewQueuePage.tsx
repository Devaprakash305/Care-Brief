import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Textarea } from '../components/ui/Textarea'
import { StatusIndicator } from '../components/ui/StatusIndicator'
import { LoadingState } from '../components/common/LoadingState'
import { useToast } from '../components/ui/Toast'
import { summaryService } from '../services/supabaseSummaryService'
import { DischargeSummary, ClinicalNote } from '../types'
import { ShieldCheck, CheckCircle2, Edit3, ArrowRight, FileText, AlertCircle, Eye, Sparkles } from 'lucide-react'

export const ReviewQueuePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const targetId = searchParams.get('id')
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState<DischargeSummary[]>([])
  const [selectedSummary, setSelectedSummary] = useState<DischargeSummary | null>(null)
  const [relatedNote, setRelatedNote] = useState<ClinicalNote | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editableHeadline, setEditableHeadline] = useState('')
  const [clinicianNotes, setClinicianNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isSendingPdf, setIsSendingPdf] = useState(false)

  useEffect(() => {
    async function loadQueue() {
      setLoading(true)
      try {
        const list = await summaryService.getRecentSummaries()
        setSummaries(list)

        const found = targetId ? list.find((s) => s.id === targetId) : list[0]
        if (found) {
          setSelectedSummary(found)
          setEditableHeadline(found.content.headlineSummary)
          const note = await summaryService.getClinicalNoteById(found.noteId)
          setRelatedNote(note)
        }
      } catch (err) {
        console.error('Failed to load review queue:', err)
      } finally {
        setLoading(false)
      }
    }
    loadQueue()
  }, [targetId])

  const handleSelectSummary = async (summary: DischargeSummary) => {
    setSelectedSummary(summary)
    setEditableHeadline(summary.content.headlineSummary)
    setIsEditing(false)
    const note = await summaryService.getClinicalNoteById(summary.noteId)
    setRelatedNote(note)
  }

  const handleSaveEdits = async () => {
    if (!selectedSummary) return
    setIsSubmitting(true)
    try {
      const updated = await summaryService.updateSummary(selectedSummary.id, {
        status: 'edited',
        content: {
          ...selectedSummary.content,
          headlineSummary: editableHeadline
        }
      })
      setSelectedSummary(updated)
      setIsEditing(false)
      showToast('Edits Saved', 'Summary status updated to Clinician Edited.', 'info')
    } catch (err) {
      showToast('Error', 'Failed to save changes.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedSummary) return
    setIsSubmitting(true)
    try {
      const updated = await summaryService.approveSummary(selectedSummary.id, clinicianNotes)
      setSelectedSummary(updated)
      showToast('Approved & Sign-off Complete', `Discharge summary for ${updated.patientName} approved!`, 'success')
    } catch (err) {
      const error = err as { message?: string }
      showToast('Error', error.message || 'Failed to approve summary.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerateFinalPdf = async () => {
    if (!selectedSummary) return
    setIsGeneratingPdf(true)
    try {
      const latestSummary = await summaryService.getSummaryById(selectedSummary.id)
      if (!latestSummary) throw new Error('The approved discharge summary could not be reloaded.')
      const pdfBlob = await summaryService.generateApprovedPdf(latestSummary)
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `carebrief-${selectedSummary.patientName.replace(/\s+/g, '-').toLowerCase() || 'summary'}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      showToast('Final PDF Ready', 'The approved discharge instructions were exported as a PDF.', 'success')
    } catch (err) {
      const error = err as { message?: string }
      showToast('Error', error.message || 'The final PDF could not be generated. Please try again.', 'error')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleSendApprovedPdf = async () => {
    if (!selectedSummary) return
    setIsSendingPdf(true)
    try {
      const updated = await summaryService.sendApprovedSummaryToWhatsApp(selectedSummary)
      setSelectedSummary(updated)
      showToast('WhatsApp Delivery Sent', `The approved PDF was sent to ${updated.whatsappNumber || 'the patient'} via WhatsApp.`, 'success')
    } catch (err) {
      const error = err as { message?: string }
      setSelectedSummary((current) => current ? { ...current, deliveryStatus: 'delivery_failed', deliveryError: error.message || 'Delivery failed' } : current)
      showToast('WhatsApp Delivery Failed', error.message || 'The discharge instructions were approved, but WhatsApp delivery failed. Please retry delivery.', 'error')
    } finally {
      setIsSendingPdf(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12">
        <LoadingState title="Loading Clinician Review Queue..." description="Fetching patient discharge records and verification audit flags." />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Clinical Review Queue"
        subtitle="Verify AI-generated summaries against physician notes before releasing to patients."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="px-3 py-1 text-xs">
              {summaries.filter((s) => s.status === 'awaiting_review').length} Awaiting Signoff
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Summary Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Patient List</h3>
          <div className="space-y-2">
            {summaries.map((s) => {
              const isSelected = selectedSummary?.id === s.id
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSummary(s)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-800 shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {s.patientName}
                    </span>
                    <StatusIndicator status={s.status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>{s.condition}</span>
                    <span className={`font-medium px-2 py-0.5 rounded-md text-[11px] ${
                      isSelected ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {s.language}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Split Screen Comparison & Review */}
        {selectedSummary && (
          <div className="lg:col-span-8 space-y-5">
            {/* Top Verification Header */}
            <Card className="bg-slate-900 text-white border-slate-800">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedSummary.patientName}</h2>
                    <Badge variant="outline" className="border-teal-500/40 text-teal-300 bg-teal-500/10">
                      {selectedSummary.language} ({selectedSummary.readingLevel})
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Condition: {selectedSummary.condition}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-teal-400 flex items-center gap-1 justify-end">
                      <ShieldCheck className="w-4 h-4" />
                      {selectedSummary.verification.confidenceScore}% Factual Match
                    </div>
                    <p className="text-[11px] text-slate-400">Readability Gain: +{selectedSummary.readabilityImprovementPct}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Split Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source Clinical Note */}
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="p-4 pb-2 border-b border-slate-200">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Source Physician Clinical Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-[360px] overflow-y-auto">
                  {relatedNote ? relatedNote.rawContent : 'Clinical discharge note content loaded.'}
                </CardContent>
              </Card>

              {/* Simplified Patient Summary */}
              <Card className="border-teal-200 shadow-2xs">
                <CardHeader className="p-4 pb-2 border-b border-teal-100 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    Generated Patient Summary ({selectedSummary.language})
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    icon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    {isEditing ? 'Cancel Edit' : 'Edit Text'}
                  </Button>
                </CardHeader>

                <CardContent className="p-4 text-xs text-slate-800 space-y-3 max-h-[360px] overflow-y-auto">
                  <div>
                    <h5 className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider mb-1">Headline Overview</h5>
                    {isEditing ? (
                      <Textarea
                        rows={3}
                        value={editableHeadline}
                        onChange={(e) => setEditableHeadline(e.target.value)}
                      />
                    ) : (
                      <p className="p-2.5 bg-teal-50/70 border border-teal-100 rounded-lg font-medium leading-relaxed">
                        {selectedSummary.content.headlineSummary}
                      </p>
                    )}
                  </div>

                  <div>
                    <h5 className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider mb-1">Medications</h5>
                    <div className="space-y-1.5">
                      {selectedSummary.content.medicationGuide.map((m, i) => (
                        <div key={i} className="p-2 bg-white border border-slate-200 rounded">
                          <span className="font-bold text-slate-900">{m.name}</span> ({m.dosage}) — {m.frequency}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider mb-1">Warning Signs</h5>
                    <ul className="list-disc list-inside space-y-0.5 text-rose-800">
                      {selectedSummary.content.warningSignsWhenToCall.map((ws, i) => (
                        <li key={i}>{ws}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fact Check Guardrail Claims List */}
            <Card>
              <CardHeader className="p-4 pb-2 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Factual Consistency Verification Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {selectedSummary.verification.items.length > 0 ? (
                  selectedSummary.verification.items.map((v) => (
                    <div key={v.id} className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-emerald-950">
                        <span>Claim: {v.claim}</span>
                        <Badge variant="success" size="sm">Verified</Badge>
                      </div>
                      <p className="text-slate-600 italic">Source Quote: "{v.sourceQuote}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No additional verification flags were detected for this source note.</p>
                )}
              </CardContent>
            </Card>

            {/* Actions Bar */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4 space-y-3">
                <Textarea
                  rows={2}
                  placeholder="Add optional clinician signoff note (e.g. Approved after confirming dosage timing)..."
                  value={clinicianNotes}
                  onChange={(e) => setClinicianNotes(e.target.value)}
                />

                <div className="flex items-center justify-between">
                  {isEditing ? (
                    <Button variant="outline" size="sm" onClick={handleSaveEdits} isLoading={isSubmitting}>
                      Save Clinician Edits
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-500">Reviewer: Clinician signoff</span>
                  )}

                  <Button
                    variant="success"
                    size="md"
                    onClick={handleApprove}
                    isLoading={isSubmitting}
                    disabled={selectedSummary.status === 'approved' || selectedSummary.status === 'released'}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    {selectedSummary.status === 'approved'
                      ? 'Already Approved'
                      : 'Approve & Release'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {(selectedSummary.status === 'approved' || selectedSummary.status === 'released') && (
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Final patient release</p>
                      <p className="text-xs text-emerald-700">
                        {selectedSummary.deliveryStatus === 'sent'
                          ? 'Approved PDF sent successfully to the patient WhatsApp number.'
                          : selectedSummary.deliveryStatus === 'delivery_failed'
                          ? 'The approved PDF is saved but delivery failed. Retry when ready.'
                          : 'Final approved content is ready to be exported and sent to the patient.'}
                      </p>
                    </div>
                    <Badge variant={selectedSummary.deliveryStatus === 'sent' ? 'success' : selectedSummary.deliveryStatus === 'delivery_failed' ? 'danger' : 'warning'}>
                      {selectedSummary.deliveryStatus === 'sent' ? 'Sent' : selectedSummary.deliveryStatus === 'delivery_failed' ? 'Delivery failed' : 'Ready to send'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateFinalPdf}
                      isLoading={isGeneratingPdf}
                    >
                      Generate Final PDF
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleSendApprovedPdf}
                      isLoading={isSendingPdf}
                      disabled={selectedSummary.status === 'released' && selectedSummary.deliveryStatus === 'sent'}
                    >
                      {selectedSummary.deliveryStatus === 'sent' ? 'Already Sent to WhatsApp' : 'Send Final PDF to WhatsApp'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
