import React, { useState, useRef } from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Modal } from '../common/Modal';
import { samplePrebuiltReports } from '../../data/mockClinicalData';
import { processClinicalDocument } from '../../services/extractionService';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Cpu,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const ReportUploadModal: React.FC = () => {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    addReportWithExtracts,
    setIsReviewModalOpen,
  } = useMedLens();

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadSample = async (sample: typeof samplePrebuiltReports[0]) => {
    setIsProcessing(true);
    setUploadError(null);
    setProgressPercent(10);
    setCurrentStage('Initializing Clinical Document Parser...');

    try {
      const result = await processClinicalDocument(
        {
          name: sample.fileName,
          size: 250 * 1024,
          content: sample.rawText,
          facility: sample.facility,
          serviceDate: sample.serviceDate,
        },
        (stage, percent) => {
          setCurrentStage(stage);
          setProgressPercent(percent);
        }
      );

      // Add report and staged items to context
      addReportWithExtracts(
        result.report,
        result.extractedLabs,
        result.extractedMedications,
        result.extractedConditions
      );

      setIsProcessing(false);
      setIsUploadModalOpen(false);
      // Automatically prompt the user to review the freshly extracted items!
      setIsReviewModalOpen(true);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to process document. Please ensure the file format is supported.');
      setIsProcessing(false);
    }
  };

  const handleUserFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadError(null);
    setProgressPercent(15);
    setCurrentStage(`Reading ${file.name}...`);

    try {
      let content = '';
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        content = await file.text();
      } else {
        // For uploaded PDFs or images, demonstrate simulated OCR reading of lab reports
        content = `CLINICAL LABORATORY REPORT\nPatient: Eleanor Vance | File: ${file.name}\nService Date: ${new Date().toISOString().split('T')[0]}\n\nCOMPREHENSIVE LAB PANEL\nTest Name              Result    Flag   Reference Range    Units\nGlucose, Fasting       126       HIGH   70 - 99            mg/dL\nCreatinine             0.89             0.50 - 1.10        mg/dL\neGFR                   79               > 60               mL/min/1.73m2\nTotal Cholesterol      184              125 - 200          mg/dL\nTriglycerides          145              < 150              mg/dL\nPotassium              4.5              3.5 - 5.1          mmol/L\nNovel Biomarker X      1.4              [No Range Stated]  ng/mL\n\nActive Meds: Metformin 1000mg PO BID`;
      }

      const result = await processClinicalDocument(
        {
          name: file.name,
          size: file.size,
          content,
        },
        (stage, percent) => {
          setCurrentStage(stage);
          setProgressPercent(percent);
        }
      );

      addReportWithExtracts(
        result.report,
        result.extractedLabs,
        result.extractedMedications,
        result.extractedConditions
      );

      setIsProcessing(false);
      setIsUploadModalOpen(false);
      setIsReviewModalOpen(true);
    } catch (err) {
      console.error(err);
      setUploadError('An error occurred during file reading.');
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={() => {
        if (!isProcessing) setIsUploadModalOpen(false);
      }}
      title="Upload Medical Report"
      subtitle="Supported formats: PDF, Text, High-Resolution Photos. All extractions are staged for human verification."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {uploadError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {isProcessing ? (
          <div className="py-8 px-4 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-teal-200 border-t-teal-700 animate-spin" />
              <Cpu className="w-7 h-7 text-teal-700" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">Processing Medical Document</h3>
              <p className="text-xs text-slate-600 font-mono mt-1">{currentStage}</p>
            </div>

            {/* Progress bar */}
            <div className="max-w-md mx-auto w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-teal-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Extracting analytes, preserving exact units and reference ranges, and formulating provenance snippets.
            </p>
          </div>
        ) : (
          <>
            {/* File Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/20 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUserFileSelected}
                accept=".pdf,.txt,.png,.jpg,.jpeg,.doc,.docx"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-teal-50 group-hover:bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3 transition-colors">
                <UploadCloud className="w-6 h-6 stroke-[2]" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Choose a medical report file or drag & drop here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PDF, TXT, PNG, JPG up to 25MB
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center text-xs font-medium text-teal-700 group-hover:text-teal-900">
                  Browse Files &rarr;
                </span>
              </div>
            </div>

            {/* 1-Click Realistic Clinical Samples */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Or Test with Real-World Clinical Sample Reports
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {samplePrebuiltReports.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleUploadSample(sample)}
                    className="p-4 rounded-lg border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/30 transition-all cursor-pointer shadow-xs group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-2 mb-1.5">
                        <FileText className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <h5 className="font-semibold text-xs text-slate-900 leading-snug group-hover:text-teal-950">
                          {sample.title}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {sample.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">{sample.facility}</span>
                      <span className="font-medium text-teal-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Simulate Extraction <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Safety Note */}
            <div className="p-3 rounded-md bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong>Local & Private Processing:</strong> Medical reports are processed directly within your browser session. Raw text and extracted values remain under your local control.
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
