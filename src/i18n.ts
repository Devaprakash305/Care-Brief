import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      'Your Condition Summary': 'Your Condition Summary',
      'Your Medicines': 'Your Medicines',
      'Food & Diet': 'Food & Diet',
      'Activity & Rest': 'Activity & Rest',
      'Follow-up Appointment': 'Follow-up Appointment',
      'Important Instructions': 'Important Instructions',
      'Target Language:': 'Target Language:',
      'Reading Level:': 'Reading Level:',
      'Language Adaptation:': 'Language Adaptation:',
      'Reading Target:': 'Reading Target:',
      'Patient-friendly wording:': 'Patient-friendly wording:',
      'Enabled': 'Enabled',
      'Voice Audio Guide:': 'Voice Audio Guide:',
      'Available': 'Available',
      'Scheduled': 'Scheduled',
      'AI Generated': 'AI Generated',
      'Draft - Awaiting Clinical Review': 'Draft - Awaiting Clinical Review',
      'AI-Generated Discharge Summary': 'AI-Generated Discharge Summary',
      'Source Clinical Information': 'Source Clinical Information',
      'View Original Clinical Note': 'View Original Clinical Note',
      'Active Personalization Parameters': 'Active Personalization Parameters',
      'AI-Generated Patient-Friendly Summary': 'AI-Generated Patient-Friendly Summary',
      'Regenerate': 'Regenerate'
    }
  },
  ta: {
    translation: {
      'Your Condition Summary': 'உங்கள் நோய் நிலை சுருக்கம்',
      'Your Medicines': 'உங்கள் மருந்துகள்',
      'Food & Diet': 'உணவு மற்றும் உணவுமுறை',
      'Activity & Rest': 'செயல்பாடு மற்றும் ஓய்வு',
      'Follow-up Appointment': 'தொடர் சிகிச்சை சந்திப்பு',
      'Important Instructions': 'முக்கிய வழிமுறைகள்',
      'Target Language:': 'இலக்கு மொழி:',
      'Reading Level:': 'படிக்கும் நிலை:',
      'Language Adaptation:': 'மொழி மாற்றம்:',
      'Reading Target:': 'படிக்கும் இலக்கு:',
      'Patient-friendly wording:': 'நோயாளிக்கு ஏற்ற மொழி:',
      'Enabled': 'இயக்கப்பட்டது',
      'Voice Audio Guide:': 'குரல் வழிகாட்டி:',
      'Available': 'கிடைக்கிறது',
      'Scheduled': 'திட்டமிடப்பட்டது',
      'AI Generated': 'AI உருவாக்கியது',
      'Draft - Awaiting Clinical Review': 'வரைவு - மருத்துவர் பரிசீலனை நிலுவையில்',
      'AI-Generated Discharge Summary': 'AI உருவாக்கிய வெளியேற்ற சுருக்கம்',
      'Source Clinical Information': 'மூல மருத்துவத் தகவல்',
      'View Original Clinical Note': 'அசல் மருத்துவக் குறிப்பைக் காண்க',
      'Active Personalization Parameters': 'செயலில் உள்ள தனிப்பயனாக்க அமைப்புகள்',
      'AI-Generated Patient-Friendly Summary': 'AI உருவாக்கிய நோயாளிக்கு ஏற்ற சுருக்கம்',
      'Regenerate': 'மீண்டும் உருவாக்கு'
    }
  },
  hi: {
    translation: {
      'Your Condition Summary': 'आपकी स्थिति का सारांश',
      'Your Medicines': 'आपकी दवाइयाँ',
      'Food & Diet': 'भोजन और आहार',
      'Activity & Rest': 'गतिविधि और आराम',
      'Follow-up Appointment': 'फॉलो-अप अपॉइंटमेंट',
      'Important Instructions': 'महत्वपूर्ण निर्देश',
      'Target Language:': 'लक्षित भाषा:',
      'Reading Level:': 'पठन स्तर:',
      'Language Adaptation:': 'भाषा अनुकूलन:',
      'Reading Target:': 'पठन लक्ष्य:',
      'Patient-friendly wording:': 'मरीज़ के अनुकूल भाषा:',
      'Enabled': 'सक्षम',
      'Voice Audio Guide:': 'ऑडियो मार्गदर्शिका:',
      'Available': 'उपलब्ध',
      'Scheduled': 'निर्धारित',
      'AI Generated': 'AI द्वारा निर्मित',
      'Draft - Awaiting Clinical Review': 'ड्राफ्ट - चिकित्सकीय समीक्षा लंबित',
      'AI-Generated Discharge Summary': 'AI द्वारा निर्मित डिस्चार्ज सारांश',
      'Source Clinical Information': 'मूल चिकित्सकीय जानकारी',
      'View Original Clinical Note': 'मूल चिकित्सकीय नोट देखें',
      'Active Personalization Parameters': 'सक्रिय वैयक्तिकरण पैरामीटर',
      'AI-Generated Patient-Friendly Summary': 'AI द्वारा निर्मित मरीज़-अनुकूल सारांश',
      'Regenerate': 'पुनः बनाएँ'
    }
  },
  es: {
    translation: {
      'Your Condition Summary': 'Resumen de su condición',
      'Your Medicines': 'Sus medicamentos',
      'Food & Diet': 'Alimentación y dieta',
      'Activity & Rest': 'Actividad y descanso',
      'Follow-up Appointment': 'Cita de seguimiento',
      'Important Instructions': 'Instrucciones importantes',
      'Target Language:': 'Idioma de destino:',
      'Reading Level:': 'Nivel de lectura:',
      'Language Adaptation:': 'Adaptación del idioma:',
      'Reading Target:': 'Objetivo de lectura:',
      'Patient-friendly wording:': 'Lenguaje sencillo para el paciente:',
      'Enabled': 'Activado',
      'Voice Audio Guide:': 'Guía de audio:',
      'Available': 'Disponible',
      'Scheduled': 'Programada',
      'AI Generated': 'Generado por IA',
      'Draft - Awaiting Clinical Review': 'Borrador - Revisión clínica pendiente',
      'AI-Generated Discharge Summary': 'Resumen de alta generado por IA',
      'Source Clinical Information': 'Información clínica de origen',
      'View Original Clinical Note': 'Ver nota clínica original',
      'Active Personalization Parameters': 'Parámetros de personalización activos',
      'AI-Generated Patient-Friendly Summary': 'Resumen para el paciente generado por IA',
      'Regenerate': 'Regenerar'
    }
  }
}

export const languageToLocale: Record<string, string> = {
  English: 'en',
  Tamil: 'ta',
  Hindi: 'hi',
  Spanish: 'es'
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
