import React, { useState } from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ConfidenceIndicator } from '../common/ConfidenceIndicator';
import { Modal } from '../common/Modal';
import { MedicalReport } from '../../types/clinical';
import {
  FileText,
  Upload,
  Calendar,
  Building2,
  CheckCircle2,
  ExternalLink,
  Search,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    reports,
    setIsUploadModalOpen,
    setIsReviewModalOpen,
    setSelectedReport,
  } = useMedLens();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewingDocument, setViewingDocument] = useState<MedicalReport | null>(null);

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by title, clinic, or file name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Upload className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Upload New Report
          </Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => {
          return (
            <Card
              key={report.id}
              className="flex flex-col justify-between hover:border-teal-300 transition-all cursor-pointer group"
              header={
                <div className="flex items-start justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                    <span className="font-semibold text-xs uppercase tracking-wider text-teal-800">
                      {report.type.replace('_', ' ')}
                    </span>
                  </div>
                  <ConfidenceIndicator confidence={report.overallConfidence} showBar={false} />
                </div>
              }
            >
              <div>
                <h3 className="font-semibold text-slate-900 text-sm group-hover:text-teal-700 transition-colors leading-snug">
                  {report.title}
                </h3>

                <div className="space-y-1 mt-2.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{report.facility}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Service Date: <strong className="text-slate-700">{report.serviceDate}</strong></span>
                  </div>
                </div>

                <div className="mt-4 p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-center flex-1 border-r border-slate-200">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Labs</div>
                    <div className="font-bold text-slate-800 text-sm">{report.extractedCount.labs}</div>
                  </div>
                  <div className="text-center flex-1 border-r border-slate-200">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Meds</div>
                    <div className="font-bold text-slate-800 text-sm">{report.extractedCount.medications}</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Status</div>
                    <div className="font-bold text-emerald-700 text-xs flex items-center justify-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Extracted
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewingDocument(report);
                  }}
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Inspect Source
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReport(report);
                    setIsReviewModalOpen(true);
                  }}
                  className="text-xs text-teal-700 hover:text-teal-900"
                >
                  Review Fields
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Raw Source Document Viewer Modal */}
      {viewingDocument && (
        <Modal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          title={viewingDocument.title}
          subtitle={`Source Facility: ${viewingDocument.facility} • Collected: ${viewingDocument.serviceDate}`}
          maxWidth="4xl"
          footer={
            <div className="flex items-center justify-between w-full text-xs">
              <div className="text-slate-500">
                File: <span className="font-mono text-slate-700">{viewingDocument.fileName}</span> ({viewingDocument.fileSize})
              </div>
              <Button variant="outline" size="sm" onClick={() => setViewingDocument(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg text-xs text-teal-900 flex items-center justify-between">
              <span>
                <strong>Original Document Facsimile:</strong> All clinical extractions maintain direct snippet citations to this text.
              </span>
              <span className="font-bold">Extraction Confidence: {viewingDocument.overallConfidence}%</span>
            </div>

            {/* Document Content Pre */}
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed max-h-[55vh] shadow-inner selection:bg-teal-600 selection:text-white">
              <pre className="whitespace-pre-wrap">{viewingDocument.rawText}</pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
