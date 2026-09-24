import { DischargeSummaryContent, Language, LiteracyLevel } from '../types'

export interface MockVariantContent {
  conditionTitle: string
  conditionText: string
  medicinesTitle: string
  medicinesList: {
    name: string
    dosage: string
    bullets: string[]
  }[]
  dietTitle: string
  dietBullets: string[]
  activityTitle: string
  activityBullets: string[]
  followUpTitle: string
  followUpText: string
  followUpDoctor: string
  followUpTimeframe: string
  warningsTitle: string
  warningsBullets: string[]
}

// Key format: `${Language}_${LiteracyLevel}`
export const mockVariantsMap: Record<string, MockVariantContent> = {
  // English - Simple
  'English_Simple': {
    conditionTitle: 'Your Condition',
    conditionText: 'You were treated for Type 2 Diabetes Mellitus and high blood pressure. Your blood sugar level has stabilized, and you are ready to recover safely at home.',
    medicinesTitle: 'Your Medicines',
    medicinesList: [
      {
        name: 'Metformin 500 mg',
        dosage: '500 mg',
        bullets: [
          'Take one tablet in the morning after breakfast.',
          'Take one tablet in the evening after dinner.',
          'Follow the medication instructions provided by your clinician.'
        ]
      },
      {
        name: 'Lisinopril 10 mg',
        dosage: '10 mg',
        bullets: [
          'Take one tablet every morning with water.',
          'Helps keep your blood pressure at a safe level.'
        ]
      }
    ],
    dietTitle: 'Food & Diet',
    dietBullets: [
      'Eat low-sugar meals with fresh vegetables and whole grains.',
      'Limit salt and sodium in your daily cooking.',
      'Drink 6 to 8 glasses of water every day.'
    ],
    activityTitle: 'Activity & Rest',
    activityBullets: [
      'Walk for 20 to 30 minutes every day at a comfortable pace.',
      'Get at least 8 hours of rest every night.',
      'Avoid strenuous heavy lifting for the next week.'
    ],
    followUpTitle: 'Follow-up Appointment',
    followUpText: 'Primary Care Physician checkup scheduled.',
    followUpDoctor: 'Dr. Ananya Sharma',
    followUpTimeframe: 'In 7 days (Sept 30, 2026)',
    warningsTitle: 'Important Instructions (When to Call)',
    warningsBullets: [
      'Blood sugar falls below 70 mg/dL and you feel dizzy or shaky.',
      'You experience sudden shortness of breath or chest discomfort.',
      'Severe headache that does not improve with rest.'
    ]
  },

  // English - Very Simple
  'English_Very Simple': {
    conditionTitle: 'Your Condition',
    conditionText: 'Your blood sugar was too high. The hospital doctors helped you. Now you can rest at home.',
    medicinesTitle: 'Your Medicines',
    medicinesList: [
      {
        name: 'Metformin 500 mg',
        dosage: '500 mg',
        bullets: [
          'Take 1 pill in the morning with food.',
          'Take 1 pill at night with food.',
          'Do not skip your pills.'
        ]
      }
    ],
    dietTitle: 'Food & Diet',
    dietBullets: [
      'Do not eat sweet foods or candy.',
      'Eat fresh vegetables and healthy rice.',
      'Drink plenty of clean water.'
    ],
    activityTitle: 'Activity',
    activityBullets: [
      'Take a short walk every day.',
      'Rest when you feel tired.'
    ],
    followUpTitle: 'Follow-up',
    followUpText: 'See your clinic doctor soon.',
    followUpDoctor: 'Dr. Ananya Sharma',
    followUpTimeframe: 'In 7 days',
    warningsTitle: 'Important Instructions',
    warningsBullets: [
      'If you feel shaky or very dizzy.',
      'If your blood sugar goes below 70.',
      'Call emergency right away.'
    ]
  },

  // English - Standard
  'English_Standard': {
    conditionTitle: 'Your Condition Summary',
    conditionText: 'Patient was admitted for acute hyperglycemia secondary to Type 2 Diabetes Mellitus and Essential Hypertension. Blood glucose has been stabilized on oral Metformin and blood pressure is controlled.',
    medicinesTitle: 'Discharge Prescriptions',
    medicinesList: [
      {
        name: 'Metformin ER 500 mg',
        dosage: '500 mg PO BID',
        bullets: [
          'Take one 500 mg tablet oral twice daily with meals.',
          'Monitors glycemic control and reduces hepatic glucose production.'
        ]
      }
    ],
    dietTitle: 'Dietary Guidelines',
    dietBullets: [
      'Adhere to a strict low-glycemic, low-sodium cardiac diet (<2000mg Na/day).',
      'Maintain consistent carbohydrate intake spread evenly throughout the day.'
    ],
    activityTitle: 'Physical Activity',
    activityBullets: [
      'Engage in 150 minutes of moderate aerobic physical activity per week.',
      'Monitor blood glucose levels prior to vigorous activity.'
    ],
    followUpTitle: 'Outpatient Follow-up Plan',
    followUpText: 'Outpatient clinical re-evaluation.',
    followUpDoctor: 'Dr. Ananya Sharma (Internal Medicine)',
    followUpTimeframe: '7 Days Post-Discharge',
    warningsTitle: 'Red Flag Clinical Warning Signs',
    warningsBullets: [
      'Symptomatic hypoglycemia (blood glucose < 70 mg/dL) unresponsive to 15g carbohydrates.',
      'Acute dyspnea, diaphoresis, or persistent blood pressure > 160/100 mmHg.'
    ]
  },

  // Tamil - Simple
  'Tamil_Simple': {
    conditionTitle: '🩺 உங்களது உடல் நிலை (Your Condition)',
    conditionText: 'உங்களது டைப் 2 நீரிழிவு (சர்க்கரை நோய்) மற்றும் இரத்த அழுத்தத்திற்கான மருத்துவமனை சிகிச்சை முடிந்து நீங்கள் பாதுகாப்பாக வீட்டிற்குச் செல்லலாம்.',
    medicinesTitle: '💊 உங்களது மருந்துகள் (Your Medicines)',
    medicinesList: [
      {
        name: 'மெட்ஃபார்மின் (Metformin 500 mg)',
        dosage: '500 mg',
        bullets: [
          'காலை உணவுக்குப் பின் 1 மாத்திரை சாப்பிடவும்.',
          'இரவு உணவுக்குப் பின் 1 மாத்திரை சாப்பிடவும்.',
          'மருத்துவர் கூறிய வழிகாட்டுதலை தினமும் பின்பற்றுங்கள்.'
        ]
      }
    ],
    dietTitle: '🥗 உணவு மற்றும் பத்தியம் (Food & Diet)',
    dietBullets: [
      'இனிப்பு, சோடா மற்றும் எண்ணெய் பண்டங்களைத் தவிர்க்கவும்.',
      'காய்கறிகள் மற்றும் சிறுதானியங்களை அதிகம் உணவில் சேர்க்கவும்.',
      'தினமும் 8 டம்ளர் சுத்தமான நீர் குடிக்கவும்.'
    ],
    activityTitle: '🏃 உடற்பயிற்சி மற்றும் ஓய்வு (Activity)',
    activityBullets: [
      'தினமும் 20 முதல் 30 நிமிடங்கள் மிதமான நடைபயிற்சி செய்யவும்.',
      'இரவில் 8 மணிநேரம் நிம்மதியான தூக்கம் அவசியம்.'
    ],
    followUpTitle: '📅 மருத்துவ சந்திப்பு (Follow-up)',
    followUpText: 'குடும்ப மருத்துவரை நேரில் சந்திக்க வேண்டும்.',
    followUpDoctor: 'டாக்டர். அனன்யா சர்மா',
    followUpTimeframe: '7 நாட்களில் (செப்டம்பர் 30)',
    warningsTitle: '⚠️ முக்கிய எச்சரிக்கை அறிகுறிகள் (Important Warnings)',
    warningsBullets: [
      'இரத்த சர்க்கரை 70 mg/dL க்கு கீழ் குறைந்து மயக்கம் அல்லது நடுக்கம் ஏற்பட்டால்.',
      'திடீர் மூச்சுத்திணறல் அல்லது நெஞ்சு வலி வந்தால் உடனே மருத்துவமனைக்குச் செல்லவும்.'
    ]
  },

  // Hindi - Simple
  'Hindi_Simple': {
    conditionTitle: '🩺 आपकी स्वास्थ्य स्थिति (Your Condition)',
    conditionText: 'टाइप 2 डायबिटीज (शुगर) और उच्च रक्तचाप का इलाज पूरा हो गया है। अब आप सुरक्षित रूप से घर पर आराम कर सकते हैं।',
    medicinesTitle: '💊 आपकी दवाइयां (Your Medicines)',
    medicinesList: [
      {
        name: 'मेटफॉर्मिन (Metformin 500 mg)',
        dosage: '500 mg',
        bullets: [
          'सुबह नाश्ते के बाद एक गोली लें।',
          'रात के खाने के बाद एक गोली लें।',
          'डॉक्टर द्वारा दी गई सलाह के अनुसार दवा नियमित रूप से लें।'
        ]
      }
    ],
    dietTitle: '🥗 खान-पान और परहेज (Food & Diet)',
    dietBullets: [
      'मीठे व्यंजन और ठंडे पेय पदार्थों से परहेज करें।',
      'हरी सब्जियां और दालें अपने भोजन में शामिल करें।',
      'दिन भर में पर्याप्त पानी पिएं।'
    ],
    activityTitle: '🏃 व्यायाम और आराम (Activity)',
    activityBullets: [
      'रोजाना 20-30 मिनट तक हल्की सैर करें।',
      'रात में कम से कम 8 घंटे की नींद लें।'
    ],
    followUpTitle: '📅 डॉक्टर से दोबारा मिलने की तिथि (Follow-up)',
    followUpText: 'क्लीनिक में जांच के लिए आना है।',
    followUpDoctor: 'डॉ. अनन्या शर्मा',
    followUpTimeframe: '7 दिनों में (30 सितंबर)',
    warningsTitle: '⚠️ महत्वपूर्ण सावधानियां (Important Warnings)',
    warningsBullets: [
      'यदि शुगर का स्तर 70 से कम हो जाए और चक्कर आए।',
      'अचानक सांस लेने में तकलीफ या सीने में दर्द होने पर तुरंत डॉक्टर से संपर्क करें।'
    ]
  },

  // Spanish - Simple
  'Spanish_Simple': {
    conditionTitle: '🩺 Su Condición de Salud',
    conditionText: 'Su nivel de azúcar en la sangre y su presión arterial se han estabilizado. Ahora puede continuar su recuperación en casa.',
    medicinesTitle: '💊 Sus Medicamentos',
    medicinesList: [
      {
        name: 'Metformina 500 mg',
        dosage: '500 mg',
        bullets: [
          'Tome una pastilla por la mañana después del desayuno.',
          'Tome una pastilla por la noche después de la cena.',
          'Siga exactamente las instrucciones médicas.'
        ]
      }
    ],
    dietTitle: '🥗 Alimentación y Dieta',
    dietBullets: [
      'Evite los alimentos con mucha azúcar y los refrescos.',
      'Coma verduras frescas y granos integrales.',
      'Tome suficiente agua durante el día.'
    ],
    activityTitle: '🏃 Actividad y Descanso',
    activityBullets: [
      'Camine entre 20 y 30 minutos al día a un ritmo suave.',
      'Descanse al menos 8 horas cada noche.'
    ],
    followUpTitle: '📅 Cita de Seguimiento',
    followUpText: 'Revisión en el consultorio médico.',
    followUpDoctor: 'Dra. Ananya Sharma',
    followUpTimeframe: 'En 7 días (30 de septiembre)',
    warningsTitle: '⚠️ Señales de Advertencia Importantes',
    warningsBullets: [
      'Si siente mareos o temblores por azúcar baja (menos de 70 mg/dL).',
      'Si tiene dolor en el pecho o falta de aire repentina.'
    ]
  }
}

export function getMockVariant(language: Language, literacyLevel: LiteracyLevel): MockVariantContent {
  const key = `${language}_${literacyLevel}`
  if (mockVariantsMap[key]) {
    return mockVariantsMap[key]
  }

  // Fallback to Language matching or English
  const langFallbackKey = Object.keys(mockVariantsMap).find((k) => k.startsWith(language))
  if (langFallbackKey) {
    return mockVariantsMap[langFallbackKey]
  }

  return mockVariantsMap['English_Simple']
}
