import React from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Button } from '../common/Button';
import {
  Activity,
  Upload,
  ClipboardCheck,
  Download,
  RotateCcw,
  AlertCircle,
  Search,
} from 'lucide-react';

export const AppHeader: React.FC<{
  searchQuery: string;
  onSearchChange: (q: string) => void;
}> = ({ searchQuery, onSearchChange }) => {
  const {
    patient,
    allergies,
    pendingReviewCount,
    setIsUploadModalOpen,
    setIsReviewModalOpen,
    exportRecordJSON,
    resetToDemoData,
  } = useMedLens();

  const severeAllergies = allergies.filter(a => a.severity === 'severe' || a.severity === 'life_threatening');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-teal-600/20">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">MedLens</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                  Clinical Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Structured • Traceable • Human-Verified
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search lab results, medications, conditions..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-200 bg-slate-50 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Review Queue CTA */}
            <Button
              variant={pendingReviewCount > 0 ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setIsReviewModalOpen(true)}
              leftIcon={<ClipboardCheck className="w-4 h-4" />}
              className="relative"
            >
              <span className="hidden sm:inline">Review Queue</span>
              {pendingReviewCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-amber-950 font-bold text-[10px] rounded-full">
                  {pendingReviewCount}
                </span>
              )}
            </Button>

            {/* Upload Report Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsUploadModalOpen(true)}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Upload Report</span>
              <span className="sm:hidden">Upload</span>
            </Button>

            {/* Export JSON/FHIR */}
            <Button
              variant="outline"
              size="sm"
              onClick={exportRecordJSON}
              title="Export structured record as JSON"
              aria-label="Export patient record"
            >
              <Download className="w-4 h-4 text-slate-600" />
            </Button>

            {/* Reset Demo */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm('Reset patient data back to initial demo dataset?')) {
                  resetToDemoData();
                }
              }}
              title="Reset to original demo clinical data"
              aria-label="Reset demo data"
            >
              <RotateCcw className="w-4 h-4 text-slate-500 hover:text-slate-800" />
            </Button>
          </div>
        </div>
      </div>

      {/* Patient Identity Strip */}
      <div className="bg-slate-100/90 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          {/* Patient Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-sm">{patient.name}</span>
              <span className="text-slate-400">•</span>
              <span>MRN: <strong className="font-mono text-slate-800">{patient.mrn}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <span>DOB: <strong>{patient.dateOfBirth}</strong> ({patient.age}y)</span>
              <span>Sex: <strong>{patient.biologicalSex}</strong></span>
              {patient.bloodType && <span>Blood: <strong>{patient.bloodType}</strong></span>}
            </div>
          </div>

          {/* Allergy Alert Tag */}
          {severeAllergies.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 font-medium text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>
                Allergy Alert: <strong>{severeAllergies.map(a => a.substance).join(', ')}</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
