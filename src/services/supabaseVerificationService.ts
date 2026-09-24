import { VerificationReport } from '../types'
import { summaryService } from './supabaseSummaryService'

export const verificationService = {
  async verifySummary(summaryId: string): Promise<VerificationReport> {
    const summary = await summaryService.getSummaryById(summaryId)
    if (!summary) throw new Error('Summary not found')
    const verification = summary.verification
    return {
      summaryId,
      patientName: summary.patientName,
      claimsChecked: verification.checkedItemsCount,
      supportedClaims: verification.items.filter((item) => item.status === 'verified').length,
      simplifiedClaims: 0,
      mismatches: verification.flagCount,
      sourceSupportScore: verification.confidenceScore,
      readabilityBefore: { fleschEase: 0, readingLevel: '', sentenceCount: 0, avgSentenceLength: 0, complexWordsPct: 0 },
      readabilityAfter: { fleschEase: 0, readingLevel: '', sentenceCount: 0, avgSentenceLength: 0, complexWordsPct: 0 },
      readabilityImprovementPoints: summary.readabilityImprovementPct,
      claims: [],
      rawClinicalSnippet: '',
      simplifiedSnippet: summary.content.headlineSummary
    }
  }
}