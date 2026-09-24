import { Patient, ClinicalNote, DischargeSummary, DashboardStats, ActivityLog, UserProfile } from '../types'

export const mockCurrentUser: UserProfile = {
  name: 'Dr. Ananya Sharma',
  role: 'Clinical Reviewer',
  department: 'General Internal Medicine',
  hospital: 'MetroHealth Medical Center',
  email: 'ananya.sharma@metrohealth.org'
}

export const mockPatients: Patient[] = [
  {
    id: 'PAT-001',
    mrn: 'MRN-884920',
    name: 'Ravi Kumar',
    age: 58,
    gender: 'Male',
    primaryDiagnosis: 'Type 2 Diabetes Mellitus with Acute Hyperglycemia & Essential Hypertension',
    preferredLanguage: 'Tamil',
    readingLevel: 'Simple',
    roomNumber: '4B-102',
    admissionDate: '2026-09-20',
    dischargeDate: '2026-09-24',
    attendingPhysician: 'Dr. Ananya Sharma'
  },
  {
    id: 'PAT-002',
    mrn: 'MRN-392019',
    name: 'Maria Santos',
    age: 64,
    gender: 'Female',
    primaryDiagnosis: 'Congestive Heart Failure Exacerbation (NYHA Class III)',
    preferredLanguage: 'Spanish',
    readingLevel: 'Very Simple (Grade 3-5)',
    roomNumber: '3A-205',
    admissionDate: '2026-09-18',
    dischargeDate: '2026-09-24',
    attendingPhysician: 'Dr. Ananya Sharma'
  },
  {
    id: 'PAT-003',
    mrn: 'MRN-774012',
    name: 'Chen Wei',
    age: 45,
    gender: 'Male',
    primaryDiagnosis: 'Acute Calculous Cholecystitis s/p Laparoscopic Cholecystectomy',
    preferredLanguage: 'Mandarin',
    readingLevel: 'Visual/Bullet Focus',
    roomNumber: '5C-310',
    admissionDate: '2026-09-22',
    dischargeDate: '2026-09-24',
    attendingPhysician: 'Dr. Marcus Vance'
  },
  {
    id: 'PAT-004',
    mrn: 'MRN-194820',
    name: 'Rajesh Patel',
    age: 62,
    gender: 'Male',
    primaryDiagnosis: 'Community-Acquired Bacterial Pneumonia & Mild COPD Exacerbation',
    preferredLanguage: 'Hindi',
    readingLevel: 'Simple',
    roomNumber: '2B-114',
    admissionDate: '2026-09-19',
    dischargeDate: '2026-09-23',
    attendingPhysician: 'Dr. Ananya Sharma'
  },
  {
    id: 'PAT-005',
    mrn: 'MRN-663910',
    name: 'Aisha Khan',
    age: 34,
    gender: 'Female',
    primaryDiagnosis: 'Acute Asthma Exacerbation secondary to Upper Respiratory Tract Infection',
    preferredLanguage: 'English',
    readingLevel: 'Standard',
    roomNumber: '4A-212',
    admissionDate: '2026-09-23',
    dischargeDate: '2026-09-24',
    attendingPhysician: 'Dr. Ananya Sharma'
  },
  {
    id: 'PAT-006',
    mrn: 'MRN-551982',
    name: 'James Wilson',
    age: 71,
    gender: 'Male',
    primaryDiagnosis: 'Total Knee Arthroplasty (Right) Post-Operative Management',
    preferredLanguage: 'English',
    readingLevel: 'Simple',
    roomNumber: '6A-108',
    admissionDate: '2026-09-21',
    dischargeDate: '2026-09-24',
    attendingPhysician: 'Dr. Sarah Lin'
  }
]

