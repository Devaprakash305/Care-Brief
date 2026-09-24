import React from 'react'
import { Link } from 'react-router-dom'

export const AccessPage: React.FC<{ pending?: boolean }> = ({ pending = false }) => (
  <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
    <div className="max-w-md bg-white rounded-2xl p-8">
      <h1 className="text-xl font-bold text-slate-900">{pending ? 'Portal access is pending' : 'Access denied'}</h1>
      <p className="text-sm text-slate-500 mt-2">{pending ? 'Your account is authenticated but has not been assigned a CareBrief role yet.' : 'This portal is not available for your account.'}</p>
      <Link to="/login/clinician" className="inline-block mt-6 text-sm font-semibold text-teal-700">Return to login</Link>
    </div>
  </main>
)
