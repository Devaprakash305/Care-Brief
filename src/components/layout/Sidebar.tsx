import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  CheckSquare,
  FileCheck2,
  BarChart3,
  Settings,
  ShieldCheck,
  Stethoscope,
  Sparkles
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { mockCurrentUser } from '../../data/mockData'

interface SidebarProps {
  onCloseMobile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Summary', path: '/new-summary', icon: FilePlus2 },
    { label: 'Clinical Notes', path: '/clinical-notes', icon: FileText },
    { label: 'Review Queue', path: '/review', icon: CheckSquare, badge: '7' },
    { label: 'Patient Summaries', path: '/patient-summaries', icon: FileCheck2 },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 }
  ]

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 select-none shrink-0">
      {/* Brand & Logo Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-teal-900/30">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base tracking-tight">CareBrief</span>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-semibold px-1.5 py-0.2 rounded-md">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
              Making clinical instructions easier
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Clinical Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-slate-800 text-white shadow-2xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-300'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}

        <div className="pt-4 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          System & Config
        </div>
        <NavLink
          to="/settings"
          onClick={onCloseMobile}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
              isActive
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            )
          }
        >
          <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Trust & Safety Guard Banner */}
      <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-medium text-teal-400 text-xs mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Factual Safety Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-normal">
          100% clinician review enforcement before patient delivery.
        </p>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-teal-500/30">
              AS
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white truncate">{mockCurrentUser.name}</h4>
            <p className="text-[11px] text-teal-400 truncate">{mockCurrentUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
