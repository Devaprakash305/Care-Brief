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
import { LoginPage } from './pages/LoginPage'
import { AccessPage } from './pages/AccessPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login/clinician" element={<LoginPage />} />
          <Route path="/login/doctor" element={<LoginPage />} />
          <Route path="/access-pending" element={<AccessPage pending />} />
          <Route path="/unauthorized" element={<AccessPage />} />
          <Route path="/" element={<AppLayout />}>
            <Route element={<ProtectedRoute roles={['clinician', 'doctor', 'admin']} />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="summary/:id" element={<SummaryResultPage />} />
              <Route path="verification/:id" element={<VerificationPage />} />
              <Route path="patient-summaries" element={<PatientSummariesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="doctor" element={<ReviewQueuePage />} />
            </Route>
            <Route element={<ProtectedRoute roles={['clinician', 'admin']} />}>
              <Route path="new-summary" element={<NewSummaryPage />} />
            </Route>
            <Route element={<ProtectedRoute roles={['doctor', 'admin']} />}>
              <Route path="clinical-notes" element={<ClinicalNotesPage />} />
              <Route path="review" element={<ReviewQueuePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
