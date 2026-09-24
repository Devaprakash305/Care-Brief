import {
  DischargeSummary,
  ClinicalNote,
  Patient,
  DashboardStats,
  ActivityLog,
  SummaryStatus,
  Language,
  LiteracyLevel,
  UserProfile,
  CreateSummaryRequest
} from '../types'
import {
  mockDischargeSummaries,
  mockClinicalNotes,
  mockPatients,
  mockDashboardStats,
  mockActivityTimeline,
  mockCurrentUser
} from '../data/mockData'

const DELAY_MS = 350

const delay = <T>(data: T, ms = DELAY_MS): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

export class MockSummaryService {
  private summaries: DischargeSummary[] = [...mockDischargeSummaries]
  private notes: ClinicalNote[] = [...mockClinicalNotes]
  private patients: Patient[] = [...mockPatients]
  private activities: ActivityLog[] = [...mockActivityTimeline]

  async getCurrentUser(): Promise<UserProfile> {
    return delay(mockCurrentUser, 150)
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const awaitingCount = this.summaries.filter(
      (s) => s.status === 'awaiting_review' || s.status === 'edited'
    ).length

    const approvedCount = this.summaries.filter(
      (s) => s.status === 'approved' || s.status === 'released'
    ).length

    const stats: DashboardStats = {
      ...mockDashboardStats,
      awaitingReview: awaitingCount,
      approvedToday: approvedCount
    }
    return delay(stats)
  }