export const mockClinicalNotes: ClinicalNote[] = [
  {
    id: 'NOTE-001',
    patientId: 'PAT-001',
    patientName: 'Ravi Kumar',
    author: 'Dr. Ananya Sharma, MD',
    noteType: 'Discharge Summary Note',
    createdDate: '2026-09-24 08:30 AM',
    rawContent: `PATIENT CLINICAL SUMMARY:
Patient is a 58-year-old male admitted with severe hyperglycemia (HbA1c 10.4%, blood glucose 342 mg/dL) and symptomatic hypertension. Hospital course was remarkable for IV insulin infusion followed by transition to subcutaneous glargine (20 units QHS) and basal Metformin ER (1000mg BID). Blood pressures stabilized on Lisinopril 10mg daily. Renal function monitored; eGFR > 60 mL/min.

DISCHARGE MEDICATIONS:
1. Metformin Extended Release 1000mg PO BID with meals.
2. Insulin Glargine (Lantus) 20 units SC QHS at bedtime.
3. Lisinopril 10mg PO daily in morning.

FOLLOW-UP PLAN:
Primary Care Physician appointment scheduled in 7 days (Sept 30). Repeat HbA1c and basic metabolic panel in 4 weeks. Patient educated on capillary blood glucose monitoring (AM fasting + 2hr postprandial).

WARNING SIGNS:
Patient advised to seek emergency evaluation if experiencing diaphoresis, confusion, blood glucose < 70 mg/dL unresponsive to 15g fast-acting carbohydrates, persistent severe headache, or dyspnea.`,
    sections: {
      hospitalCourse: 'Admitted with severe hyperglycemia and symptomatic hypertension. Responded well to IV then subcutaneous insulin titration and antihypertensives.',
      dischargeDiagnoses: 'Type 2 Diabetes Mellitus with Acute Hyperglycemia, Essential Hypertension.',
      medicationsOnDischarge: 'Metformin ER 1000mg BID, Insulin Glargine 20u QHS, Lisinopril 10mg daily.',
      dischargeInstructions: 'Monitor blood sugar twice daily (fasting and post-meal). Limit refined sugars and maintain low-sodium diet (<2g/day).',
      followUpPlan: 'PCP follow-up in 7 days on Sept 30, 2026. Lab recheck in 4 weeks.',
      warningSigns: 'Blood glucose < 70 mg/dL (hypoglycemia), dizziness, chest pain, or extreme lethargy.'
    }
  },
  {
    id: 'NOTE-002',
    patientId: 'PAT-002',
    patientName: 'Maria Santos',
    author: 'Dr. Ananya Sharma, MD',
    noteType: 'Discharge Summary Note',
    createdDate: '2026-09-24 09:15 AM',
    rawContent: `PATIENT CLINICAL SUMMARY:
64yo female with history of CHF (EF 35%) admitted for hypervolemia and dyspnea on exertion. Treated with IV Furosemide 40mg BID resulting in 4.2kg net diuresis. Symptoms resolved to baseline. Discharged on oral Torsemide 20mg daily, Sacubitril/Valsartan 49/51mg BID, and Metoprolol Succinate 50mg daily. Daily weight logs required. Fluid restriction 1.5L/day.

DISCHARGE MEDICATIONS:
1. Torsemide 20mg PO once daily in the morning.
2. Sacubitril/Valsartan (Entresto) 49/51mg PO twice daily.
3. Metoprolol Succinate ER 50mg PO daily.

WARNING SIGNS:
Call clinic or emergency if weight gain > 2 lbs in 24 hours or 5 lbs in 1 week, worsening lower extremity edema, or orthopnea requiring extra pillows.`,
    sections: {
      hospitalCourse: 'Admitted for acute heart failure decompensation. Diuresed with IV Furosemide with significant fluid reduction.',
      dischargeDiagnoses: 'Congestive Heart Failure Exacerbation (Systolic Dysfunction).',
      medicationsOnDischarge: 'Torsemide 20mg daily, Sacubitril/Valsartan 49/51mg BID, Metoprolol Succinate 50mg daily.',
      dischargeInstructions: 'Weigh yourself every morning after urinating before breakfast. Limit fluids to 1.5 liters per day.',
      followUpPlan: 'Cardiology follow-up in 5 days (Sept 29).',
      warningSigns: 'Weight gain >2 lbs in 1 day or >5 lbs in 1 week, short of breath while resting.'
    }
  }
]

