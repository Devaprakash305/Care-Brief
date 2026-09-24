import React from 'react'
import { Search, Bell, Building2, Menu, ShieldCheck } from 'lucide-react'
import { mockCurrentUser } from '../../data/mockData'

interface HeaderProps {
  onOpenMobileMenu?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Mobile Menu Button + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, MRN, diagnosis, or clinical note..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Hospital Context & Actions */}
      <div className="flex items-center gap-3">
        {/* Hospital Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium text-slate-800">{mockCurrentUser.hospital}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">{mockCurrentUser.department}</span>
        </div>

        {/* Verification Status Guard Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-medium text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Factual Verification Enabled</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
        </button>
      </div>
    </header>
  )
}
