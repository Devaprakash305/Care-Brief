import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { ensureSupabaseSession } from './lib/supabase'

async function bootstrap() {
  try {
    await ensureSupabaseSession()
  } catch (error) {
    console.error('Supabase authentication is unavailable:', error)
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()