export const mockDischargeSummaries: DischargeSummary[] = [
  {
    id: 'SUM-001',
    noteId: 'NOTE-001',
    patientId: 'PAT-001',
    patientName: 'Ravi Kumar',
    condition: 'Type 2 Diabetes',
    language: 'Tamil',
    readingLevel: 'Simple',
    status: 'awaiting_review',
    originalFKGL: 13.8, // High school / college reading level
    simplifiedFKGL: 5.2, // 5th grade reading level
    readabilityImprovementPct: 34,
    createdAt: '2026-09-24 09:30 AM',
    updatedAt: '2026-09-24 09:30 AM',
    content: {
      headlineSummary: 'உங்களது இரத்த சர்க்கரை மற்றும் இரத்த அழுத்தத்திற்கான மருத்துவமனை சிகிச்சை முடிந்து நீங்கள் பாதுகாப்பாக வீட்டிற்குச் செல்லலாம். இந்த வழிகாட்டியை தினமும் பின்பற்றுங்கள்.',
      medicationGuide: [
        {
          name: 'மெட்ஃபார்மின் (Metformin ER)',
          dosage: '1000 mg',
          frequency: 'தினமும் 2 முறை (காலை மற்றும் இரவு)',
          purpose: 'இரத்த சர்க்கரை அளவைக் குறைக்க உதவுகிறது.',
          instructions: 'உணவு சாப்பிட்ட பிறகு தண்ணீருடன் எடுத்துக்கொள்ளவும்.'
        },
        {
          name: 'இன்சுலின் கிளார்கின் (Insulin Glargine / Lantus)',
          dosage: '20 அலகு (Units)',
          frequency: 'இரவு தூங்கும் முன் 1 முறை',
          purpose: 'இரவு நேரத்தில் சர்க்கரை அளவைக் கட்டுப்பாட்டில் வைக்கிறது.',
          instructions: 'வயிற்றின் தோல் பகுதியில் ஊசி மூலம் செலுத்தவும்.'
        },
        {
          name: 'லிசினோப்ரில் (Lisinopril)',
          dosage: '10 mg',
          frequency: 'தினமும் காலை 1 முறை',
          purpose: 'இரத்த அழுத்தத்தைக் கட்டுப்படுத்தி சிறுநீரகத்தைப் பாதுகாக்கிறது.',
          instructions: 'காலை உணவுக்குப் பின் குடிக்கவும்.'
        }
      ],
      warningSignsWhenToCall: [
        'இரத்த சர்க்கரை அளவு 70 mg/dL க்கு கீழே குறைந்தால் (மயக்கம், நடுக்கம், அதிக வியர்வை)',
        'அதிக தலைவலி அல்லது பார்வை மங்குதல்',
        'திடீர் மூச்சுத்திணறல் அல்லது நெஞ்சு வலி'
      ],
      followUpAppointments: [
        {
          doctor: 'டாக்டர். அனன்யா சர்மா (குடும்ப மருத்துவர்)',
          timeframe: 'செப்டம்பர் 30, 2026 (இன்னும் 7 நாட்களில்)',
          purpose: 'சர்க்கரை அளவு மற்றும் மருந்து அளவை சரிபார்க்க.'
        }
      ],
      dailyCareAndDiet: [
        'தினமும் காலை உணவுக்கு முன்பும், இரவு உணவுக்கு 2 மணிநேரத்திற்கு பின்பும் இரத்த சர்க்கரையை பரிசோதிக்கவும்.',
        'இனிப்பு மற்றும் எண்ணெய் பண்டங்களை தவிர்க்கவும்.',
        'தினமும் 30 நிமிடங்கள் மிதமான நடைபயிற்சி செய்யவும்.'
      ]
    },
    verification: {
      overallStatus: 'verified',
      confidenceScore: 98,
      checkedItemsCount: 14,
      flagCount: 0,
      items: [
        {
          id: 'V1',
          claim: 'Metformin ER 1000mg BID correctly prescribed with meals.',
          sourceQuote: 'Metformin Extended Release 1000mg PO BID with meals.',
          status: 'verified',
          explanation: 'Matches clinical discharge note exact dose and timing.'
        },
        {
          id: 'V2',
          claim: 'Insulin Glargine dose specified as 20 units bedtime SC.',
          sourceQuote: 'Insulin Glargine (Lantus) 20 units SC QHS at bedtime.',
          status: 'verified',
          explanation: 'Accurate translation of SC QHS route to bedtime injection.'
        },
        {
          id: 'V3',
          claim: 'Hypoglycemia cutoff set to < 70 mg/dL.',
          sourceQuote: 'blood glucose < 70 mg/dL unresponsive to 15g fast-acting carbohydrates',
          status: 'verified',
          explanation: 'Warning threshold correctly matches physician note.'
        }
      ]
    }
  },
  {
    id: 'SUM-002',
    noteId: 'NOTE-002',
    patientId: 'PAT-002',
    patientName: 'Maria Santos',
    condition: 'Heart Failure',
    language: 'Spanish',
    readingLevel: 'Very Simple (Grade 3-5)',
    status: 'awaiting_review',
    originalFKGL: 14.5,
    simplifiedFKGL: 4.8,
    readabilityImprovementPct: 41,
    createdAt: '2026-09-24 10:10 AM',
    updatedAt: '2026-09-24 10:10 AM',
    content: {
      headlineSummary: 'Su corazón está respondiendo bien al tratamiento. Es muy importante tomar sus medicinas todos los días y pesarse cada mañana.',
      medicationGuide: [
        {
          name: 'Torsemida (Torsemide)',
          dosage: '20 mg',
          frequency: 'Una vez al día por la mañana',
          purpose: 'Ayuda a eliminar el exceso de agua de su cuerpo.',
          instructions: 'Tómela con un vaso de agua en la mañana.'
        },
        {
          name: 'Entresto (Sacubitril/Valsartan)',
          dosage: '49/51 mg',
          frequency: 'Dos veces al día (mañana y noche)',
          purpose: 'Ayuda a que su corazón bombee sangre con más facilidad.',
          instructions: 'Tómela a la misma hora todos los días.'
        },
        {
          name: 'Metoprolol Succinato',
          dosage: '50 mg',
          frequency: 'Una vez al día',
          purpose: 'Mantiene su ritmo cardíaco suave y bajo control.',
          instructions: 'Tómela junto con sus alimentos.'
        }
      ],
      warningSignsWhenToCall: [
        'Si aumenta más de 2 libras en 1 día o 5 libras en 1 semana.',
        'Si siente dificultad para respirar al estar acostado.',
        'Si nota hinchazón en sus pies, tobillos o piernas.'
      ],
      followUpAppointments: [
        {
          doctor: 'Clínica de Cardiología',
          timeframe: '29 de septiembre de 2026 (en 5 días)',
          purpose: 'Revisión de peso, presión arterial y análisis de sangre.'
        }
      ],
      dailyCareAndDiet: [
        'Pésese todas las mañanas después de ir al baño y antes de desayunar.',
        'No tome más de 1.5 litros de líquidos al día (agua, sopas, jugos).',
        'Evite la sal en sus comidas.'
      ]
    },
    verification: {
      overallStatus: 'verified',
      confidenceScore: 99,
      checkedItemsCount: 12,
      flagCount: 0,
      items: [
        {
          id: 'V4',
          claim: 'Torsemide 20mg morning administration confirmed.',
          sourceQuote: 'Torsemide 20mg PO once daily in the morning.',
          status: 'verified',
          explanation: 'Matches source note instructions.'
        },
        {
          id: 'V5',
          claim: 'Fluid restriction limit specified as 1.5L/day.',
          sourceQuote: 'Fluid restriction 1.5L/day.',
          status: 'verified',
          explanation: 'Correct numerical bound translated.'
        }
      ]
    }
  },
  {
    id: 'SUM-003',
    noteId: 'NOTE-003',
    patientId: 'PAT-003',
    patientName: 'Chen Wei',
    condition: 'Gallbladder Surgery',
    language: 'Mandarin',
    readingLevel: 'Visual/Bullet Focus',
    status: 'edited',
    originalFKGL: 12.1,
    simplifiedFKGL: 5.0,
    readabilityImprovementPct: 31,
    createdAt: '2026-09-23 04:20 PM',
    updatedAt: '2026-09-24 08:00 AM',
    reviewedBy: 'Dr. Ananya Sharma',
    reviewedAt: '2026-09-24 08:00 AM',
    content: {
      headlineSummary: '您的胆囊腹腔镜手术顺利完成。请按时服药并保持伤口清洁干燥。',
      medicationGuide: [
        {
          name: '对乙酰氨基酚 (Acetaminophen)',
          dosage: '500 mg',
          frequency: '每6小时1次 (必要时)',
          purpose: '缓解伤口轻微疼痛。',
          instructions: '痛时服用，24小时内不要超过6片。'
        }
      ],
      warningSignsWhenToCall: [
        '伤口发红、肿胀或有脓液渗出',
        '体温超过 38°C (100.4°F)',
        '严重腹痛或持续呕吐'
      ],
      followUpAppointments: [
        {
          doctor: '外科诊所 (Surgical Clinic)',
          timeframe: '10月2日 (10天后)',
          purpose: '检查伤口愈合情况。'
        }
      ],
      dailyCareAndDiet: [
        '前2周保持低脂饮食 (少油、少清炸)。',
        '伤口保持干燥，48小时内不要淋浴。'
      ]
    },
    verification: {
      overallStatus: 'verified',
      confidenceScore: 97,
      checkedItemsCount: 10,
      flagCount: 0,
      items: []
    }
  },
  {
    id: 'SUM-004',
    noteId: 'NOTE-004',
    patientId: 'PAT-004',
    patientName: 'Rajesh Patel',
    condition: 'Pneumonia',
    language: 'Hindi',
    readingLevel: 'Simple',
    status: 'approved',
    originalFKGL: 14.0,
    simplifiedFKGL: 5.5,
    readabilityImprovementPct: 36,
    createdAt: '2026-09-23 02:10 PM',
    updatedAt: '2026-09-24 09:00 AM',
    reviewedBy: 'Dr. Ananya Sharma',
    reviewedAt: '2026-09-24 09:00 AM',
    content: {
      headlineSummary: 'फेफड़ों के संक्रमण (निमोनिया) का इलाज पूरा हो गया है। घर पर आराम करें और एंटीबायोटिक का पूरा कोर्स खत्म करें।',
      medicationGuide: [
        {
          name: 'एमोक्सिसिलिन (Amoxicillin-Clavulanate)',
          dosage: '875 mg',
          frequency: 'दिन में 2 बार (7 दिनों तक)',
          purpose: 'संक्रमण फैलाने वाले बैक्टीरिया को खत्म करता है।',
          instructions: 'भोजन के साथ लें। भले ही आप बेहतर महसूस करें, 7 दिन की दवा पूरी करें।'
        }
      ],
      warningSignsWhenToCall: [
        'सांस लेने में ज्यादा तकलीफ या सीने में तेज दर्द',
        '101°F (38.3°C) से ज्यादा तेज बुखार आना',
        'खांसी में खून आना'
      ],
      followUpAppointments: [
        {
          doctor: 'डॉ. अनन्या शर्मा (छाती रोग विशेषज्ञ)',
          timeframe: 'अक्टूबर 5 (2 सप्ताह बाद)',
          purpose: 'छाती के एक्स-रे (X-Ray) की दोबारा जांच।'
        }
      ],
      dailyCareAndDiet: [
        'दिन में 8-10 गिलास पानी पिएं ताकि कफ बाहर आ सके।',
        'पर्याप्त आराम करें और धूम्रपान से दूर रहें।'
      ]
    },
    verification: {
      overallStatus: 'verified',
      confidenceScore: 100,
      checkedItemsCount: 11,
      flagCount: 0,
      items: []
    }
  },
  {
    id: 'SUM-005',
    noteId: 'NOTE-005',
    patientId: 'PAT-005',
    patientName: 'Aisha Khan',
    condition: 'Asthma Exacerbation',
    language: 'English',
    readingLevel: 'Standard',
    status: 'released',
    originalFKGL: 11.5,
    simplifiedFKGL: 6.0,
    readabilityImprovementPct: 28,
    createdAt: '2026-09-23 11:00 AM',
    updatedAt: '2026-09-23 03:00 PM',
    reviewedBy: 'Dr. Ananya Sharma',
    reviewedAt: '2026-09-23 03:00 PM',
    content: {
      headlineSummary: 'Your asthma flare-up has resolved. Continue your daily controller inhaler and keep your rescue inhaler with you at all times.',
      medicationGuide: [
        {
          name: 'Fluticasone / Salmeterol Inhaler (Advair)',
          dosage: '250/50 mcg',
          frequency: '2 puffs twice daily',
          purpose: 'Daily controller to prevent airway inflammation.',
          instructions: 'Rinse mouth with water after each use to prevent thrush.'
        },
        {
          name: 'Albuterol HFA Inhaler (ProAir)',
          dosage: '90 mcg',
          frequency: '2 puffs every 4-6 hours as needed',
          purpose: 'Quick rescue inhaler for sudden shortness of breath or wheezing.',
          instructions: 'Carry this with you wherever you go.'
        }
      ],
      warningSignsWhenToCall: [
        'Rescue inhaler needed more than every 4 hours without relief',
        'Difficulty speaking in full sentences due to breathlessness',
        'Lips or fingernails turning blue/gray'
      ],
      followUpAppointments: [
        {
          doctor: 'Pulmonology Clinic',
          timeframe: 'In 2 weeks (Oct 7)',
          purpose: 'Spirometry and Asthma Action Plan review.'
        }
      ],
      dailyCareAndDiet: [
        'Avoid known triggers such as cigarette smoke, strong perfumes, and cold dry air.',
        'Use peak flow meter every morning before inhaler doses.'
      ]
    },
    verification: {
      overallStatus: 'verified',
      confidenceScore: 99,
      checkedItemsCount: 15,
      flagCount: 0,
      items: []
    }
  }
]

