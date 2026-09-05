import React, { useState } from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Card } from '../common/Card';
import { ProvenanceBadge, VerificationStatusBadge } from '../common/Badge';
import {
  Pill,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const MedicationsView: React.FC = () => {
  const { medications, reports, setSelectedReport, setActiveTab } = useMedLens();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'extracted' | 'user'>('all');

  const filteredMeds = medications.filter(med => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.prescribingContext && med.prescribingContext.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (med.strength && med.strength.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      filterType === 'all' ||
      (filterType === 'extracted' && med.provenance.category === 'extracted_from_report') ||
      (filterType === 'user' && med.provenance.category === 'user_provided');

    return matchesSearch && matchesType;
  });

  const extractedCount = medications.filter(m => m.provenance.category === 'extracted_from_report').length;
  const userCount = medications.filter(m => m.provenance.category === 'user_provided').length;

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medications by name or indication..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md shadow-xs" role="group">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-l-md border ${
                filterType === 'all'
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              All ({medications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('extracted')}
              className={`px-3 py-1.5 text-xs font-medium border-t border-b ${
                filterType === 'extracted'
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Report Extracted ({extractedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('user')}
              className={`px-3 py-1.5 text-xs font-medium rounded-r-md border ${
                filterType === 'user'
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              User Self-Reported ({userCount})
            </button>
          </div>
        </div>
      </div>

      {/* Medication Safety Boundary Alert */}
      <div className="p-3.5 rounded-lg bg-slate-100/90 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <strong>Non-Interventional Medication Registry:</strong> MedLens displays recorded prescriptions and supplements purely for information organization. MedLens does not suggest dosage alterations, drug substitutions, or discontinue orders. Always consult your prescribing physician.
        </div>
      </div>

      {/* Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeds.map((med) => {
          const sourceReport = reports.find(r => r.id === med.provenance.sourceDocumentId);

          return (
            <Card
              key={med.id}
              className="hover:border-teal-300 transition-all"
              header={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-700" />
                    <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                  </div>
                  {med.strength && (
                    <span className="font-mono text-xs font-bold text-teal-900 bg-teal-100 px-2 py-0.5 rounded border border-teal-200">
                      {med.strength}
                    </span>
                  )}
                </div>
              }
            >
              <div className="space-y-3 text-xs">
                {/* Dosage instructions */}
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-semibold">
                    Reported Instructions & Frequency
                  </div>
                  <div className="font-semibold text-slate-800 text-xs">
                    {med.frequency || 'Frequency not explicitly specified in source.'}
                  </div>
                  {med.route && (
                    <div className="text-slate-500 text-[11px]">
                      Route of Administration: <strong>{med.route}</strong>
                    </div>
                  )}
                </div>

                {/* Clinical context */}
                {med.prescribingContext && (
                  <div className="text-slate-600">
                    <span className="text-slate-400">Clinical Indication: </span>
                    <strong className="text-slate-800">{med.prescribingContext}</strong>
                  </div>
                )}

                {/* Provenance trace */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Origin</span>
                    <ProvenanceBadge category={med.provenance.category} size="xs" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Verification</span>
                    <VerificationStatusBadge status={med.verification.status} size="xs" />
                  </div>

                  {med.provenance.sourceDocumentName && (
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Source Report</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (sourceReport) {
                            setSelectedReport(sourceReport);
                            setActiveTab('reports');
                          }
                        }}
                        className="text-teal-700 hover:text-teal-900 font-medium truncate max-w-[180px]"
                      >
                        {med.provenance.sourceDocumentName}
                      </button>
                    </div>
                  )}

                  {med.provenance.exactSnippet && (
                    <div className="p-2 bg-slate-100/70 rounded text-[11px] font-mono text-slate-700 border border-slate-200">
                      &quot;{med.provenance.exactSnippet}&quot;
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
