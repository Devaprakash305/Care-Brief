import {
  ActivityLog,
  ClinicalNote,
  CreateSummaryRequest,
  DashboardStats,
  DischargeSummary,
  Patient,
  UserProfile
} from '../types'
import { supabase } from '../lib/supabase'
import { jsPDF } from 'jspdf'

const json = <T>(value: unknown, fallback: T): T => (value && typeof value === 'object' ? value as T : fallback)

const emptyVerification: DischargeSummary['verification'] = {
  overallStatus: 'warning',
  confidenceScore: 0,
  checkedItemsCount: 0,
  flagCount: 0,
  items: []
}

const languageCodes: Record<string, string> = {
  English: 'en',
  Tamil: 'ta',
  Hindi: 'hi',
  Telugu: 'te',
  Malayalam: 'ml',
  Kannada: 'kn',
  Spanish: 'es',
  Bengali: 'bn',
  Vietnamese: 'vi',
  Mandarin: 'zh'
}

const legacyLanguageCodes = new Set(['en', 'ta', 'hi'])

const literacyCodes: Record<string, string> = {
  Professional: 'professional',
  Standard: 'standard',
  Simple: 'simple',
  'Very Simple': 'very_simple',
  'Very Simple (Grade 3-5)': 'very_simple',
  'Visual/Bullet Focus': 'visual_bullet'
}

async function generateWithOpenRouter(request: CreateSummaryRequest) {
  const { data, error } = await supabase.functions.invoke('generate-summary', {
    body: request
  })
  if (error) throw error
  return data as {
    condition: string
    content: DischargeSummary['content']
    verification: DischargeSummary['verification']
    originalFKGL: number
    simplifiedFKGL: number
    readabilityImprovementPct: number
  }
}

function mapSummary(row: Record<string, unknown>): DischargeSummary {
  return {
    ...row,
    noteId: row.noteId ?? row.note_id ?? row.clinical_note_id,
    patientId: row.patientId ?? row.patient_id,
    patientName: row.patientName ?? row.patient_name,
    whatsappNumber: String(row.whatsappNumber ?? row.whatsapp_number ?? ''),
    language: row.language ?? row.language_code ?? 'English',
    readingLevel: row.readingLevel ?? row.reading_level ?? 'Standard',
    sectionsIncluded: json(row.sectionsIncluded ?? row.sections_included, undefined),
    originalFKGL: Number(row.originalFKGL ?? row.original_fkgl ?? 0),
    simplifiedFKGL: Number(row.simplifiedFKGL ?? row.simplified_fkgl ?? 0),
    readabilityImprovementPct: Number(row.readabilityImprovementPct ?? row.readability_improvement_pct ?? 0),
    content: json(row.content, { headlineSummary: '', medicationGuide: [], warningSignsWhenToCall: [], followUpAppointments: [], dailyCareAndDiet: [] }),
    verification: json(row.verification, emptyVerification),
    createdAt: String(row.createdAt ?? row.created_at ?? ''),
    updatedAt: String(row.updatedAt ?? row.updated_at ?? ''),
    pdfUrl: row.pdfUrl ?? row.pdf_url ?? undefined,
    deliveryStatus: (row.deliveryStatus ?? row.delivery_status ?? 'pending') as DischargeSummary['deliveryStatus'],
    deliveryError: row.deliveryError ?? row.delivery_error ?? undefined,
    releasedAt: String(row.releasedAt ?? row.released_at ?? '')
  } as unknown as DischargeSummary
}

