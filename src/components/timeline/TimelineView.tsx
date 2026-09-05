import React, { useState } from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { ProvenanceBadge } from '../common/Badge';
import { RangeStatusBadge } from '../common/RangeStatusBadge';
import {
  FileText,
  FlaskConical,
  Pill,
  HeartPulse,
  User,
  Search,
} from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { timelineEvents, labResults, setSelectedLabResult, setIsAuditDrawerOpen } = useMedLens();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = timelineEvents.filter(ev => {
    const matchesFilter = filterType === 'all' || ev.type === filterType;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.date.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText className="w-4 h-4 text-teal-700" />;
      case 'lab':
        return <FlaskConical className="w-4 h-4 text-blue-700" />;
      case 'medication':
        return <Pill className="w-4 h-4 text-purple-700" />;
      case 'condition':
        return <HeartPulse className="w-4 h-4 text-rose-700" />;
      default:
        return <User className="w-4 h-4 text-slate-700" />;
    }
  };

  const getEventBorderColor = (type: string) => {
    switch (type) {
      case 'report':
        return 'border-teal-500 bg-teal-50';
      case 'lab':
        return 'border-blue-500 bg-blue-50';
      case 'medication':
        return 'border-purple-500 bg-purple-50';
      case 'condition':
        return 'border-rose-500 bg-rose-50';
      default:
        return 'border-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header filter & search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search timeline by analyte, medication, or date..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'report', 'lab', 'medication', 'condition'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                filterType === type
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type === 'all' ? 'All Events' : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Stream */}
      <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-6">
        {filteredEvents.map((event) => {
          const matchingLab = event.type === 'lab' && event.referenceId
            ? labResults.find(l => l.id === event.referenceId)
            : null;

          return (
            <div
              key={event.id}
              onClick={() => {
                if (matchingLab) {
                  setSelectedLabResult(matchingLab);
                  setIsAuditDrawerOpen(true);
                }
              }}
              className={`relative bg-white rounded-xl border border-slate-200 p-4 shadow-xs transition-all ${
                matchingLab ? 'hover:border-teal-400 hover:shadow cursor-pointer' : ''
              }`}
            >
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-4 w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-xs ${getEventBorderColor(
                  event.type
                )}`}
              >
                {getEventIcon(event.type)}
              </div>

              {/* Event Content Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">{event.date}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {event.type}
                  </span>
                  {matchingLab && (
                    <RangeStatusBadge status={matchingLab.status} size="sm" />
                  )}
                </div>

                <ProvenanceBadge category={event.provenanceCategory} size="xs" />
              </div>

              <h4 className="font-semibold text-slate-900 text-sm">{event.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.description}</p>

              {matchingLab && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-700">
                  <span>Source: {matchingLab.provenance.sourceDocumentName}</span>
                  <span className="font-medium">Click to inspect provenance &rarr;</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