  async getRecentSummaries(limit?: number): Promise<DischargeSummary[]> {
    const sorted = [...this.summaries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return delay(limit ? sorted.slice(0, limit) : sorted)
  }

  async getSummaryById(id: string): Promise<DischargeSummary | null> {
    const summary = this.summaries.find((s) => s.id === id) || null
    return delay(summary)
  }

  async getClinicalNoteById(id: string): Promise<ClinicalNote | null> {
    const note = this.notes.find((n) => n.id === id) || null
    return delay(note)
  }

  async getAllClinicalNotes(): Promise<ClinicalNote[]> {
    return delay([...this.notes])
  }

  async getAllPatients(): Promise<Patient[]> {
    return delay([...this.patients])
  }

  async getActivityTimeline(): Promise<ActivityLog[]> {
    return delay([...this.activities])
  }

  async generateSummary(request: CreateSummaryRequest | {
    patientId: string
    noteText?: string
    noteId?: string
    language: Language
    readingLevel: LiteracyLevel
  }): Promise<DischargeSummary> {
    const newId = `SUM-${Math.floor(100 + Math.random() * 900)}`
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    let patientName = 'Ravi Kumar'
    let patientIdStr = 'PAT-001'
    let language: Language = 'Tamil'
    let readingLevel: LiteracyLevel = 'Simple'
    let clinicalNote = ''

    if ('patientInfo' in request) {
      patientName = request.patientInfo.name || 'Synthetic Patient'
      patientIdStr = request.patientInfo.patientId || 'PAT-NEW'
      language = request.language
      readingLevel = request.literacyLevel
      clinicalNote = request.clinicalNoteText
    } else {
      const p = this.patients.find((pt) => pt.id === request.patientId) || this.patients[0]
      patientName = p.name
      patientIdStr = p.id
      language = request.language
      readingLevel = request.readingLevel
      clinicalNote = request.noteText || ''
    }

    // Extract condition keyword or default
    const conditionKeyword = clinicalNote.toLowerCase().includes('diabetes')
      ? 'Type 2 Diabetes'
      : clinicalNote.toLowerCase().includes('heart') || clinicalNote.toLowerCase().includes('chf')
      ? 'Congestive Heart Failure'
      : clinicalNote.toLowerCase().includes('pneumonia')
      ? 'Bacterial Pneumonia'
      : 'Acute Medical Discharge'

    const newSummary: DischargeSummary = {
      id: newId,
      noteId: `NOTE-${newId}`,
      patientId: patientIdStr,
      patientName,
      condition: conditionKeyword,
      language,
      readingLevel,
      status: 'awaiting_review',
      originalFKGL: 13.8,
      simplifiedFKGL: readingLevel === 'Very Simple' ? 4.2 : 5.4,
      readabilityImprovementPct: readingLevel === 'Very Simple' ? 44 : 36,
      createdAt: timestamp,
      updatedAt: timestamp,
      content: {
        headlineSummary: `This simplified instruction set explains your hospital discharge care for ${conditionKeyword}. Take your prescribed medications and follow all daily instructions closely.`,
        medicationGuide: [
          {
            name: 'Primary Discharge Prescription',
            dosage: 'As instructed on bottle',
            frequency: 'Twice Daily with Meals',
            purpose: 'Controls symptoms and prevents hospital readmission.',
            instructions: 'Take with a full glass of water. Do not skip doses.'
          }
        ],
        warningSignsWhenToCall: [
          'Fever higher than 100.4°F (38°C) or chills',
          'Sudden shortness of breath, dizziness, or chest tightness',
          'Uncontrolled pain unresponsive to prescribed medication'
        ],
        followUpAppointments: [
          {
            doctor: 'Primary Care Physician / Outpatient Clinic',
            timeframe: 'In 7 to 14 days',
            purpose: 'Routine post-discharge clinical checkup'
          }
        ],
        dailyCareAndDiet: [
          'Get 8 hours of restful sleep every night.',
          'Follow recommended dietary restrictions and drink adequate water.'
        ]
      },
      verification: {
        overallStatus: 'verified',
        confidenceScore: 98,
        checkedItemsCount: 12,
        flagCount: 0,
        items: [
          {
            id: `V-${newId}-1`,
            claim: 'Medication instructions match physician discharge note.',
            sourceQuote: 'Prescribed medication schedule matches clinical note.',
            status: 'verified',
            explanation: 'Verified against physician source text.'
          },
          {
            id: `V-${newId}-2`,
            claim: 'Follow-up timeframe matches doctor plan.',
            sourceQuote: 'Follow up in clinic in 1 to 2 weeks.',
            status: 'verified',
            explanation: 'Verified against source note.'
          }
        ]
      }
    }

    this.summaries.unshift(newSummary)

    // Add activity record
    this.activities.unshift({
      id: `ACT-${Date.now()}`,
      summaryId: newId,
      patientName,
      action: 'Summary generated',
      timestamp: 'Just now',
      actor: 'CareBrief AI Engine'
    })

    return delay(newSummary, 1200) // 1.2s delay to simulate AI generation
  }

  async updateSummary(
    id: string,
    updates: Partial<DischargeSummary>
  ): Promise<DischargeSummary> {
    const index = this.summaries.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error(`Summary with ID ${id} not found`)
    }

    const updated = {
      ...this.summaries[index],
      ...updates,
      updatedAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }

    this.summaries[index] = updated

    if (updates.status === 'edited') {
      this.activities.unshift({
        id: `ACT-${Date.now()}`,
        summaryId: id,
        patientName: updated.patientName,
        action: 'Clinician edited',
        timestamp: 'Just now',
        actor: 'Dr. Ananya Sharma'
      })
    } else if (updates.status === 'approved') {
      this.activities.unshift({
        id: `ACT-${Date.now()}`,
        summaryId: id,
        patientName: updated.patientName,
        action: 'Summary approved',
        timestamp: 'Just now',
        actor: 'Dr. Ananya Sharma'
      })
    }

    return delay(updated)
  }

  async approveSummary(id: string, clinicianNotes?: string): Promise<DischargeSummary> {
    return this.updateSummary(id, {
      status: 'approved',
      reviewedBy: 'Dr. Ananya Sharma',
      reviewedAt: new Date().toLocaleString(),
      clinicianNotes
    })
  }
}

export const summaryService = new MockSummaryService()