async function uploadPdfToStorage(summary: DischargeSummary, pdfBlob: Blob): Promise<string> {
  const safeName = (summary.patientName || 'patient').replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '-')
  const filePath = `${summary.patientId || 'unknown-patient'}/${summary.id}-${Date.now()}.pdf`

  const { data, error } = await supabase.storage.from('discharge-pdfs').upload(filePath, pdfBlob, {
    contentType: 'application/pdf',
    upsert: false
  })

  if (error) throw new Error(`PDF upload failed: ${error.message}`)
  if (!data?.path) throw new Error('PDF upload succeeded but the storage path was not returned.')

  const { data: signedData, error: signedError } = await supabase.storage
    .from('discharge-pdfs')
    .createSignedUrl(data.path, 60 * 60)

  if (signedError || !signedData?.signedUrl) {
    throw new Error(`The uploaded PDF could not be made available for WhatsApp delivery: ${signedError?.message || 'signed URL unavailable'}`)
  }

  return signedData.signedUrl
}

function mapNote(row: Record<string, unknown>): ClinicalNote {
  return {
    ...row,
    patientId: String(row.patientId ?? row.patient_id ?? ''),
    patientName: String(row.patientName ?? row.patient_name ?? ''),
    author: String(row.author ?? row.created_by ?? ''),
    noteType: String(row.noteType ?? row.note_type ?? row.title ?? 'Clinical Note'),
    rawContent: String(row.rawContent ?? row.raw_text ?? row.raw_content ?? ''),
    createdDate: String(row.createdDate ?? row.created_date ?? '')
  } as ClinicalNote
}

function mapPatient(row: Record<string, unknown>): Patient {
  return {
    ...row,
    id: String(row.id ?? ''),
    mrn: String(row.mrn ?? row.patient_code ?? ''),
    name: String(row.name ?? row.full_name ?? ''),
    age: Number(row.age ?? row.patient_age ?? 0),
    gender: String(row.gender ?? ''),
    primaryDiagnosis: String(row.primaryDiagnosis ?? row.primary_diagnosis ?? ''),
    preferredLanguage: row.preferredLanguage ?? row.preferred_language ?? 'English',
    readingLevel: row.readingLevel ?? row.reading_level ?? 'Standard',
    roomNumber: String(row.roomNumber ?? row.room_number ?? ''),
    admissionDate: String(row.admissionDate ?? row.admission_date ?? ''),
    dischargeDate: String(row.dischargeDate ?? row.discharge_date ?? ''),
    attendingPhysician: String(row.attendingPhysician ?? row.attending_physician ?? ''),
    whatsappNumber: String(row.whatsappNumber ?? row.whatsapp_number ?? '')
  } as Patient
}

function mapActivity(row: Record<string, unknown>): ActivityLog {
  return {
    ...row,
    summaryId: row.summaryId ?? row.summary_id,
    patientName: row.patientName ?? row.patient_name,
    timestamp: row.timestamp ?? row.created_at
  } as ActivityLog
}

export class SupabaseSummaryService {
  async getCurrentUser(): Promise<UserProfile> {
    const { data, error } = await supabase.from('user_profiles').select('*').limit(1).maybeSingle()
    if (error) throw error
    if (!data) return { name: 'Clinician', role: '', department: '', hospital: '', email: '' }
    const row = data as Record<string, unknown>
    return {
      name: String(row.name || 'Clinician'),
      role: String(row.role || ''),
      department: String(row.department || ''),
      hospital: String(row.hospital || ''),
      email: String(row.email || ''),
      avatarUrl: (row.avatarUrl ?? row.avatar_url) as string | undefined
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const { data, error } = await supabase.from('discharge_summaries').select('*')
    if (error) throw error
    const rows = (data || []) as Record<string, unknown>[]
    const approvedToday = rows.filter((row) => ['approved', 'released'].includes(String(row.status))).length
    const awaitingReview = rows.filter((row) => ['awaiting_review', 'edited'].includes(String(row.status))).length
    const improvements = rows.map((row) => Number(row.readabilityImprovementPct ?? row.readability_improvement_pct ?? 0)).filter(Boolean)
    return {
      summariesCreated: rows.length,
      awaitingReview,
      approvedToday,
      avgReadabilityImprovement: improvements.length ? Math.round(improvements.reduce((sum, value) => sum + value, 0) / improvements.length) : 0
    }
  }

  async getRecentSummaries(limit?: number): Promise<DischargeSummary[]> {
    let query = supabase.from('discharge_summaries').select('*').order('created_at', { ascending: false })
    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error) throw error
    return ((data || []) as Record<string, unknown>[]).map(mapSummary)
  }

