import React, { FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Stethoscope, ClipboardCheck } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { UserRole } from '../types'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const roleDetails: Record<'clinician' | 'doctor', { title: string; description: string; icon: React.ReactNode }> = {
  clinician: { title: 'Clinician Portal', description: 'Create patient records and prepare AI discharge summaries.', icon: <Stethoscope className="w-5 h-5" /> },
  doctor: { title: 'Doctor Verification Portal', description: 'Review, edit, approve, and release discharge instructions.', icon: <ClipboardCheck className="w-5 h-5" /> }
}

export const LoginPage: React.FC = () => {
  const location = useLocation()
  const selectedRole: 'clinician' | 'doctor' = location.pathname === '/login/doctor' ? 'doctor' : 'clinician'
  const details = roleDetails[selectedRole]
  const navigate = useNavigate()
  const { session, profile, loading, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session && profile && (profile.role === selectedRole || profile.role === 'admin')) {
    return <Navigate to={selectedRole === 'doctor' ? '/doctor' : '/dashboard'} replace />
  }

  const handleRoleSwitch = async (nextRole: 'clinician' | 'doctor') => {
    if (session) await signOut()
    navigate(`/login/${nextRole}`, { replace: true })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email.trim(), password, selectedRole)
      navigate(selectedRole === 'doctor' ? '/doctor' : '/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-slate-900 text-white p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950"><Stethoscope className="w-5 h-5" /></div>
            <div><p className="font-bold text-lg">CareBrief AI</p><p className="text-xs text-slate-400">Role-secured clinical communication</p></div>
          </div>
          <div className="flex items-center gap-2 text-teal-300 text-sm font-semibold">{details.icon}{details.title}</div>
          <p className="text-sm text-slate-300 mt-2">{details.description}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <Input label="Work email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="name@hospital.org" />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="Enter your password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</p>}
          <Button type="submit" className="w-full" isLoading={submitting}>Sign in</Button>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            {(Object.keys(roleDetails) as Array<'clinician' | 'doctor'>).map((item) => (
              <button key={item} type="button" onClick={() => void handleRoleSwitch(item)} className={`text-xs py-2 rounded-lg border ${item === selectedRole ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-500'}`}>{item}</button>
            ))}
          </div>
        </form>
      </div>
    </main>
  )
}
