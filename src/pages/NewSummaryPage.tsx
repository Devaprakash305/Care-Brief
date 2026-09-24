import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { Badge } from '../components/ui/Badge'
import { LoadingState } from '../components/common/LoadingState'
import { useToast } from '../components/ui/Toast'
import { mockPatients, mockClinicalNotes } from '../data/mockData'
import { summaryService } from '../services/mockSummaryService'
import { Language, LiteracyLevel, PreferredFormat, SummarySections, CreateSummaryRequest } from '../types'
import {
  User,
  FileText,
  Sliders,
  CheckSquare,
  Sparkles,
  ShieldCheck,
  UploadCloud,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  Check,
  Info,
  Volume2,
  FileType,
  AlertCircle,
  BookOpen
} from 'lucide-react'

export const NewSummaryPage: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()

  // Current Wizard Step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Step 1: Patient Information State
  const [patientName, setPatientName] = useState('Ravi Kumar')
  const [patientId, setPatientId] = useState('MRN-884920')
  const [age, setAge] = useState<string>('58')
  const [gender, setGender] = useState('Male')

  // Step 2: Clinical Note State
  const [noteTab, setNoteTab] = useState<'paste' | 'upload'>('paste')
  const [clinicalNoteText, setClinicalNoteText] = useState(mockClinicalNotes[0].rawContent)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // Step 3: Patient Preferences State
  const [language, setLanguage] = useState<Language>('Tamil')
  const [literacyLevel, setLiteracyLevel] = useState<LiteracyLevel>('Simple')
  const [preferredFormat, setPreferredFormat] = useState<PreferredFormat>('Text')

  // Step 4: Summary Settings State
  const [sections, setSections] = useState<SummarySections>({
    diagnosis: true,
    medicines: true,
    diet: true,
    activity: true,
    followUp: true,
    warnings: true
  })

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Generation Loading State
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStage, setGenerationStage] = useState('Analyzing clinical note...')

  // Step 1 Validation & Next
  const handleNextStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!patientName.trim()) newErrors.patientName = 'Patient Name is required.'
    if (!patientId.trim()) newErrors.patientId = 'Patient ID / MRN is required.'
    if (!age || Number(age) <= 0) newErrors.age = 'Valid Age is required.'
    if (!gender) newErrors.gender = 'Gender is required.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      showToast('Validation Error', 'Please complete all required patient info fields.', 'error')
      return
    }
    setErrors({})
    setCurrentStep(2)
  }

  // Quick fill patient demo data
  const handleQuickFillPatient = (index: number) => {
    const p = mockPatients[index] || mockPatients[0]
    setPatientName(p.name)
    setPatientId(p.mrn)
    setAge(p.age.toString())
    setGender(p.gender)
    const matchingNote = mockClinicalNotes.find((n) => n.patientId === p.id)
    if (matchingNote) {
      setClinicalNoteText(matchingNote.rawContent)
    }
    showToast('Loaded Patient Demo', `Loaded information for ${p.name}.`, 'info')
  }

  // Step 2 Validation & Next
  const handleNextStep2 = () => {
    if (!clinicalNoteText.trim() || clinicalNoteText.length < 20) {
      setErrors({ clinicalNoteText: 'Please enter or upload a clinical note with at least 20 characters.' })
      showToast('Validation Error', 'Clinical note text is required.', 'error')
      return
    }
    setErrors({})
    setCurrentStep(3)
  }

  // Load synthetic example clinical text
  const handleLoadSyntheticExample = () => {
    const exampleText = `Patient diagnosed with Type 2 Diabetes Mellitus. Continue Metformin 500 mg twice daily with meals. Follow a low-sugar, low-carbohydrate diet. Perform 30 minutes of daily walking exercise. Watch for hypoglycemia signs (glucose < 70 mg/dL). Follow-up with physician in 2 weeks.`
    setClinicalNoteText(exampleText)
    setUploadedFileName(null)
    showToast('Loaded Synthetic Note', 'Sample clinical note text populated.', 'info')
  }

  // Mock File Upload interaction
  const handleMockFileUpload = (fileName: string) => {
    setUploadedFileName(fileName)
    setClinicalNoteText(
      `[IMPORTED FILE: ${fileName}]\nPATIENT CLINICAL DISCHARGE NOTE:\nPatient presented with acute clinical symptoms. Stabilized following inpatient treatment. Discharged on oral medications. Follow-up scheduled in 7 days.`
    )
    showToast('File Uploaded', `Imported note text from ${fileName}.`, 'success')
  }

  // Step 3 Validation & Next
  const handleNextStep3 = () => {
    setCurrentStep(4)
  }

  // Step 4 Validation & Next
  const handleNextStep4 = () => {
    const atLeastOne = Object.values(sections).some((val) => val === true)
    if (!atLeastOne) {
      showToast('Validation Error', 'Please select at least one summary section to include.', 'error')
      return
    }
    setCurrentStep(5)
  }

  // Step 5: Final Submission & Generation Simulation
  const handleGenerateSummary = async () => {
    setIsGenerating(true)
    setGenerationStage('Analyzing clinical note for key medical findings...')

    try {
      const request: CreateSummaryRequest = {
        patientInfo: {
          name: patientName,
          patientId,
          age,
          gender
        },
        clinicalNoteText,
        language,
        literacyLevel,
        preferredFormat,
        sections
      }

      // Step progress timers for mock generation
      setTimeout(() => {
        setGenerationStage('Translating into preferred language & adapting reading level...')
      }, 600)

      setTimeout(() => {
        setGenerationStage('Conducting factual consistency check against source note...')
      }, 1200)

      const result = await summaryService.generateSummary(request)

      setTimeout(() => {
        setIsGenerating(false)
        showToast('Summary Generated!', `Created plain-language summary for ${result.patientName}.`, 'success')
        navigate(`/summary/${result.id}`)
      }, 1800)
    } catch (err) {
      setIsGenerating(false)
      showToast('Generation Error', 'Failed to generate summary.', 'error')
    }
  }

  // Step Labels for Header Progress
  const wizardSteps = [
    { num: 1, label: 'Patient Info', icon: User },
    { num: 2, label: 'Clinical Note', icon: FileText },
    { num: 3, label: 'Preferences', icon: Sliders },
    { num: 4, label: 'Settings', icon: CheckSquare },
    { num: 5, label: 'Review & Generate', icon: Sparkles }
  ]

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <PageHeader
        title="Create New Discharge Summary"
        subtitle="Guided 5-step clinician workflow to generate verified, patient-specific instructions."
      />

      {/* Step Progress Indicator Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="grid grid-cols-5 gap-2">
          {wizardSteps.map((s) => {
            const Icon = s.icon
            const isCompleted = currentStep > s.num
            const isCurrent = currentStep === s.num

            return (
              <button
                key={s.num}
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num)
                }}
                disabled={s.num > currentStep}
                className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 p-2 rounded-lg transition-all text-xs font-semibold ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-2xs ring-2 ring-slate-900 ring-offset-1'
                    : isCompleted
                    ? 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 cursor-pointer'
                    : 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                    isCurrent
                      ? 'bg-teal-400 text-slate-950'
                      : isCompleted
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                </div>
                <span className="hidden md:inline truncate">{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 1: Patient Information */}
      {currentStep === 1 && (
        <Card className="animate-in fade-in duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                Step 1: Patient Information
              </CardTitle>
              <Badge variant="outline" size="sm">Step 1 of 5</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Enter demographic information for the patient receiving discharge instructions.
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Privacy Notice Banner */}
            <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-lg flex items-start gap-2.5 text-xs text-sky-900">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Privacy & Security Guard:</span> Use synthetic or authorized patient information for demonstration purposes. Do not enter unencrypted PHI.
              </div>
            </div>

            {/* Quick Fill Demo Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Quick Fill Demo Patient Data:
              </label>
              <div className="flex flex-wrap gap-2">
                {mockPatients.slice(0, 3).map((p, idx) => (
                  <Button
                    key={p.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickFillPatient(idx)}
                    className="text-xs"
                  >
                    + {p.name} ({p.preferredLanguage})
                  </Button>
                ))}
              </div>
            </div>

            {/* Patient Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Patient Full Name *"
                placeholder="e.g. Ravi Kumar"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                error={errors.patientName}
              />
              <Input
                label="Patient ID / MRN *"
                placeholder="e.g. MRN-884920"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                error={errors.patientId}
              />
              <Input
                label="Age *"
                type="number"
                placeholder="e.g. 58"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                error={errors.age}
              />
              <Select
                label="Gender *"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other / Non-binary', label: 'Other / Non-binary' }
                ]}
                error={errors.gender}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button variant="primary" onClick={handleNextStep1} icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Clinical Note
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Clinical Note */}
      {currentStep === 2 && (
        <Card className="animate-in fade-in duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                Step 2: Clinical Note & Discharge Findings
              </CardTitle>
              <Badge variant="outline" size="sm">Step 2 of 5</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Paste physician observations, EHR discharge summaries, or upload a medical document.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Input Method Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex gap-2">
                <Button
                  variant={noteTab === 'paste' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setNoteTab('paste')}
                >
                  Paste Clinical Text
                </Button>
                <Button
                  variant={noteTab === 'upload' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setNoteTab('upload')}
                  icon={<UploadCloud className="w-3.5 h-3.5" />}
                >
                  Upload Document UI
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSyntheticExample}
                icon={<Sparkles className="w-3.5 h-3.5 text-teal-600" />}
              >
                Load Example Clinical Note
              </Button>
            </div>

            {/* Tab 1: Paste Text Editor */}
            {noteTab === 'paste' && (
              <div>
                <Textarea
                  rows={8}
                  label="Physician Clinical Note *"
                  placeholder="Paste physician note, hospital course, discharge diagnoses, and medication instructions here..."
                  value={clinicalNoteText}
                  onChange={(e) => setClinicalNoteText(e.target.value)}
                  error={errors.clinicalNoteText}
                />
                <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
                  <span>Character count: {clinicalNoteText.length} characters</span>
                  <span className="italic">Supports raw EHR text or dictation outputs</span>
                </div>
              </div>
            )}

            {/* Tab 2: Upload Document UI Mock */}
            {noteTab === 'upload' && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragOver(true)
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragOver(false)
                    handleMockFileUpload('Discharge_Summary_EHR_Doc.pdf')
                  }}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isDragOver
                      ? 'border-teal-500 bg-teal-50/50'
                      : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-teal-600 mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-sm text-slate-800">
                    Drag and drop clinical document here
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Supported file formats: <span className="font-semibold text-slate-700">PDF, TXT, DOCX, PNG/JPG</span>
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMockFileUpload('Discharge_Note_Scan.pdf')}
                    >
                      Browse PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMockFileUpload('Physician_Dictation.txt')}
                    >
                      Browse TXT
                    </Button>
                  </div>
                </div>

                {uploadedFileName && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2 font-medium">
                      <FileType className="w-4 h-4 text-emerald-600" />
                      <span>Loaded Document: {uploadedFileName}</span>
                    </div>
                    <Badge variant="success" size="sm">Mock Extracted</Badge>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Extracted Clinical Text Preview:
                  </label>
                  <Textarea
                    rows={6}
                    value={clinicalNoteText}
                    onChange={(e) => setClinicalNoteText(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Character count: {clinicalNoteText.length} characters
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNextStep2} icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Preferences
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Patient Preferences */}
      {currentStep === 3 && (
        <Card className="animate-in fade-in duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700" />
                Step 3: Patient Language & Literacy Preferences
              </CardTitle>
              <Badge variant="outline" size="sm">Step 3 of 5</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Customize translation target and reading comprehension level for the patient.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Preferred Language Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Target Patient Language:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { name: 'Tamil', native: 'தமிழ்' },
                  { name: 'English', native: 'English' },
                  { name: 'Hindi', native: 'हिन्दी' },
                  { name: 'Telugu', native: 'తెలుగు' },
                  { name: 'Malayalam', native: 'മലയാളം' },
                  { name: 'Kannada', native: 'ಕನ್ನಡ' },
                  { name: 'Spanish', native: 'Español' },
                  { name: 'Bengali', native: 'বাংলা' },
                  { name: 'Mandarin', native: '中文' }
                ].map((l) => {
                  const isSelected = language === l.name
                  return (
                    <button
                      key={l.name}
                      type="button"
                      onClick={() => setLanguage(l.name as Language)}
                      className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900 shadow-2xs'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs">{l.name}</span>
                      <span className={`text-[11px] mt-0.5 ${isSelected ? 'text-teal-300' : 'text-slate-500'}`}>
                        {l.native}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Literacy Level Visual Selection Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Literacy Level & Reading Target:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    level: 'Very Simple',
                    grade: 'Grade 3-5 Level',
                    desc: 'Short sentences and everyday words. Best for limited health literacy.',
                    example: 'Take 1 pill every morning with water.'
                  },
                  {
                    level: 'Simple',
                    grade: 'Grade 5-6 Level',
                    desc: 'Easy-to-understand language with common words and clear headings.',
                    example: 'Take Metformin once daily after breakfast to lower blood sugar.'
                  },
                  {
                    level: 'Standard',
                    grade: 'Grade 8-9 Level',
                    desc: 'Standard patient English with mild medical terms explained simply.',
                    example: 'Continue taking prescribed anti-diabetic medication with daily blood glucose checks.'
                  },
                  {
                    level: 'Professional',
                    grade: 'Clinical Summary',
                    desc: 'Detailed clinical language suitable for caregiver healthcare workers.',
                    example: 'Maintain oral hypoglycemic agent regimen with QD fasting capillary glucose logs.'
                  }
                ].map((lit) => {
                  const isSelected = literacyLevel === lit.level
                  return (
                    <div
                      key={lit.level}
                      onClick={() => setLiteracyLevel(lit.level as LiteracyLevel)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-teal-950 text-white border-teal-800 shadow-md ring-2 ring-teal-600'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm">{lit.level}</h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {lit.grade}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {lit.desc}
                        </p>
                      </div>

                      <div className={`mt-3 p-2 rounded text-[11px] font-mono ${
                        isSelected ? 'bg-slate-900/80 text-teal-200' : 'bg-slate-50 text-slate-600 border border-slate-100'
                      }`}>
                        Ex: "{lit.example}"
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Preferred Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Instruction Format:
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setPreferredFormat('Text')}
                  className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
                    preferredFormat === 'Text'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-teal-400" />
                  <div>
                    <p className="font-bold text-xs">Text Only</p>
                    <p className="text-[11px] opacity-75">Standard printed sheet</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredFormat('Text + Audio')}
                  className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
                    preferredFormat === 'Text + Audio'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-teal-400" />
                  <div>
                    <p className="font-bold text-xs">Text + Audio</p>
                    <p className="text-[11px] opacity-75">Voice guide support</p>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNextStep3} icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Summary Settings
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Summary Settings */}
      {currentStep === 4 && (
        <Card className="animate-in fade-in duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-slate-700" />
                Step 4: Summary Content & Section Selection
              </CardTitle>
              <Badge variant="outline" size="sm">Step 4 of 5</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Select which clinical sections to include in the generated patient discharge guide.
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Section Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'diagnosis', label: 'Diagnosis & Primary Condition', desc: 'Plain-language explanation of why patient was admitted.' },
                { key: 'medicines', label: 'Medicines & Dosage Schedule', desc: 'Clear medicine names, dosages, timings, and instructions.' },
                { key: 'diet', label: 'Dietary & Nutrition Guidelines', desc: 'Food choices, hydration limits, and meal instructions.' },
                { key: 'activity', label: 'Physical Activity & Rest', desc: 'Exercise limits, wound care, and daily rest guidelines.' },
                { key: 'followUp', label: 'Follow-up Appointments', desc: 'Doctor appointments, lab schedules, and clinic dates.' },
                { key: 'warnings', label: 'Important Warning Instructions', desc: 'Critical red-flag symptoms when to seek emergency care.' }
              ].map((item) => {
                const isChecked = sections[item.key as keyof SummarySections]
                return (
                  <label
                    key={item.key}
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-teal-50/70 border-teal-200/90 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setSections({ ...sections, [item.key]: e.target.checked })
                      }
                      className="mt-1 w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{item.label}</span>
                      <span className="text-xs text-slate-500 mt-0.5 block leading-relaxed">{item.desc}</span>
                    </div>
                  </label>
                )
              })}
            </div>

            {/* AI Factual Note */}
            <div className="p-3.5 bg-slate-900 text-white rounded-lg text-xs flex items-center gap-3 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
              <p className="leading-relaxed text-slate-300">
                <span className="font-bold text-white">AI Factual Scope Guard:</span> AI will only generate content based on the provided clinical information. Hallucinations or unmentioned treatments are strictly blocked.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(3)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNextStep4} icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Final Review
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 5: Review & Generate */}
      {currentStep === 5 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {isGenerating ? (
            <LoadingState
              title={generationStage}
              description="Processing synthetic clinical note into multi-lingual plain language with 100% claim verification."
            />
          ) : (
            <Card className="border-teal-200 shadow-md">
              <CardHeader className="bg-slate-900 text-white rounded-t-xl p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="success" size="sm" className="bg-teal-500/20 text-teal-300 border-teal-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Ready for Generation
                  </Badge>
                  <span className="text-xs text-slate-400">Step 5 of 5</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">Final Summary Review</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Verify configuration before triggering CareBrief AI generation engine.
                </p>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Summary Grid Review Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Patient Info */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient Demographic</span>
                    <h4 className="font-bold text-sm text-slate-900">{patientName}</h4>
                    <p className="text-xs text-slate-600">ID: {patientId} | Age: {age}y | Gender: {gender}</p>
                  </div>

                  {/* Card 2: Language & Literacy */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Preferences</span>
                    <h4 className="font-bold text-sm text-slate-900">{language} Language</h4>
                    <p className="text-xs text-slate-600">Literacy Target: {literacyLevel} | Format: {preferredFormat}</p>
                  </div>
                </div>

                {/* Card 3: Clinical Note Preview */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Clinical Note Input</span>
                    <span>{clinicalNoteText.length} Characters</span>
                  </div>
                  <p className="text-xs font-mono text-slate-800 bg-white p-3 rounded-lg border border-slate-200 max-h-28 overflow-y-auto leading-relaxed">
                    {clinicalNoteText}
                  </p>
                </div>

                {/* Card 4: Selected Sections */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">Included Sections:</span>
                  <div className="flex flex-wrap gap-2">
                    {sections.diagnosis && <Badge variant="secondary">✓ Diagnosis</Badge>}
                    {sections.medicines && <Badge variant="secondary">✓ Medicines</Badge>}
                    {sections.diet && <Badge variant="secondary">✓ Diet</Badge>}
                    {sections.activity && <Badge variant="secondary">✓ Activity</Badge>}
                    {sections.followUp && <Badge variant="secondary">✓ Follow-up</Badge>}
                    {sections.warnings && <Badge variant="secondary">✓ Warning Instructions</Badge>}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between bg-slate-50 p-5">
                <Button variant="outline" onClick={() => setCurrentStep(4)} icon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Settings
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGenerateSummary}
                  className="bg-teal-600 hover:bg-teal-700 text-white shadow-md font-bold"
                  icon={<Sparkles className="w-5 h-5 text-teal-200" />}
                >
                  Generate Patient Summary
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
