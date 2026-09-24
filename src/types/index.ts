export type SummaryStatus = 'draft' | 'awaiting_review' | 'edited' | 'approved' | 'released'

export type UserRole = 'clinician' | 'doctor' | 'patient' | 'admin'

export type Language = 
  | 'English' 
  | 'Tamil'
  | 'Hindi'
  | 'Telugu'
  | 'Malayalam'
  | 'Kannada'
  | 'Spanish' 
  | 'Bengali' 
  | 'Vietnamese' 
  | 'Mandarin'

export type LiteracyLevel = 
  | 'Professional'
  | 'Standard' 
  | 'Simple' 
  | 'Very Simple'
  | 'Very Simple (Grade 3-5)' 
  | 'Visual/Bullet Focus'

export type PreferredFormat = 'Text' | 'Text + Audio'

export interface SummarySections {
  diagnosis: boolean
  medicines: boolean
  diet: boolean
  activity: boolean
  followUp: boolean
  warnings: boolean
}

export interface Patient {
  id: string
  mrn: string
  name: string
  age: number
  gender: string
  primaryDiagnosis: string
  preferredLanguage: Language
  readingLevel: LiteracyLevel
  roomNumber: string
  admissionDate: string
  dischargeDate: string
  attendingPhysician: string
  whatsappNumber?: string
}

export interface ClinicalNoteSection {
  title: string
  content: string
}

export interface ClinicalNote {
  id: string
  patientId: string
  patientName: string
  author: string
  noteType: string
  createdDate: string
  rawContent: string
  sections: {
    hospitalCourse: string
    dischargeDiagnoses: string
    medicationsOnDischarge: string
    dischargeInstructions: string
    followUpPlan: string
    warningSigns: string
  }
}

export interface VerificationItem {
  id: string
  claim: string
  sourceQuote: string
  status: 'verified' | 'discrepancy' | 'unsupported'
  explanation: string
}

export interface VerificationResult {
  overallStatus: 'verified' | 'warning' | 'flagged'
  confidenceScore: number // e.g. 98 for 98%
  checkedItemsCount: number
  flagCount: number
  items: VerificationItem[]
}

export type ClaimStatus = 'SUPPORTED' | 'SIMPLIFIED' | 'POTENTIAL MISMATCH'
export type ClaimCategory = 'Medication dosage' | 'Follow-up timeframe' | 'Diagnosis' | 'Dietary rule' | 'Warning threshold'
export type ClaimSeverity = 'High attention' | 'Medium' | 'Low info'

export interface ClaimComparison {
  id: string
  sourceQuote: string
  generatedClaim: string
  status: ClaimStatus
  category?: ClaimCategory
  severity?: ClaimSeverity
  explanation?: string
  mismatchDetail?: {
    sourceValue: string
    generatedValue: string
  }
}

export interface ReadabilityMetric {
  fleschEase: number
  readingLevel: string
  sentenceCount: number
  avgSentenceLength: number
  complexWordsPct: number
}

export interface VerificationReport {
  summaryId: string
  patientName: string
  claimsChecked: number
  supportedClaims: number
  simplifiedClaims: number
  mismatches: number
  sourceSupportScore: number // e.g. 91.7
  readabilityBefore: ReadabilityMetric
  readabilityAfter: ReadabilityMetric
  readabilityImprovementPoints: number // e.g. 34
  claims: ClaimComparison[]
  rawClinicalSnippet: string
  simplifiedSnippet: string
}

export interface DischargeSummaryContent {
  headlineSummary: string
  medicationGuide: {
    name: string
    dosage: string
    frequency: string
    purpose: string
    instructions: string
  }[]
  warningSignsWhenToCall: string[]
  followUpAppointments: {
    doctor: string
    timeframe: string
    purpose: string
  }[]
  dailyCareAndDiet: string[]
}

export interface DischargeSummary {
  id: string
  noteId: string
  patientId: string
  patientName: string
  whatsappNumber?: string
  condition: string
  language: Language
  readingLevel: LiteracyLevel
  format?: PreferredFormat
  sectionsIncluded?: SummarySections
  status: SummaryStatus
  originalFKGL: number // Flesch-Kincaid Grade Level before simplification
  simplifiedFKGL: number // Flesch-Kincaid Grade Level after simplification
  readabilityImprovementPct: number // e.g. 38 for +38%
  content: DischargeSummaryContent
  verification: VerificationResult
  createdAt: string
  updatedAt: string
  reviewedBy?: string
  reviewedAt?: string
  clinicianNotes?: string
  pdfUrl?: string
  deliveryStatus?: 'pending' | 'ready_to_send' | 'sending' | 'sent' | 'delivery_failed'
  deliveryError?: string
  releasedAt?: string
}

export interface CreateSummaryRequest {
  patientInfo: {
    name: string
    patientId: string // MRN
    age: number | string
    gender: string
    whatsappNumber: string
  }
  clinicalNoteText: string
  language: Language
  literacyLevel: LiteracyLevel
  preferredFormat: PreferredFormat
  sections: SummarySections
}

export interface DashboardStats {
  summariesCreated: number
  awaitingReview: number
  approvedToday: number
  avgReadabilityImprovement: number
}

export type ActivityAction = 
  | 'Summary generated'
  | 'Fact check completed'
  | 'Clinician edited'
  | 'Summary approved'
  | 'Released to patient'

export interface ActivityLog {
  id: string
  summaryId: string
  patientName: string
  action: ActivityAction
  timestamp: string
  actor: string
}

export interface UserProfile {
  id?: string
  authUserId?: string
  name: string
  role: UserRole | string
  department: string
  hospital: string
  avatarUrl?: string
  email: string
}
