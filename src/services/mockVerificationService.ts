import { VerificationReport } from '../types'

const DELAY_MS = 250

const delay = <T>(data: T, ms = DELAY_MS): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

export class MockVerificationService {
  async verifySummary(summaryId: string = 'SUM-001'): Promise<VerificationReport> {
    const report: VerificationReport = {
      summaryId,
      patientName: 'Ravi Kumar',
      claimsChecked: 12,
      supportedClaims: 10,
      simplifiedClaims: 1,
      mismatches: 1,
      sourceSupportScore: 91.7, // 11 supported/simplified out of 12 = 91.7%
      readabilityBefore: {
        fleschEase: 42,
        readingLevel: 'Advanced / College (Grade 13.8)',
        sentenceCount: 8,
        avgSentenceLength: 22,
        complexWordsPct: 38
      },
      readabilityAfter: {
        fleschEase: 76,
        readingLevel: 'Standard / Simple (Grade 5.2)',
        sentenceCount: 14,
        avgSentenceLength: 9,
        complexWordsPct: 6
      },
      readabilityImprovementPoints: 34,
      rawClinicalSnippet:
        'Patient demonstrates persistent hyperglycemia (HbA1c 10.4%, blood glucose 342 mg/dL) and symptomatic essential hypertension. Hospital course required IV insulin infusion followed by subcutaneous glargine titration (20u QHS) and oral Metformin ER (1000mg BID). Renal function monitored; eGFR > 60 mL/min.',
      simplifiedSnippet:
        'Your blood sugar is still higher than the target, but it is improving. Take your prescribed Metformin medicine twice daily with meals to keep your blood sugar safe.',
      claims: [
        {
          id: 'CLM-001',
          sourceQuote: 'Metformin 500 mg twice daily with meals.',
          generatedClaim: 'Take Metformin 500 mg twice daily with meals.',
          status: 'SUPPORTED',
          category: 'Medication dosage',
          explanation: 'Exact match between source physician note and generated instruction.'
        },
        {
          id: 'CLM-002',
          sourceQuote: 'Follow-up in primary care clinic in 2 weeks (Oct 8).',
          generatedClaim: 'Follow-up appointment scheduled in 1 month (Oct 24).',
          status: 'POTENTIAL MISMATCH',
          category: 'Follow-up timeframe',
          severity: 'High attention',
          mismatchDetail: {
            sourceValue: '2 weeks (Oct 8)',
            generatedValue: '1 month (Oct 24)'
          },
          explanation: 'Timeframe duration conflict detected between physician note (2 weeks) and simplified instruction (1 month).'
        },
        {
          id: 'CLM-003',
          sourceQuote: 'Patient demonstrates persistent hyperglycemia (HbA1c 10.4%, blood glucose 342 mg/dL).',
          generatedClaim: 'Your blood sugar was higher than normal when you arrived.',
          status: 'SIMPLIFIED',
          category: 'Diagnosis',
          explanation: 'Complex clinical values (HbA1c 10.4%, 342 mg/dL) converted into Grade 5 plain language.'
        },
        {
          id: 'CLM-004',
          sourceQuote: 'Insulin Glargine 20 units SC QHS at bedtime.',
          generatedClaim: 'Inject Insulin Glargine (Lantus) 20 units at bedtime under the skin.',
          status: 'SUPPORTED',
          category: 'Medication dosage',
          explanation: 'Correct translation of medical abbreviation QHS to bedtime injection.'
        },
        {
          id: 'CLM-005',
          sourceQuote: 'Lisinopril 10mg PO daily in morning.',
          generatedClaim: 'Take Lisinopril 10mg once every morning after breakfast.',
          status: 'SUPPORTED',
          category: 'Medication dosage',
          explanation: 'Matches source note daily morning timing.'
        },
        {
          id: 'CLM-006',
          sourceQuote: 'Seek emergency evaluation if blood glucose < 70 mg/dL unresponsive to 15g fast-acting carbohydrates.',
          generatedClaim: 'Call doctor or emergency if blood sugar drops below 70 mg/dL and does not rise.',
          status: 'SUPPORTED',
          category: 'Warning threshold',
          explanation: 'Hypoglycemia cutoff 70 mg/dL verified against source note.'
        },
        {
          id: 'CLM-007',
          sourceQuote: 'Maintain low-sodium cardiac diet (<2g/day).',
          generatedClaim: 'Avoid adding salt or extra sodium to your daily meals.',
          status: 'SUPPORTED',
          category: 'Dietary rule',
          explanation: 'Matches sodium restriction requirement.'
        },
        {
          id: 'CLM-008',
          sourceQuote: 'Perform 30 minutes of moderate walking exercise daily.',
          generatedClaim: 'Walk for 30 minutes every day at a comfortable pace.',
          status: 'SUPPORTED',
          category: 'Dietary rule',
          explanation: 'Matches exercise recommendation.'
        },
        {
          id: 'CLM-009',
          sourceQuote: 'Discharge date: Sept 24, 2026.',
          generatedClaim: 'You are safe to return home on Sept 24, 2026.',
          status: 'SUPPORTED',
          category: 'Diagnosis',
          explanation: 'Discharge date matches clinical admission record.'
        },
        {
          id: 'CLM-010',
          sourceQuote: 'eGFR > 60 mL/min, renal function stable.',
          generatedClaim: 'Your kidney lab test results showed healthy function.',
          status: 'SUPPORTED',
          category: 'Diagnosis',
          explanation: 'Lab threshold verified against physician note.'
        },
        {
          id: 'CLM-011',
          sourceQuote: 'Capillary blood glucose monitoring AM fasting and 2hr postprandial.',
          generatedClaim: 'Check your blood sugar twice a day: before breakfast and 2 hours after dinner.',
          status: 'SUPPORTED',
          category: 'Diagnosis',
          explanation: 'Glucose monitoring timing matches clinical note.'
        },
        {
          id: 'CLM-012',
          sourceQuote: 'Avoid refined carbohydrates and sugar-sweetened beverages.',
          generatedClaim: 'Do not drink soda or eat sweet pastries.',
          status: 'SUPPORTED',
          category: 'Dietary rule',
          explanation: 'Matches carbohydrate restriction rule.'
        }
      ]
    }

    return delay(report)
  }
}

export const verificationService = new MockVerificationService()
