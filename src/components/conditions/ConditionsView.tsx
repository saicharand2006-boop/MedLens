import React, { useState } from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Card } from '../common/Card';
import { ProvenanceBadge, VerificationStatusBadge } from '../common/Badge';
import { HeartPulse } from 'lucide-react';

export const ConditionsView: React.FC = () => {
  const { conditions } = useMedLens();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('all');

  const filteredConditions = conditions.filter(c => {
    if (filterStatus === 'all') return true;
    return c.clinicalStatus === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Documented Conditions & Diagnostic History</h2>
          <p className="text-xs text-slate-500">
            Records clinical diagnoses identified in source reports and self-reported patient symptom history.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'all'
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({conditions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'active'
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Active ({conditions.filter(c => c.clinicalStatus === 'active').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('resolved')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'resolved'
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Resolved ({conditions.filter(c => c.clinicalStatus === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Conditions List */}
      <div className="space-y-3">
        {filteredConditions.map((condition) => {
          return (
            <Card
              key={condition.id}
              className="hover:border-teal-300 transition-colors"
              header={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <HeartPulse className="w-4 h-4 text-teal-700" />
                    <span className="font-bold text-slate-900 text-sm">{condition.name}</span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      condition.clinicalStatus === 'active'
                        ? 'bg-teal-50 text-teal-800 border border-teal-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {condition.clinicalStatus}
                  </span>
                </div>
              }
            >
              <div className="space-y-3 text-xs">
                {condition.notes && (
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                    {condition.notes}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-slate-500">
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">Onset / Diagnosed</span>
                    <span className="font-medium text-slate-700 font-mono">{condition.onsetDate || 'Not documented'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">Information Origin</span>
                    <ProvenanceBadge category={condition.provenance.category} size="xs" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">Verification</span>
                    <VerificationStatusBadge status={condition.verification.status} size="xs" />
                  </div>
                </div>

                {condition.provenance.exactSnippet && (
                  <div className="mt-2 p-2.5 bg-slate-100/70 rounded font-mono text-[11px] text-slate-700 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Source Snippet:</div>
                    &quot;{condition.provenance.exactSnippet}&quot;
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
