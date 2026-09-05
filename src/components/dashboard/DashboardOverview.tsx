import React from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RangeStatusBadge } from '../common/RangeStatusBadge';
import { ProvenanceBadge, VerificationStatusBadge } from '../common/Badge';
import {
  AlertTriangle,
  Upload,
  ClipboardCheck,
  FileText,
  Clock,
  ArrowRight,
  TrendingDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    reports,
    labResults,
    medications,
    conditions,
    allergies,
    pendingReviewCount,
    timelineEvents,
    setActiveTab,
    setIsUploadModalOpen,
    setIsReviewModalOpen,
    setSelectedLabResult,
    setIsAuditDrawerOpen,
    setSelectedReport,
  } = useMedLens();

  // Get most recent lab anomalies (above or below range)
  const anomalies = labResults.filter(
    l => l.status === 'above_range' || l.status === 'below_range'
  ).slice(0, 5);

  // Latest reports
  const latestReports = [...reports].sort(
    (a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
  ).slice(0, 3);

  // Active medications
  const activeMedications = medications.filter(m => m.isActive);

  // Active conditions
  const activeConditions = conditions.filter(c => c.clinicalStatus === 'active');

  return (
    <div className="space-y-6">
      {/* Pending Review Alert Banner if any items need review */}
      {pendingReviewCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                {pendingReviewCount} Medical Entities Await Human Verification
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Newly extracted laboratory values and medication prescriptions need confirmation before final integration.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsReviewModalOpen(true)}
            leftIcon={<ClipboardCheck className="w-4 h-4" />}
            className="shrink-0"
          >
            Open Review Queue
          </Button>
        </div>
      )}

      {/* Summary KPI Grid: Answer critical user questions at a glance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-teal-600">
          <div className="text-xs text-slate-500 font-medium">Uploaded Medical Reports</div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{reports.length}</span>
            <span className="text-xs text-slate-500">Across 3 facilities</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className="text-xs text-teal-700 hover:text-teal-900 font-medium mt-3 flex items-center gap-1"
          >
            View all reports &rarr;
          </button>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-600">
          <div className="text-xs text-slate-500 font-medium">Verified Lab Analytes</div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{labResults.length}</span>
            <span className="text-xs text-slate-500">
              {labResults.filter(l => l.verification.status === 'verified').length} verified
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('labs')}
            className="text-xs text-blue-700 hover:text-blue-900 font-medium mt-3 flex items-center gap-1"
          >
            View laboratory panel &rarr;
          </button>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-600">
          <div className="text-xs text-slate-500 font-medium">Active Prescription Regimen</div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{activeMedications.length}</span>
            <span className="text-xs text-slate-500">No conflicts noted</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('medications')}
            className="text-xs text-purple-700 hover:text-purple-900 font-medium mt-3 flex items-center gap-1"
          >
            Review medications &rarr;
          </button>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-xs text-slate-500 font-medium">Monitored Conditions</div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{activeConditions.length}</span>
            <span className="text-xs text-slate-500">Documented</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('conditions')}
            className="text-xs text-amber-700 hover:text-amber-900 font-medium mt-3 flex items-center gap-1"
          >
            View condition history &rarr;
          </button>
        </Card>
      </div>

      {/* Main Two-Column Split: Clinical Attention Items vs Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notable Lab Observations & Longitudinal Highlight */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Clinical Trend Spotlight (HbA1c & Fasting Glucose) */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-teal-700" />
                  <span className="font-semibold text-slate-900">Longitudinal Glycemic Progress</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('comparison')}
                  className="text-xs"
                >
                  Full Multi-Date Comparison
                </Button>
              </div>
            }
          >
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Comparison across consecutive reports demonstrates a <strong>sustained downward trajectory</strong> in Hemoglobin A1c and Fasting Blood Glucose following medication optimization.
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">June 12, 2025</div>
                <div className="text-xl font-bold text-amber-800 mt-1 tabular-nums">8.4 %</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ref: 4.0 - 5.6 %</div>
                <div className="text-[10px] font-medium text-amber-700 mt-1">Baseline High</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Oct 18, 2025</div>
                <div className="text-xl font-bold text-amber-700 mt-1 tabular-nums">7.5 %</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ref: 4.0 - 5.6 %</div>
                <div className="text-[10px] font-medium text-teal-700 mt-1">&darr; -0.9% drop</div>
              </div>

              <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-200">
                <div className="text-[11px] text-teal-900 font-medium">Jan 22, 2026 (Latest)</div>
                <div className="text-xl font-bold text-teal-800 mt-1 tabular-nums">6.8 %</div>
                <div className="text-[10px] text-teal-700 mt-0.5">Ref: 4.0 - 5.6 %</div>
                <div className="text-[10px] font-bold text-emerald-700 mt-1">&darr; -1.6% net change</div>
              </div>
            </div>
          </Card>

          {/* Recent Laboratory Out-of-Range Results (With Provenance Links) */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-slate-900">
                  Recent Out-of-Range Analytes Requiring Monitoring
                </span>
                <span className="text-xs text-slate-500">
                  Based strictly on source report reference intervals
                </span>
              </div>
            }
          >
            <div className="divide-y divide-slate-100">
              {anomalies.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => {
                    setSelectedLabResult(lab);
                    setIsAuditDrawerOpen(true);
                  }}
                  className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-slate-50 rounded-md transition-colors cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                        {lab.testName}
                      </span>
                      <span className="text-xs text-slate-400">({lab.category})</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Source: {lab.provenance.sourceDocumentName}</span>
                      <span>•</span>
                      <span>Date: {lab.reportDate}</span>
                      <span>•</span>
                      <span>Ref: {lab.referenceRange?.text || 'None Provided'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div>
                      <div className="text-sm font-bold text-slate-900 tabular-nums">
                        {lab.value} <span className="text-xs font-normal text-slate-500">{lab.unit}</span>
                      </div>
                      <div className="mt-0.5">
                        <RangeStatusBadge status={lab.status} size="sm" />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Uploaded Reports */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-slate-900">Recent Medical Reports</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUploadModalOpen(true)}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Upload New
                </Button>
              </div>
            }
          >
            <div className="divide-y divide-slate-100">
              {latestReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report);
                    setActiveTab('reports');
                  }}
                  className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-slate-50 rounded-md cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 text-teal-700 rounded-lg shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-teal-700">
                        {report.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {report.facility} • Service Date: {report.serviceDate}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                        <span className="bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                          {report.extractedCount.labs} labs
                        </span>
                        <span className="bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                          {report.extractedCount.medications} meds
                        </span>
                        <span className="text-emerald-700 font-medium">
                          Confidence {report.overallConfidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Profile Snapshot, Severe Allergies & Patient Intelligence CTA */}
        <div className="space-y-6">
          {/* Patient-Friendly Intelligence Quick-Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-md">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Information Intelligence</span>
            </div>
            <h3 className="font-bold text-base text-white leading-snug">
              Patient-Friendly Health Synthesis
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Synthesizes verified clinical reports into plain-language summaries with strict 3-way separation between reported facts, extracted metrics, and synthesized explanations.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Strict non-diagnostic model</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('summary')}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold border-none"
              >
                Read Summary &rarr;
              </Button>
            </div>
          </div>

          {/* Active Medication Profile (No Treatment Suggestions!) */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-slate-900">Current Medications</span>
                <span className="text-xs text-slate-500">{activeMedications.length} active</span>
              </div>
            }
          >
            <div className="space-y-3">
              {activeMedications.map((med) => (
                <div key={med.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-900">{med.name}</span>
                    <span className="text-xs font-bold text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded">
                      {med.strength || 'Standard'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">{med.frequency}</div>
                  <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <ProvenanceBadge category={med.provenance.category} size="xs" />
                    <VerificationStatusBadge status={med.verification.status} size="xs" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('medications')}
                className="text-xs text-teal-700 hover:text-teal-900 font-medium"
              >
                Manage medication profile &rarr;
              </button>
            </div>
          </Card>

          {/* Documented Allergies */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-slate-900">Recorded Allergies</span>
                <span className="text-xs text-rose-700 font-medium">{allergies.length} documented</span>
              </div>
            }
          >
            <div className="space-y-2.5">
              {allergies.map((allergy) => (
                <div key={allergy.id} className="p-2.5 rounded border border-rose-100 bg-rose-50/40 text-xs">
                  <div className="flex items-center justify-between font-semibold text-rose-950">
                    <span>{allergy.substance}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.2 bg-rose-200/80 text-rose-900 rounded font-bold">
                      {allergy.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 text-[11px]">{allergy.reaction}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Timeline Highlights */}
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-slate-900">Recent Health Activity</span>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
            }
          >
            <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-2">
              {timelineEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="relative text-xs">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-teal-600 ring-4 ring-white" />
                  <div className="text-[10px] text-slate-400 font-mono">{event.date}</div>
                  <div className="font-semibold text-slate-800 leading-snug mt-0.5">{event.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{event.description}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center justify-center gap-1 mx-auto"
              >
                <span>Explore complete medical timeline</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
