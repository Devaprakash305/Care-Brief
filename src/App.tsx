import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ToastProvider } from './components/ui/Toast'

import { DashboardPage } from './pages/DashboardPage'
import { NewSummaryPage } from './pages/NewSummaryPage'
import { ClinicalNotesPage } from './pages/ClinicalNotesPage'
import { ReviewQueuePage } from './pages/ReviewQueuePage'
import { PatientSummariesPage } from './pages/PatientSummariesPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SettingsPage } from './pages/SettingsPage'
import { SummaryResultPage } from './pages/SummaryResultPage'
import { VerificationPage } from './pages/VerificationPage'

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="new-summary" element={<NewSummaryPage />} />
            <Route path="summary/:id" element={<SummaryResultPage />} />
            <Route path="verification/:id" element={<VerificationPage />} />
            <Route path="clinical-notes" element={<ClinicalNotesPage />} />
            <Route path="review" element={<ReviewQueuePage />} />
            <Route path="patient-summaries" element={<PatientSummariesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