  async getSummaryById(id: string): Promise<DischargeSummary | null> {
    const { data, error } = await supabase.from('discharge_summaries').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? mapSummary(data as Record<string, unknown>) : null
  }

  async getClinicalNoteById(id: string): Promise<ClinicalNote | null> {
    const { data, error } = await supabase.from('clinical_notes').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? mapNote(data as Record<string, unknown>) : null
  }

  async getAllClinicalNotes(): Promise<ClinicalNote[]> {
    const { data, error } = await supabase.from('clinical_notes').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return ((data || []) as Record<string, unknown>[]).map(mapNote)
  }

  async getAllPatients(): Promise<Patient[]> {
    try {
      const { data, error } = await supabase.from('patients').select('*')
      if (error) throw error
      return ((data || []) as Record<string, unknown>[]).map(mapPatient)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (!/age.*patients|patients.*age|column.*age.*does not exist|Could not find the 'age' column/i.test(message)) {
        throw error
      }

      const { data, error: fallbackError } = await supabase
        .from('patients')
        .select('id, mrn, name, gender, primary_diagnosis, preferred_language, reading_level, room_number, admission_date, discharge_date, attending_physician, whatsapp_number')

      if (fallbackError) throw fallbackError
      return ((data || []) as Record<string, unknown>[]).map(mapPatient)
    }
  }

  async getActivityTimeline(): Promise<ActivityLog[]> {
    const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return ((data || []) as Record<string, unknown>[]).map(mapActivity)
  }

  async generateSummary(request: CreateSummaryRequest): Promise<DischargeSummary> {
    const now = new Date().toISOString()
    const summaryId = crypto.randomUUID()
    const generated = await generateWithOpenRouter(request)
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) throw userError || new Error('Supabase user session is unavailable')

    const { data: existingPatient, error: patientLookupError } = await supabase
      .from('patients')
      .select('id')
      .eq('mrn', request.patientInfo.patientId)
      .maybeSingle()
    if (patientLookupError) throw patientLookupError

    const patientAge = Number(request.patientInfo.age || 0)
    const basePatientPayload = {
      mrn: request.patientInfo.patientId,
      name: request.patientInfo.name,
      gender: request.patientInfo.gender,
      whatsapp_number: request.patientInfo.whatsappNumber,
      preferred_language: request.language,
      reading_level: request.literacyLevel
    }

    let patientId = existingPatient?.id as string | undefined
    if (!patientId) {
      patientId = crypto.randomUUID()
      const insertPayload = {
        id: patientId,
        ...basePatientPayload,
        age: patientAge
      }
      const { error } = await supabase.from('patients').insert(insertPayload)
      if (error) {
        const message = error.message || ''
        if (/age.*patients|patients.*age|column.*age.*does not exist|Could not find the 'age' column/i.test(message)) {
          const { error: fallbackError } = await supabase.from('patients').insert({
            id: patientId,
            ...basePatientPayload
          })
          if (fallbackError) throw fallbackError
        } else {
          throw error
        }
      }
    } else {
      const updatePayload = {
        ...basePatientPayload,
        age: patientAge
      }
      const { error: updateError } = await supabase
        .from('patients')
        .update(updatePayload)
        .eq('id', patientId)
      if (updateError) {
        const message = updateError.message || ''
        if (/age.*patients|patients.*age|column.*age.*does not exist|Could not find the 'age' column/i.test(message)) {
          const { error: fallbackError } = await supabase
            .from('patients')
            .update(basePatientPayload)
            .eq('id', patientId)
          if (fallbackError) throw fallbackError
        } else {
          throw updateError
        }
      }
    }