export const mockDashboardStats: DashboardStats = {
  summariesCreated: 128,
  awaitingReview: 7,
  approvedToday: 24,
  avgReadabilityImprovement: 34
}

export const mockActivityTimeline: ActivityLog[] = [
  {
    id: 'ACT-001',
    summaryId: 'SUM-001',
    patientName: 'Ravi Kumar',
    action: 'Summary generated',
    timestamp: '10 mins ago',
    actor: 'CareBrief AI Engine'
  },
  {
    id: 'ACT-002',
    summaryId: 'SUM-001',
    patientName: 'Ravi Kumar',
    action: 'Fact check completed',
    timestamp: '8 mins ago',
    actor: 'Factual Verification Guard'
  },
  {
    id: 'ACT-003',
    summaryId: 'SUM-003',
    patientName: 'Chen Wei',
    action: 'Clinician edited',
    timestamp: '2 hours ago',
    actor: 'Dr. Ananya Sharma'
  },
  {
    id: 'ACT-004',
    summaryId: 'SUM-004',
    patientName: 'Rajesh Patel',
    action: 'Summary approved',
    timestamp: '3 hours ago',
    actor: 'Dr. Ananya Sharma'
  },
  {
    id: 'ACT-005',
    summaryId: 'SUM-005',
    patientName: 'Aisha Khan',
    action: 'Released to patient',
    timestamp: 'Yesterday at 3:00 PM',
    actor: 'CareBrief System Auto-Dispatch'
  }
]
