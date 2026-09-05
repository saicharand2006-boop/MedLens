import React from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Card } from '../common/Card';
import { ProvenanceBadge } from '../common/Badge';
import { RangeStatusBadge } from '../common/RangeStatusBadge';
import {
  Sparkles,
  User,
  FileText,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export const PatientSummaryView: React.FC = () => {
  const {
    patient,
    labResults,
    medications,
    allergies,
    setSelectedLabResult,
    setIsAuditDrawerOpen,
    setActiveTab,
  } = useMedLens();

  // Find latest glycemic and lipid metrics for grounding
  const latestA1c = labResults.find(l => l.testName.toLowerCase().includes('a1c') && l.reportDate === '2026-01-22');
  const baselineA1c = labResults.find(l => l.testName.toLowerCase().includes('a1c') && l.reportDate === '2025-06-12');

  const latestGlucose = labResults.find(l => l.testName.toLowerCase().includes('glucose') && l.reportDate === '2026-01-22');
  const latestChol = labResults.find(l => l.testName.toLowerCase().includes('total cholesterol') && l.reportDate === '2026-01-22');
  const hsCRP = labResults.find(l => l.testName.toLowerCase().includes('crp'));

  return (
    <div className="space-y-6">
      {/* Responsible AI Clinical Boundary Notice */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 shadow-xs flex items-start gap-3.5">
        <div className="p-2 bg-purple-100 rounded-lg text-purple-800 shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-purple-950">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm">Grounded AI Clinical Synthesis Model</h3>
            <ProvenanceBadge category="ai_generated" size="xs" />
          </div>
          <p className="leading-relaxed">
            This patient-friendly synthesis organizes findings present across your verified laboratory panels and self-reported health history. <strong>MedLens does not offer diagnostic conclusions, clinical judgements, or treatment alterations.</strong> Information is structured into three strictly distinct zones below to preserve provenance.
          </p>
        </div>
      </div>

      {/* 3 Strictly Separated Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ZONE 1: Reported Facts (Patient-Provided) */}
        <Card
          className="border-t-4 border-t-blue-600"
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-700" />
                <span className="font-bold text-slate-900 text-sm">Zone 1: Reported Facts</span>
              </div>
              <ProvenanceBadge category="user_provided" size="xs" />
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Information manually submitted by the patient during intake or profile maintenance:
            </p>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-2">
              <div className="font-semibold text-blue-950">Self-Reported Symptoms:</div>
              <p className="text-slate-700">
                &quot;{patient.userNotes || 'Mild evening tingling in toes; general fatigue after large meals.'}&quot;
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-800">Confirmed Drug Allergies:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {allergies.map(a => (
                  <li key={a.id}>
                    <strong>{a.substance}</strong>: {a.reaction} ({a.severity})
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-800">Over-the-Counter Supplements:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {medications.filter(m => m.provenance.category === 'user_provided').map(m => (
                  <li key={m.id}>
                    <strong>{m.name}</strong> {m.strength} ({m.frequency})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* ZONE 2: Direct Extracted Clinical Data (Reported Labs & Records) */}
        <Card
          className="border-t-4 border-t-teal-600"
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <span className="font-bold text-slate-900 text-sm">Zone 2: Directly Extracted Data</span>
              </div>
              <ProvenanceBadge category="extracted_from_report" size="xs" />
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Verified clinical findings extracted directly from accredited laboratory and clinic reports:
            </p>

            {/* Key Verified Metrics */}
            <div className="space-y-2">
              {latestA1c && (
                <div
                  onClick={() => {
                    setSelectedLabResult(latestA1c);
                    setIsAuditDrawerOpen(true);
                  }}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-white cursor-pointer transition-colors group flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-teal-700">
                      Hemoglobin A1c: {latestA1c.value} {latestA1c.unit}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Ref: {latestA1c.referenceRange?.text} • Date: {latestA1c.reportDate}
                    </div>
                  </div>
                  <RangeStatusBadge status={latestA1c.status} size="sm" showIconOnly />
                </div>
              )}

              {latestGlucose && (
                <div
                  onClick={() => {
                    setSelectedLabResult(latestGlucose);
                    setIsAuditDrawerOpen(true);
                  }}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-white cursor-pointer transition-colors group flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-teal-700">
                      Fasting Glucose: {latestGlucose.value} {latestGlucose.unit}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Ref: {latestGlucose.referenceRange?.text} • Date: {latestGlucose.reportDate}
                    </div>
                  </div>
                  <RangeStatusBadge status={latestGlucose.status} size="sm" showIconOnly />
                </div>
              )}

              {latestChol && (
                <div
                  onClick={() => {
                    setSelectedLabResult(latestChol);
                    setIsAuditDrawerOpen(true);
                  }}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-white cursor-pointer transition-colors group flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-teal-700">
                      Total Cholesterol: {latestChol.value} {latestChol.unit}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Ref: {latestChol.referenceRange?.text} • Date: {latestChol.reportDate}
                    </div>
                  </div>
                  <RangeStatusBadge status={latestChol.status} size="sm" showIconOnly />
                </div>
              )}

              {hsCRP && (
                <div
                  onClick={() => {
                    setSelectedLabResult(hsCRP);
                    setIsAuditDrawerOpen(true);
                  }}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-white cursor-pointer transition-colors group flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-teal-700">
                      hs-CRP: {hsCRP.value} {hsCRP.unit}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Ref: Not provided in source report
                    </div>
                  </div>
                  <RangeStatusBadge status={hsCRP.status} size="sm" showIconOnly />
                </div>
              )}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('labs')}
                className="text-xs text-teal-700 hover:text-teal-900 font-medium"
              >
                Inspect all {labResults.length} extracted analytes &rarr;
              </button>
            </div>
          </div>
        </Card>

        {/* ZONE 3: AI-Generated Plain-Language Synthesis */}
        <Card
          className="border-t-4 border-t-purple-600"
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span className="font-bold text-slate-900 text-sm">Zone 3: AI Synthesis</span>
              </div>
              <ProvenanceBadge category="ai_generated" size="xs" />
            </div>
          }
        >
          <div className="space-y-3 text-xs leading-relaxed text-slate-700">
            <p className="font-medium text-slate-900">
              Plain-Language Interpretation of Trends:
            </p>

            <div className="p-3 bg-purple-50/40 rounded-lg border border-purple-100 space-y-2">
              <div>
                <strong>Glycemic Control: </strong>
                Your Hemoglobin A1c (which estimates average blood sugar over the previous 2-3 months) declined from{' '}
                <button
                  onClick={() => baselineA1c && setSelectedLabResult(baselineA1c)}
                  className="inline-flex items-center font-bold text-purple-900 underline decoration-purple-300 hover:decoration-purple-800"
                >
                  8.4% [June 2025]
                </button>{' '}
                to{' '}
                <button
                  onClick={() => latestA1c && setSelectedLabResult(latestA1c)}
                  className="inline-flex items-center font-bold text-purple-900 underline decoration-purple-300 hover:decoration-purple-800"
                >
                  6.8% [Jan 2026]
                </button>
                . While still mildly above the standard non-diabetic range (4.0 - 5.6%), this reflects progressive improvement.
              </div>

              <div className="pt-1.5 border-t border-purple-200/60">
                <strong>Lipid Profile: </strong>
                Under your current Atorvastatin therapy, Total Cholesterol and Triglycerides have normalized below the laboratory&apos;s published upper boundaries.
              </div>

              <div className="pt-1.5 border-t border-purple-200/60">
                <strong>Kidney Markers: </strong>
                Serum Creatinine (0.85 mg/dL) and eGFR (81 mL/min/1.73m2) have remained stable across all three documented testing dates.
              </div>
            </div>

            <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded text-[11px] text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Uncertainty / Missing Reference Range:</strong> For hs-CRP (2.1 mg/L), the reporting laboratory did not supply a reference interval. MedLens does not classify this value as normal or abnormal. Discuss this with your physician.
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Suggested Questions to Ask Your Doctor */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-700" />
            <span className="font-semibold text-slate-900">
              Suggested Questions for Your Next Clinical Consultation
            </span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-teal-700 font-mono">1.</span>
              <span>Glycemic Target Goals</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              &quot;My A1c has decreased from 8.4% to 6.8%. Is 6.8% our current target, or should we aim closer to under 6.5%?&quot;
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-teal-700 font-mono">2.</span>
              <span>Peripheral Symptoms</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              &quot;I have experienced evening tingling in my toes. Should we perform a formal monofilament or neurological sensory exam?&quot;
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-teal-700 font-mono">3.</span>
              <span>Renal & Microalbumin Monitoring</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              &quot;My October 2025 microalbumin test showed 38 mg/g. When would you like to schedule a repeat urine albumin-to-creatinine ratio?&quot;
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
