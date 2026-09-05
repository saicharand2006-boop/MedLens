import React from 'react';
import { useMedLens, ActiveTab } from '../../context/MedLensContext';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  FlaskConical,
  Pill,
  HeartPulse,
  History,
  GitCompare,
  Sparkles,
} from 'lucide-react';

export const AppNavigation: React.FC = () => {
  const { activeTab, setActiveTab, reports, labResults, medications, conditions, pendingReviewCount } = useMedLens();

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'profile',
      label: 'Patient Profile',
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="w-4 h-4" />,
      badge: reports.length,
    },
    {
      id: 'labs',
      label: 'Laboratory Results',
      icon: <FlaskConical className="w-4 h-4" />,
      badge: labResults.length,
    },
    {
      id: 'medications',
      label: 'Medications',
      icon: <Pill className="w-4 h-4" />,
      badge: medications.filter(m => m.isActive).length,
    },
    {
      id: 'conditions',
      label: 'Conditions & History',
      icon: <HeartPulse className="w-4 h-4" />,
      badge: conditions.filter(c => c.clinicalStatus === 'active').length,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <History className="w-4 h-4" />,
    },
    {
      id: 'comparison',
      label: 'Comparison & Trends',
      icon: <GitCompare className="w-4 h-4" />,
    },
    {
      id: 'summary',
      label: 'Patient Summary',
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
      badgeColor: 'bg-amber-500 text-amber-950',
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[97px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-2 py-2 px-3.5 text-xs font-medium rounded-md whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-teal-50 text-teal-900 font-semibold shadow-xs border border-teal-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={`shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-500 group-hover:text-slate-700'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      item.badgeColor || (isActive ? 'bg-teal-200/80 text-teal-900' : 'bg-slate-200 text-slate-700')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
