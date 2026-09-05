import React, { useState } from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Drawer } from '../common/Drawer';
import { ProvenanceBadge, VerificationStatusBadge } from '../common/Badge';
import { RangeStatusBadge } from '../common/RangeStatusBadge';
import { ConfidenceIndicator } from '../common/ConfidenceIndicator';
import { Button } from '../common/Button';
import {
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  Edit3,
  History,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const SourceAuditDrawer: React.FC = () => {
  const {
    selectedLabResult,
    isAuditDrawerOpen,
    setIsAuditDrawerOpen,
    reports,
    verifyLabResult,
    editLabResult,
    setSelectedReport,
    setActiveTab,
    auditLogs,
  } = useMedLens();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>('');
  const [editUnit, setEditUnit] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('');

  if (!selectedLabResult) return null;

  const sourceReport = reports.find(r => r.id === selectedLabResult.reportId);
  const relevantAudits = auditLogs.filter(
    a => a.targetId === selectedLabResult.id || (selectedLabResult.reportId && a.targetId === selectedLabResult.reportId)
  );

  const handleStartEdit = () => {
    setEditValue(String(selectedLabResult.value));
    setEditUnit(selectedLabResult.unit);
    setEditReason('');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const numVal = parseFloat(editValue);
    editLabResult(
      selectedLabResult.id,
      {
        value: isNaN(numVal) ? editValue : numVal,
        unit: editUnit,
      },
      editReason || 'User corrected extracted value in Provenance Inspector.'
    );
    setIsEditing(false);
  };

  const handleVerify = () => {
    verifyLabResult(selectedLabResult.id, 'Verified by user via Source Provenance Inspector.');
  };

  const handleOpenSourceReport = () => {
    if (sourceReport) {
      setSelectedReport(sourceReport);
      setActiveTab('reports');
      setIsAuditDrawerOpen(false);
    }
  };

  return (
    <Drawer
      isOpen={isAuditDrawerOpen}
      onClose={() => {
        setIsAuditDrawerOpen(false);
        setIsEditing(false);
      }}
      title={
        <div className="flex items-center gap-2">
          <span className="font-semibold">{selectedLabResult.testName}</span>
          <span className="text-slate-400">|</span>
          <span className="text-sm text-slate-500 font-normal">Provenance & Audit Trail</span>
        </div>
      }
      subtitle={`Analyte recorded on ${selectedLabResult.reportDate}`}
      width="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500">
            Audit ID: <span className="font-mono">{selectedLabResult.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedLabResult.verification.status !== 'verified' && (
              <Button
                variant="success"
                size="sm"
                onClick={handleVerify}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Mark Verified
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAuditDrawerOpen(false);
                setIsEditing(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        {/* Current Clinical Value Summary Box */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Extracted Clinical Value
              </div>
              {!isEditing ? (
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">
                    {selectedLabResult.value}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    {selectedLabResult.unit}
                  </span>
                </div>
              ) : (
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Value</label>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="px-2.5 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Unit</label>
                      <input
                        type="text"
                        value={editUnit}
                        onChange={(e) => setEditUnit(e.target.value)}
                        className="px-2.5 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-teal-500 w-24"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Correction Rationale / Reason</label>
                    <input
                      type="text"
                      value={editReason}
                      onChange={(e) => setEditReason(e.target.value)}
                      placeholder="e.g. Typo in OCR or misread unit"
                      className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                      Save Correction
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartEdit}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Correct Value
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Source Reference Range</span>
              <span className="font-medium text-slate-800">
                {selectedLabResult.referenceRange?.text || 'Reference range not provided in source report'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Evaluated Status</span>
              <RangeStatusBadge status={selectedLabResult.status} />
            </div>
          </div>
        </div>

        {/* Provenance Classification Box */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Provenance Classification
          </h4>
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Information Origin</span>
              <ProvenanceBadge category={selectedLabResult.provenance.category} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Verification Status</span>
              <VerificationStatusBadge status={selectedLabResult.verification.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Extraction Confidence</span>
              <ConfidenceIndicator confidence={selectedLabResult.verification.confidence} />
            </div>
            {selectedLabResult.verification.originalValue !== undefined && (
              <div className="p-2 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Original Extracted Value: </strong>
                  <span>{selectedLabResult.verification.originalValue} {selectedLabResult.verification.originalUnit}</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Preserved for auditability following human correction.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Source Document Trace */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Source Document & Citation Trace
          </h4>
          <div className="p-4 rounded-lg border border-teal-200 bg-teal-50/30 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-slate-900">
                  <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>{selectedLabResult.provenance.sourceDocumentName || 'Clinical Report'}</span>
                </div>
                {selectedLabResult.provenance.facility && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedLabResult.provenance.facility}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Report Date: {selectedLabResult.reportDate}</span>
                </div>
              </div>

              {sourceReport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenSourceReport}
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  View Full Report
                </Button>
              )}
            </div>

            {/* Exact Snippet Highlight */}
            {selectedLabResult.provenance.exactSnippet && (
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                  <span>EXACT SOURCE REPORT SNIPPET</span>
                  <span className="text-[10px] text-slate-400">Page {selectedLabResult.provenance.pageNumber || 1}</span>
                </div>
                <div className="p-3 bg-white rounded border border-slate-300 font-mono text-xs text-slate-800 leading-relaxed shadow-inner">
                  <mark className="bg-amber-100 text-amber-950 font-semibold px-1 rounded">
                    {selectedLabResult.provenance.exactSnippet}
                  </mark>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Revision & Verification Audit Log */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            <span>Immutable Audit Log</span>
          </h4>
          <div className="space-y-2">
            {relevantAudits.length > 0 ? (
              relevantAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="p-3 rounded border border-slate-200 bg-white text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-700 capitalize">
                      {audit.action.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-[10px]">
                      {new Date(audit.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-slate-800">{audit.reason || 'Action recorded.'}</div>
                  <div className="text-[11px] text-slate-500">
                    Performed by: <strong>{audit.performedBy}</strong>
                  </div>
                  {audit.previousValue && audit.newValue && (
                    <div className="mt-1 pt-1 border-t border-slate-100 text-[11px] font-mono text-slate-600">
                      <div>Prev: {audit.previousValue}</div>
                      <div>New: {audit.newValue}</div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No previous manual revisions logged.</p>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