    const noteId = crypto.randomUUID()
    const { error: noteError } = await supabase.from('clinical_notes').insert({
      id: noteId,
      patient_id: patientId,
      created_by: userData.user.id,
      title: `${request.patientInfo.name} Clinical Note`,
      raw_text: request.clinicalNoteText,
      status: 'draft',
      created_at: now,
      updated_at: now
    })
    if (noteError) throw noteError

    const summary = {
      id: summaryId,
      clinical_note_id: noteId,
      patient_id: patientId,
      patient_name: request.patientInfo.name,
      condition: generated.condition,
      language_code: legacyLanguageCodes.has(languageCodes[request.language]) ? languageCodes[request.language] : 'en',
      literacy_level_code: literacyCodes[request.literacyLevel] || request.literacyLevel.toLowerCase(),
      language: request.language,
      reading_level: request.literacyLevel,
      whatsapp_number: request.patientInfo.whatsappNumber,
      format: request.preferredFormat,
      sections_included: request.sections,
      status: 'awaiting_review',
      generated_by: userData.user.id,
      generated_at: now,
      original_fkgl: generated.originalFKGL,
      simplified_fkgl: generated.simplifiedFKGL,
      readability_improvement_pct: generated.readabilityImprovementPct,
      content: generated.content,
      verification: generated.verification || emptyVerification,
      created_at: now,
      updated_at: now
    }
    const { data, error } = await supabase.from('discharge_summaries').insert(summary).select().single()
    if (error) throw error
    return mapSummary(data as Record<string, unknown>)
  }

  async updateSummary(id: string, updates: Partial<DischargeSummary>): Promise<DischargeSummary> {
    const databaseUpdates: Record<string, unknown> = {}
    const databaseKeys: Record<string, string> = {
      condition: 'condition',
      whatsappNumber: 'whatsapp_number',
      language: 'language',
      readingLevel: 'reading_level',
      format: 'format',
      sectionsIncluded: 'sections_included',
      status: 'status',
      originalFKGL: 'original_fkgl',
      simplifiedFKGL: 'simplified_fkgl',
      readabilityImprovementPct: 'readability_improvement_pct',
      content: 'content',
      verification: 'verification',
      reviewedAt: 'reviewed_at',
      reviewedBy: 'reviewed_by',
      clinicianNotes: 'clinician_notes',
      pdfUrl: 'pdf_url',
      deliveryStatus: 'delivery_status',
      deliveryError: 'delivery_error',
      releasedAt: 'released_at'
    }
    for (const [key, value] of Object.entries(updates)) {
      const databaseKey = databaseKeys[key]
      if (!databaseKey || value === undefined) continue
      if (['originalFKGL', 'simplifiedFKGL', 'readabilityImprovementPct'].includes(key) && !Number.isFinite(Number(value))) continue
      databaseUpdates[databaseKey] = value
    }
    const { error } = await supabase.from('discharge_summaries').update(databaseUpdates).eq('id', id)
    if (error) throw new Error(`Failed to update discharge summary: ${error.message} (${error.code || 'unknown'})`)
    const updated = await this.getSummaryById(id)
    if (!updated) throw new Error('The discharge summary was updated but could not be reloaded.')
    return updated
  }

  async regenerateSummary(summary: DischargeSummary, clinicalNoteText: string, language: DischargeSummary['language'], literacyLevel: DischargeSummary['readingLevel']): Promise<DischargeSummary> {
    const generated = await generateWithOpenRouter({
      patientInfo: {
        name: summary.patientName,
        patientId: summary.patientId,
        age: '',
        gender: '',
        whatsappNumber: summary.whatsappNumber || ''
      },
      clinicalNoteText,
      language,
      literacyLevel,
      preferredFormat: summary.format || 'Text',
      sections: summary.sectionsIncluded || {
        diagnosis: true,
        medicines: true,
        diet: true,
        activity: true,
        followUp: true,
        warnings: true
      }
    })

    return this.updateSummary(summary.id, {
      condition: generated.condition,
      language,
      readingLevel: literacyLevel,
      content: generated.content,
      verification: generated.verification || emptyVerification
    })
  }

  async approveSummary(id: string, clinicianNotes?: string): Promise<DischargeSummary> {
    return this.updateSummary(id, {
      status: 'approved',
      clinicianNotes,
      reviewedAt: new Date().toISOString(),
      deliveryStatus: 'ready_to_send',
      deliveryError: ''
    })
  }

  async generateApprovedPdf(summary: DischargeSummary): Promise<Blob> {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 56

    doc.setFillColor(7, 38, 59)
    doc.rect(0, 0, pageWidth, 76, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.text('CareBrief Discharge Instructions', margin, 36)
    doc.setFontSize(10)
    doc.text(`Patient: ${summary.patientName}${summary.patientId ? ` | MRN: ${summary.patientId}` : ''}`, margin, 58)

    doc.setTextColor(15, 23, 42)
    let y = 104

    const renderSection = (title: string, lines: string[]) => {
      if (!lines.length) return
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(title, margin, y)
      y += 20

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      lines.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, pageWidth - margin * 2)
        wrapped.forEach((wrappedLine: string) => {
          if (y > 760) {
            doc.addPage();
            y = 56
          }
          doc.text(wrappedLine, margin, y)
          y += 16
        })
      })
      y += 12
    }

    const sections: Array<[string, string[]]> = [
      ['Headline Summary', [summary.content.headlineSummary || 'No headline summary available.']],
      ['Medication Guide', summary.content.medicationGuide.flatMap((med) => [
        `${med.name} — ${med.dosage} ${med.frequency}`,
        `Purpose: ${med.purpose}`,
        `Instructions: ${med.instructions}`
      ])],
      ['Daily Care & Diet', summary.content.dailyCareAndDiet.length ? summary.content.dailyCareAndDiet : ['Not provided in source note.']],
      ['Follow-up Appointments', summary.content.followUpAppointments.length ? summary.content.followUpAppointments.map((item) => `${item.doctor} — ${item.timeframe} — ${item.purpose}`) : ['Not provided in source note.']],
      ['Warning Signs', summary.content.warningSignsWhenToCall.length ? summary.content.warningSignsWhenToCall : ['Not provided in source note.']]
    ]

    sections.forEach(([title, lines]) => renderSection(title, lines))

    return doc.output('blob')
  }

  async sendApprovedSummaryToWhatsApp(summary: DischargeSummary): Promise<DischargeSummary> {
    if (summary.status !== 'approved') {
      throw new Error('This discharge instruction must be approved before it can be sent.')
    }

    const whatsappNumber = summary.whatsappNumber?.trim()
    if (!whatsappNumber) {
      throw new Error('A valid WhatsApp number is required before delivery.')
    }

    try {
      const pdfBlob = await this.generateApprovedPdf(summary)
      const pdfUrl = await uploadPdfToStorage(summary, pdfBlob)

      await this.updateSummary(summary.id, {
        pdfUrl,
        deliveryStatus: 'sending',
        deliveryError: ''
      })

      const { data, error } = await supabase.functions.invoke('send-whatsapp-summary', {
        body: {
          summaryId: summary.id,
          pdfUrl,
          whatsappNumber
        }
      })

      if (error) throw new Error(error.message || 'WhatsApp delivery failed.')
      if (!data?.success) throw new Error(data?.error || 'WhatsApp delivery failed.')

      return this.updateSummary(summary.id, {
        status: 'released',
        deliveryStatus: 'sent',
        releasedAt: new Date().toISOString(),
        deliveryError: '',
        pdfUrl
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'WhatsApp delivery failed.'
      await this.updateSummary(summary.id, {
        status: 'approved',
        deliveryStatus: 'delivery_failed',
        deliveryError: message
      })
      throw new Error(message)
    }
  }
}

export const summaryService = new SupabaseSummaryService()