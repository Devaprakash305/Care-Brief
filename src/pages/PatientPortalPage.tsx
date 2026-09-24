import React, { useEffect, useState } from 'react'
import { BookOpen, LogOut, Languages, ShieldCheck } from 'lucide-react'
import { LoadingState } from '../components/common/LoadingState'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { summaryService } from '../services/supabaseSummaryService'
import { DischargeSummary, LiteracyLevel } from '../types'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

const literacyOptions = ['Professional', 'Standard', 'Simple', 'Very Simple', 'Visual/Bullet Focus']

export const PatientPortalPage: React.FC = () => {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [summaries, setSummaries] = useState<DischargeSummary[]>([])
  const [selected, setSelected] = useState<DischargeSummary | null>(null)
  const [level, setLevel] = useState<LiteracyLevel>('Simple')
  const [loading, setLoading] = useState(true)
  const [adapting, setAdapting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    summaryService.getPatientSummaries()
      .then((items) => {
        setSummaries(items)
        setSelected(items[0] || null)
        if (items[0]) setLevel(items[0].readingLevel)
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load your approved instructions.'))
      .finally(() => setLoading(false))
  }, [])

  const requestLevel = async () => {
    if (!selected || level === selected.readingLevel) return
    setAdapting(true)
    setError('')
    try {
      const adapted = await summaryService.generatePatientAdaptation(selected, level)
      setSelected(adapted)
    } catch (adaptError) {
      setError(adaptError instanceof Error ? adaptError.message : 'Unable to prepare this reading level.')
    } finally {
      setAdapting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-50 p-8"><LoadingState title="Loading your approved instructions..." /></div>
  if (error) return <main className="min-h-screen bg-slate-50 p-8 text-rose-700">{error}</main>

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-5">
        <header className="bg-slate-900 text-white rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-teal-300 text-xs font-semibold uppercase tracking-wider">CareBrief Patient Portal</p>
              <h1 className="text-2xl font-bold mt-2">Your approved discharge instructions</h1>
              <p className="text-sm text-slate-300 mt-1">These instructions were reviewed and released by your doctor.</p>
            </div>
            <button
              type="button"
              onClick={() => void signOut().then(() => navigate('/login/patient'))}
              className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </header>

        {summaries.length > 1 && (
          <Select label="Discharge summary" value={selected?.id || ''} onChange={(event) => setSelected(summaries.find((item) => item.id === event.target.value) || null)} options={summaries.map((item) => ({ value: item.id, label: `${item.condition} - ${item.language}` }))} />
        )}

        {selected && (
          <>
            <section className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between">
              <div>
                <p className="text-xs text-slate-500">Language: {selected.language}</p>
                <p className="font-semibold text-slate-900 mt-1 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Doctor approved</p>
              </div>
              <div className="flex gap-2 items-end">
                <Select label="Reading level" value={level} onChange={(event) => setLevel(event.target.value as LiteracyLevel)} options={literacyOptions.map((item) => ({ value: item, label: item }))} />
                <Button onClick={() => void requestLevel()} isLoading={adapting} icon={<BookOpen className="w-4 h-4" />}>Apply</Button>
              </div>
            </section>

            <article className="bg-white border border-slate-200 rounded-xl p-6 space-y-7 text-slate-800">
              <section><h2 className="text-lg font-bold text-slate-900">{selected.content.headlineSummary}</h2></section>
              <section><h3 className="font-bold text-slate-900 flex items-center gap-2"><Languages className="w-4 h-4 text-teal-600" /> Medicines</h3>{selected.content.medicationGuide.map((item, index) => <div key={index} className="mt-3 p-3 bg-slate-50 rounded-lg"><p className="font-semibold">{item.name} - {item.dosage}</p><p className="text-sm mt-1">{item.frequency}</p><p className="text-sm mt-1">{item.instructions}</p></div>)}</section>
              <section><h3 className="font-bold text-slate-900">Daily care and diet</h3>{selected.content.dailyCareAndDiet.map((item, index) => <p key={index} className="mt-2 text-sm">{item}</p>)}</section>
              <section><h3 className="font-bold text-slate-900">Follow-up</h3>{selected.content.followUpAppointments.map((item, index) => <p key={index} className="mt-2 text-sm">{item.doctor} - {item.timeframe} - {item.purpose}</p>)}</section>
              <section><h3 className="font-bold text-rose-800">Warning signs</h3>{selected.content.warningSignsWhenToCall.map((item, index) => <p key={index} className="mt-2 text-sm text-rose-900">{item}</p>)}</section>
            </article>
          </>
        )}
      </div>
    </main>
  )
}
