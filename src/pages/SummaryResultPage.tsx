import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { Modal } from '../components/ui/Modal'
import { LoadingState } from '../components/common/LoadingState'
import { useToast } from '../components/ui/Toast'
import { summaryService } from '../services/mockSummaryService'
import { getMockVariant, MockVariantContent } from '../data/mockSummaryVariants'
import { DischargeSummary, ClinicalNote, Language, LiteracyLevel } from '../types'
import {
  Sparkles,
  ShieldCheck,
  Globe2,
  BookOpen,
  FileText,
  Clock,
  CheckCircle2,
  Edit3,
  RefreshCw,
  Send,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Pill,
  Utensils,
  Activity,
  Calendar,
  AlertCircle,
  Volume2,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  Info
} from 'lucide-react'

export const SummaryResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<DischargeSummary | null>(null)
  const [sourceNote, setSourceNote] = useState<ClinicalNote | null>(null)

  // Interactive Personalization Selectors
  const [activeLanguage, setActiveLanguage] = useState<Language>('Tamil')
  const [activeLiteracyLevel, setActiveLiteracyLevel] = useState<LiteracyLevel>('Simple')

  // UI State
  const [showOriginalNote, setShowOriginalNote] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false)
  const [editableHeadline, setEditableHeadline] = useState('')

  useEffect(() => {
    async function loadSummaryData() {
      setLoading(true)
      try {
        let found = id ? await summaryService.getSummaryById(id) : null
        if (!found) {
          const all = await summaryService.getRecentSummaries(1)
          found = all[0] || null
        }

        if (found) {
          setSummary(found)
          setActiveLanguage(found.language || 'Tamil')
          setActiveLiteracyLevel(found.readingLevel || 'Simple')
          setEditableHeadline(found.content.headlineSummary)
          const note = await summaryService.getClinicalNoteById(found.noteId)
          setSourceNote(note)
        }
      } catch (err) {
        console.error('Failed to load summary result:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSummaryData()
  }, [id])

  // Get active mock content variant based on selected Language + Reading Level
  const currentVariant: MockVariantContent = getMockVariant(activeLanguage, activeLiteracyLevel)

  // Action 1: Send for Clinical Review
  const handleSendForReview = async () => {
    if (!summary) return
    try {
      const updated = await summaryService.updateSummary(summary.id, {
        status: 'awaiting_review'
      })
      setSummary(updated)
      showToast(
        'Status Updated',
        `Discharge summary for ${summary.patientName} submitted to Physician Review Queue.`,
        'success'
      )
    } catch (err) {
      showToast('Error', 'Failed to update summary status.', 'error')
    }
  }

  // Action 2: Regenerate Mock Variant
  const handleRegenerate = async () => {
    setIsRegenerating(true)
    setTimeout(() => {
      setIsRegenerating(false)
      showToast('AI Summary Regenerated', `Updated content adaptation for ${activeLanguage} (${activeLiteracyLevel}).`, 'info')
    }, 1500)
  }

  // Action 3: Save Edits
  const handleSaveEdits = async () => {
    if (!summary) return
    try {
      const updated = await summaryService.updateSummary(summary.id, {
        status: 'edited',
        content: {
          ...summary.content,
          headlineSummary: editableHeadline
        }
      })
      setSummary(updated)
      setIsEditingModalOpen(false)
      showToast('Edits Saved', 'Clinician edits saved successfully.', 'success')
    } catch (err) {
      showToast('Error', 'Failed to save edits.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="py-12">
        <LoadingState
          title="Retrieving AI Discharge Summary..."
          description="Fetching personalized patient instructions and source clinical notes."
        />
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-slate-800">Summary Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested discharge summary record does not exist.</p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* SECTION 1 — SUMMARY HEADER & DISCLAIMER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="outline" className="bg-sky-50 text-sky-800 border-sky-200 font-semibold gap-1">
                <Sparkles className="w-3 h-3 text-sky-600" />
                AI Generated
              </Badge>
              <Badge variant="warning" className="gap-1 font-semibold">
                <Clock className="w-3 h-3 text-amber-600" />
                Draft — Awaiting Clinical Review
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Globe2 className="w-3 h-3 text-teal-600" />
                {activeLanguage}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="w-3 h-3 text-indigo-600" />
                {activeLiteracyLevel} Level
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              AI-Generated Discharge Summary
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Patient: <span className="font-bold text-slate-800">{summary.patientName}</span> ({summary.patientId || 'PAT-001'}) | Condition: <span className="font-semibold text-slate-700">{summary.condition}</span>
            </p>
          </div>

          {/* SECTION 8 — TOP ACTIONS */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/verification/${summary.id}`)}
              icon={<ShieldCheck className="w-3.5 h-3.5 text-teal-600" />}
            >
              Safety Verification
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              isLoading={isRegenerating}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Regenerate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditingModalOpen(true)}
              icon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit Summary
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendForReview}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Send for Clinical Review
            </Button>
          </div>
        </div>

        {/* Mandatory Clinical Disclaimer Banner */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-start gap-3 text-xs text-amber-900 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-950">Mandatory Safety Guardrail:</span> AI-generated content must be reviewed by a qualified clinician before being shared with the patient. This content is currently an unapproved draft.
          </div>
        </div>
      </div>

      {/* SECTION 7 — AI PROCESSING PIPELINE INDICATOR */}
      <Card className="bg-slate-900 text-white border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-teal-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Layers className="w-3.5 h-3.5" />
              Simulated AI Transformation Pipeline
            </span>
            <span className="text-[11px] text-slate-400">100% Deterministic Fact Check Guard</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
            {[
              { step: '1. Clinical Note', desc: 'Raw EHR Input' },
              { step: '2. Info Extraction', desc: 'Meds & Diagnoses' },
              { step: '3. Plain Language', desc: 'Grade 5 Simplification' },
              { step: '4. Personalization', desc: `${activeLanguage} (${activeLiteracyLevel})` },
              { step: '5. Fact Verification', desc: '98% Claim Match' }
            ].map((st, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex flex-col justify-center"
              >
                <span className="font-bold text-teal-300 text-xs">{st.step}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{st.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SOURCE INFORMATION */}
        <div className="lg:col-span-5 space-y-5">
          {/* Visual Header indicating SOURCE DATA */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-600" />
              Source Clinical Information
            </h2>
            <Badge variant="outline" size="sm" className="bg-slate-100 text-slate-700">
              Physician EHR Record
            </Badge>
          </div>

          {/* SECTION 5 — COLLAPSIBLE ORIGINAL NOTE */}
          <Card className="border-slate-300 bg-slate-50/80 shadow-2xs">
            <CardHeader
              className="p-4 flex flex-row items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors"
              onClick={() => setShowOriginalNote(!showOriginalNote)}
            >
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-slate-600" />
                View Original Clinical Note
              </CardTitle>
              <button className="text-slate-500">
                {showOriginalNote ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </CardHeader>

            {showOriginalNote && (
              <CardContent className="p-4 pt-0 border-t border-slate-200">
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto">
                  {sourceNote ? sourceNote.rawContent : summary.content.headlineSummary}
                </div>
              </CardContent>
            )}
          </Card>

          {/* SECTION 6 — PERSONALIZATION PANEL */}
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                Active Personalization Parameters
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* SECTION 3 — LANGUAGE SWITCHER */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-teal-600" />
                  Target Language:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { name: 'English', label: 'English' },
                    { name: 'Tamil', label: 'Tamil (தமிழ்)' },
                    { name: 'Hindi', label: 'Hindi (हिन्दी)' },
                    { name: 'Spanish', label: 'Spanish (Español)' }
                  ].map((l) => (
                    <button
                      key={l.name}
                      onClick={() => setActiveLanguage(l.name as Language)}
                      className={`px-3 py-2 rounded-lg border text-left font-medium transition-all ${
                        activeLanguage === l.name
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 4 — READING LEVEL SWITCHER */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Reading Level:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {['Very Simple', 'Simple', 'Standard', 'Professional'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setActiveLiteracyLevel(lvl as LiteracyLevel)}
                      className={`px-3 py-2 rounded-lg border text-left font-medium transition-all ${
                        activeLiteracyLevel === lvl
                          ? 'bg-teal-900 text-white border-teal-800 font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personalization Indicators list */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Language Adaptation:</span>
                  <span className="font-semibold text-slate-900">{activeLanguage} Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reading Target:</span>
                  <span className="font-semibold text-slate-900">{activeLiteracyLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient-friendly wording:</span>
                  <span className="font-semibold text-emerald-700">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Voice Audio Guide:</span>
                  <span className="font-semibold text-sky-700 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> Available
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: AI-GENERATED PATIENT-FRIENDLY SUMMARY */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visual Header indicating AI-GENERATED OUTPUT */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              AI-Generated Patient-Friendly Summary
            </h2>
            <Badge variant="success" size="sm" className="gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              98% Factual Consistency Match
            </Badge>
          </div>

          {/* SECTION 2 — PATIENT-FRIENDLY CARDS */}
          {isRegenerating ? (
            <LoadingState
              title="Regenerating Patient Instructions..."
              description={`Applying ${activeLanguage} (${activeLiteracyLevel}) adaptation templates.`}
            />
          ) : (
            <div className="space-y-4">
              {/* Card 1: 🩺 Your Condition */}
              <Card className="border-teal-200 shadow-2xs hover:shadow-xs transition-shadow">
                <CardHeader className="p-4 pb-2 border-b border-teal-100 bg-teal-50/40">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Stethoscope className="w-4.5 h-4.5 text-teal-700" />
                    {currentVariant.conditionTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs text-slate-800 leading-relaxed font-medium">
                  <p>{currentVariant.conditionText}</p>
                </CardContent>
              </Card>

              {/* Card 2: 💊 Your Medicines */}
              <Card className="border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
                <CardHeader className="p-4 pb-2 border-b border-slate-100 bg-slate-50/60">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Pill className="w-4.5 h-4.5 text-indigo-600" />
                    {currentVariant.medicinesTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs text-slate-800">
                  {currentVariant.medicinesList.map((med, idx) => (
                    <div key={idx} className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center font-bold text-slate-900 text-xs">
                        <span>{med.name}</span>
                        <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                          {med.dosage}
                        </span>
                      </div>
                      <ul className="space-y-1 text-slate-700 font-medium">
                        {med.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-1.5">
                            <span className="text-teal-600 font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Card 3: 🥗 Food & Diet */}
              <Card className="border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
                <CardHeader className="p-4 pb-2 border-b border-slate-100 bg-slate-50/60">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Utensils className="w-4.5 h-4.5 text-emerald-600" />
                    {currentVariant.dietTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs text-slate-800">
                  <ul className="space-y-1.5 text-slate-700 font-medium">
                    {currentVariant.dietBullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Card 4: 🏃 Activity & Rest */}
              <Card className="border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
                <CardHeader className="p-4 pb-2 border-b border-slate-100 bg-slate-50/60">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4.5 h-4.5 text-sky-600" />
                    {currentVariant.activityTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs text-slate-800">
                  <ul className="space-y-1.5 text-slate-700 font-medium">
                    {currentVariant.activityBullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-sky-600 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Card 5: 📅 Follow-up Appointment */}
              <Card className="border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
                <CardHeader className="p-4 pb-2 border-b border-slate-100 bg-slate-50/60">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-indigo-600" />
                    {currentVariant.followUpTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs text-slate-800 space-y-1.5">
                  <p className="font-semibold text-slate-900">{currentVariant.followUpText}</p>
                  <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-indigo-950">{currentVariant.followUpDoctor}</p>
                      <p className="text-indigo-800 text-[11px]">{currentVariant.followUpTimeframe}</p>
                    </div>
                    <Badge variant="secondary" size="sm">Scheduled</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Card 6: ⚠️ Important Instructions */}
              <Card className="border-rose-200 shadow-2xs bg-rose-50/30">
                <CardHeader className="p-4 pb-2 border-b border-rose-100 bg-rose-50/60">
                  <CardTitle className="text-sm font-bold text-rose-950 flex items-center gap-2">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-600" />
                    {currentVariant.warningsTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs text-rose-900">
                  <ul className="space-y-1.5 font-medium">
                    {currentVariant.warningsBullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL FOR SECTION 8 EDIT ACTION */}
      <Modal
        isOpen={isEditingModalOpen}
        onClose={() => setIsEditingModalOpen(false)}
        title="Edit Discharge Summary Text"
        description="Make clinician adjustments before sending for approval."
        maxWidth="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditingModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEdits}>
              Save Clinician Edits
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Textarea
            rows={5}
            label="Edit Summary Overview Text"
            value={editableHeadline}
            onChange={(e) => setEditableHeadline(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
}
