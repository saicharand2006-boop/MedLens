import React, { useState, useMemo } from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { RangeStatusBadge } from '../common/RangeStatusBadge';
import { VerificationStatusBadge } from '../common/Badge';
import { ConfidenceIndicator } from '../common/ConfidenceIndicator';
import { Button } from '../common/Button';
import { LabResult } from '../../types/clinical';
import {
  Search,
  ExternalLink,
  ClipboardCheck,
} from 'lucide-react';

export const LabResultsView: React.FC = () => {
  const {
    labResults,
    setSelectedLabResult,
    setIsAuditDrawerOpen,
    setIsReviewModalOpen,
    pendingReviewCount,
  } = useMedLens();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');

  // Extract unique categories & dates
  const categories = useMemo(() => {
    return Array.from(new Set(labResults.map(l => l.category)));
  }, [labResults]);

  const dates = useMemo(() => {
    return Array.from(new Set(labResults.map(l => l.reportDate))).sort().reverse();
  }, [labResults]);

  // Filtered dataset
  const filteredLabs = useMemo(() => {
    return labResults.filter(lab => {
      // Search
      const matchesSearch =
        lab.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lab.observation && lab.observation.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCategory = selectedCategory === 'all' || lab.category === selectedCategory;

      // Status
      const matchesStatus = selectedStatus === 'all' || lab.status === selectedStatus;

      // Verification
      const matchesVerification = selectedVerification === 'all' || lab.verification.status === selectedVerification;

      // Date
      const matchesDate = selectedDate === 'all' || lab.reportDate === selectedDate;

      return matchesSearch && matchesCategory && matchesStatus && matchesVerification && matchesDate;
    });
  }, [labResults, searchQuery, selectedCategory, selectedStatus, selectedVerification, selectedDate]);

  const handleRowClick = (lab: LabResult) => {
    setSelectedLabResult(lab);
    setIsAuditDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search & Multifaceted Filtering Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search analytes (e.g. Glucose, A1c, Cholesterol, Creatinine)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {pendingReviewCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReviewModalOpen(true)}
                leftIcon={<ClipboardCheck className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Pending Review ({pendingReviewCount})
              </Button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1 px-2 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Categories ({labResults.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Relative to Reference Range */}
          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Range Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1 px-2 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="within_range">Within reported range</option>
              <option value="above_range">Above reported range</option>
              <option value="below_range">Below reported range</option>
              <option value="range_unavailable">Reference range not provided</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Verification</label>
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="w-full py-1 px-2 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Verification States</option>
              <option value="verified">Verified</option>
              <option value="needs_review">Needs Review</option>
              <option value="edited">Human Edited</option>
              <option value="low_confidence">Low Confidence</option>
            </select>
          </div>

          {/* Report Date */}
          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Report Date</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full py-1 px-2 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Dates</option>
              {dates.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clinical Laboratory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3">Analyte / Test</th>
                <th scope="col" className="px-3 py-3.5">Result</th>
                <th scope="col" className="px-3 py-3.5">Source Reference Range</th>
                <th scope="col" className="px-3 py-3.5">Range Evaluation</th>
                <th scope="col" className="px-3 py-3.5">Date</th>
                <th scope="col" className="px-3 py-3.5">Verification</th>
                <th scope="col" className="px-3 py-3.5">Confidence</th>
                <th scope="col" className="py-3.5 pl-3 pr-4 text-right">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLabs.length > 0 ? (
                filteredLabs.map((lab) => (
                  <tr
                    key={lab.id}
                    onClick={() => handleRowClick(lab)}
                    className="hover:bg-teal-50/40 cursor-pointer transition-colors group"
                  >
                    {/* Test Name & Category */}
                    <td className="py-3 pl-4 pr-3">
                      <div className="font-semibold text-slate-900 group-hover:text-teal-800 transition-colors">
                        {lab.testName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{lab.category}</div>
                    </td>

                    {/* Value & Unit */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="font-bold text-slate-900 tabular-nums text-sm">
                        {lab.value}
                      </span>{' '}
                      <span className="text-slate-500 font-medium">{lab.unit}</span>
                    </td>

                    {/* Source Reference Range */}
                    <td className="px-3 py-3 whitespace-nowrap text-slate-600">
                      {lab.referenceRange?.text || (
                        <span className="text-slate-400 italic">Not provided in report</span>
                      )}
                    </td>

                    {/* Status Relative to Reference Range */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <RangeStatusBadge status={lab.status} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="px-3 py-3 whitespace-nowrap font-mono text-slate-600">
                      {lab.reportDate}
                    </td>

                    {/* Verification Status */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <VerificationStatusBadge status={lab.verification.status} size="xs" />
                    </td>

                    {/* Confidence */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <ConfidenceIndicator confidence={lab.verification.confidence} showBar={false} />
                    </td>

                    {/* Provenance Link */}
                    <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 group-hover:text-teal-900 font-medium">
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-xs italic">
                    No laboratory analytes matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{filteredLabs.length}</strong> of {labResults.length} analytes</span>
          <span className="text-[11px] text-slate-400">
            Click any analyte row to inspect source document snippet and audit history.
          </span>
        </div>
      </div>
    </div>
  );
};
