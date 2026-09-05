import React, { useState } from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ConfidenceIndicator } from '../common/ConfidenceIndicator';
import { RangeStatusBadge } from '../common/RangeStatusBadge';
import {
  CheckCircle2,
  Edit2,
  Check,
  X,
  FileText,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const ReviewQueueModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    labResults,
    medications,
    conditions,
    verifyLabResult,
    editLabResult,
    verifyMedication,
    verifyCondition,
    verifyAllPendingHighConfidence,
  } = useMedLens();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [tempUnit, setTempUnit] = useState<string>('');

  const pendingLabs = labResults.filter(
    l => l.verification.status === 'needs_review' || l.verification.status === 'low_confidence'
  );
  const pendingMeds = medications.filter(m => m.verification.status === 'needs_review');
  const pendingConds = conditions.filter(c => c.verification.status === 'needs_review');

  const totalPending = pendingLabs.length + pendingMeds.length + pendingConds.length;

  const startEditLab = (id: string, val: string | number, unit: string) => {
    setEditingId(id);
    setTempValue(String(val));
    setTempUnit(unit);
  };

  const saveEditLab = (id: string) => {
    const num = parseFloat(tempValue);
    editLabResult(id, {
      value: isNaN(num) ? tempValue : num,
      unit: tempUnit,
    }, 'Value corrected during human review queue stage.');
    setEditingId(null);
  };

  return (
    <Modal
      isOpen={isReviewModalOpen}
      onClose={() => setIsReviewModalOpen(false)}
      title={
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-slate-900">Human-in-the-Loop Review Queue</span>
          {totalPending > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {totalPending} pending
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              All Verified
            </span>
          )}
        </div>
      }
      subtitle="AI-extracted clinical metrics must be reviewed and verified by a human before integration into the permanent record."
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500">
            {totalPending > 0
              ? `${totalPending} items require clinical confirmation`
              : 'Zero unverified items remaining.'}
          </div>
          <div className="flex items-center gap-2">
            {totalPending > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={verifyAllPendingHighConfidence}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Approve High Confidence (≥90%)
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsReviewModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        {totalPending === 0 ? (
          <div className="text-center py-10 px-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2.5" />
            <h3 className="font-semibold text-emerald-950 text-base">Review Queue Is Clear</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto mt-1">
              Every extracted laboratory test, medication order, and clinical condition has been reviewed and verified.
            </p>
          </div>
        ) : (
          <>
            {/* Laboratory Tests Pending Review */}
            {pendingLabs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <span>Laboratory Analytes</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px]">
                      {pendingLabs.length}
                    </span>
                  </h3>
                </div>

                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                  {pendingLabs.map((lab) => {
                    const isEditing = editingId === lab.id;
                    const isLowConfidence = lab.verification.confidence < 85;

                    return (
                      <div
                        key={lab.id}
                        className={`p-3.5 sm:p-4 transition-colors ${
                          isLowConfidence ? 'bg-amber-50/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Test name & Details */}
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{lab.testName}</span>
                              <span className="text-xs text-slate-400">({lab.category})</span>
                              {isLowConfidence && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                                  Low Confidence
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                              <span>Source: <strong className="text-slate-800">{lab.provenance.sourceDocumentName || 'Report'}</strong></span>
                              <span>Date: <strong>{lab.reportDate}</strong></span>
                              <span>Ref: <strong className="text-slate-700">{lab.referenceRange?.text || 'None Provided'}</strong></span>
                            </div>

                            {/* Snippet display */}
                            {lab.provenance.exactSnippet && (
                              <div className="mt-1 flex items-start gap-1.5 text-[11px] text-slate-500 font-mono bg-slate-100/70 px-2 py-1 rounded border border-slate-200/80">
                                <FileText className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                                <span className="truncate max-w-lg">
                                  &quot;{lab.provenance.exactSnippet}&quot;
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Value, Status & Actions */}
                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            {!isEditing ? (
                              <div className="text-right">
                                <div className="text-base font-bold text-slate-900 tabular-nums">
                                  {lab.value}{' '}
                                  <span className="text-xs font-normal text-slate-500">{lab.unit}</span>
                                </div>
                                <div className="mt-0.5">
                                  <RangeStatusBadge status={lab.status} size="sm" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  className="w-20 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                                  placeholder="Value"
                                />
                                <input
                                  type="text"
                                  value={tempUnit}
                                  onChange={(e) => setTempUnit(e.target.value)}
                                  className="w-16 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                                  placeholder="Unit"
                                />
                                <button
                                  type="button"
                                  onClick={() => saveEditLab(lab.id)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                  title="Save edit"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            <ConfidenceIndicator confidence={lab.verification.confidence} showBar={false} />

                            {!isEditing && (
                              <button
                                type="button"
                                onClick={() => startEditLab(lab.id, lab.value, lab.unit)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                                title="Edit extracted value"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}

                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => verifyLabResult(lab.id)}
                              leftIcon={<Check className="w-3.5 h-3.5" />}
                            >
                              Verify
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Medications Pending Review */}
            {pendingMeds.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-2">
                  <span>Medications</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px]">
                    {pendingMeds.length}
                  </span>
                </h3>

                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                  {pendingMeds.map((med) => (
                    <div key={med.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {med.name} {med.strength && <span className="text-teal-700">{med.strength}</span>}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {med.frequency} • {med.prescribingContext || 'Outpatient'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Extracted from: <strong>{med.provenance.sourceDocumentName}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ConfidenceIndicator confidence={med.verification.confidence} showBar={false} />
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => verifyMedication(med.id)}
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conditions Pending Review */}
            {pendingConds.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-2">
                  <span>Diagnoses & Conditions</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px]">
                    {pendingConds.length}
                  </span>
                </h3>

                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                  {pendingConds.map((cond) => (
                    <div key={cond.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900">{cond.name}</div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          Status: <strong>{cond.clinicalStatus}</strong>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Extracted from: <strong>{cond.provenance.sourceDocumentName}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ConfidenceIndicator confidence={cond.verification.confidence} showBar={false} />
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => verifyCondition(cond.id)}
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
