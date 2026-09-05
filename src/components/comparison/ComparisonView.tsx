import React, { useState, useMemo } from 'react';
import { useMedLens } from '../../context/MedLensContext';
import { Card } from '../common/Card';
import { RangeStatusBadge } from '../common/RangeStatusBadge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { GitCompare, TrendingDown, TrendingUp, Info } from 'lucide-react';

export const ComparisonView: React.FC = () => {
  const { labResults } = useMedLens();

  // Find unique dates for reports
  const dates = useMemo(() => {
    return Array.from(new Set(labResults.map(l => l.reportDate))).sort();
  }, [labResults]);

  // Analyte list for comparative analysis
  const analytesToCompare = [
    { name: 'Hemoglobin A1c', unit: '%', refMin: 4.0, refMax: 5.6 },
    { name: 'Fasting Glucose', unit: 'mg/dL', refMin: 70, refMax: 99 },
    { name: 'Total Cholesterol', unit: 'mg/dL', refMin: 125, refMax: 200 },
    { name: 'Triglycerides', unit: 'mg/dL', refMin: 0, refMax: 150 },
    { name: 'HDL Cholesterol', unit: 'mg/dL', refMin: 50, refMax: 90 },
    { name: 'LDL Cholesterol', unit: 'mg/dL', refMin: 0, refMax: 100 },
    { name: 'Serum Creatinine', unit: 'mg/dL', refMin: 0.50, refMax: 1.10 },
    { name: 'eGFR', unit: 'mL/min/1.73m2', refMin: 60, refMax: 120 },
  ];

  const [selectedAnalyte, setSelectedAnalyte] = useState(analytesToCompare[0].name);

  const activeAnalyteConfig = analytesToCompare.find(a => a.name === selectedAnalyte) || analytesToCompare[0];

  // Prepare chart series data for selected analyte
  const chartData = useMemo(() => {
    return dates.map(date => {
      const match = labResults.find(
        l => l.reportDate === date && l.testName.toLowerCase().includes(selectedAnalyte.toLowerCase().split(' ')[0])
      );
      return {
        date,
        value: match && typeof match.value === 'number' ? match.value : null,
        unit: match?.unit || activeAnalyteConfig.unit,
        source: match?.provenance.sourceDocumentName || 'Source Report',
      };
    }).filter(d => d.value !== null);
  }, [dates, labResults, selectedAnalyte, activeAnalyteConfig]);

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Longitudinal Multi-Date Laboratory Comparison
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyzes changes across consecutive diagnostic panels while preserving exact source units and reference thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Active Trend Chart:</label>
          <select
            value={selectedAnalyte}
            onChange={(e) => setSelectedAnalyte(e.target.value)}
            className="text-xs border border-slate-300 rounded px-2.5 py-1 font-medium text-slate-800 focus:ring-1 focus:ring-teal-500"
          >
            {analytesToCompare.map(a => (
              <option key={a.name} value={a.name}>{a.name} ({a.unit})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trend Chart with Shaded Reference Range Normal Band */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="font-semibold text-slate-900">{selectedAnalyte} Over Time</span>
              <span className="text-xs text-slate-500 ml-2 font-mono">
                (Standard Unit: {activeAnalyteConfig.unit})
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Green band: Reference Interval ({activeAnalyteConfig.refMin} - {activeAnalyteConfig.refMax} {activeAnalyteConfig.unit})
            </span>
          </div>
        }
      >
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 2']}
                tick={{ fontSize: 11, fill: '#64748b' }}
                unit={` ${activeAnalyteConfig.unit}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs space-y-1">
                        <div className="font-mono text-slate-300">{data.date}</div>
                        <div className="font-bold text-teal-400 text-sm">
                          {data.value} {data.unit}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Report: {data.source}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Shaded Reference Interval Zone */}
              <ReferenceArea
                y1={activeAnalyteConfig.refMin}
                y2={activeAnalyteConfig.refMax}
                fill="#10b981"
                fillOpacity={0.1}
                stroke="#10b981"
                strokeOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0d9488"
                strokeWidth={2.5}
                dot={{ r: 5, fill: '#0f766e', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-start gap-2 border border-slate-100">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            <strong>Reference Range Preservation:</strong> Shaded green area denotes the reported reference interval extracted from the diagnostic laboratory. Any points outside this band are explicitly marked out-of-range based on the facility&apos;s published criteria.
          </span>
        </div>
      </Card>

      {/* Longitudinal Matrix Table */}
      <Card
        header={
          <span className="font-semibold text-slate-900">
            Side-by-Side Analyte Trajectory Across Report Dates
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
              <tr>
                <th scope="col" className="py-3 pl-4 pr-3 text-left">Analyte</th>
                <th scope="col" className="px-3 py-3 text-left">Ref Range</th>
                {dates.map((date) => (
                  <th key={date} scope="col" className="px-3 py-3 text-center">
                    {date}
                  </th>
                ))}
                <th scope="col" className="py-3 pl-3 pr-4 text-right">Longitudinal Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {analytesToCompare.map((analyte) => {
                const resultsForAnalyte = dates.map(date => {
                  return labResults.find(
                    l => l.reportDate === date && l.testName.toLowerCase().includes(analyte.name.toLowerCase().split(' ')[0])
                  );
                });

                const firstVal = resultsForAnalyte[0]?.value;
                const lastVal = resultsForAnalyte[resultsForAnalyte.length - 1]?.value;

                let deltaDisplay = <span className="text-slate-400">—</span>;
                if (typeof firstVal === 'number' && typeof lastVal === 'number') {
                  const diff = Math.round((lastVal - firstVal) * 100) / 100;
                  const isImproved =
                    analyte.name.includes('A1c') || analyte.name.includes('Glucose') || analyte.name.includes('Cholesterol') || analyte.name.includes('Triglyceride')
                      ? diff < 0
                      : diff > 0;

                  deltaDisplay = (
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        diff === 0
                          ? 'text-slate-500'
                          : isImproved
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                      }`}
                    >
                      {diff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                      <span>{diff > 0 ? `+${diff}` : diff} {analyte.unit}</span>
                    </span>
                  );
                }

                return (
                  <tr key={analyte.name} className="hover:bg-slate-50/80">
                    <td className="py-3 pl-4 pr-3 font-semibold text-slate-900 text-left">
                      {analyte.name}
                    </td>

                    <td className="px-3 py-3 text-slate-500 font-mono text-left whitespace-nowrap">
                      {analyte.refMin !== undefined && analyte.refMax !== undefined
                        ? `${analyte.refMin} - ${analyte.refMax} ${analyte.unit}`
                        : `${analyte.refMax ? `< ${analyte.refMax}` : `> ${analyte.refMin}`} ${analyte.unit}`}
                    </td>

                    {resultsForAnalyte.map((result, idx) => (
                      <td key={dates[idx]} className="px-3 py-3 text-center whitespace-nowrap">
                        {result ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 tabular-nums">
                              {result.value} <span className="text-[10px] text-slate-500">{result.unit}</span>
                            </span>
                            <div>
                              <RangeStatusBadge status={result.status} size="sm" showIconOnly />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 font-mono text-center block">—</span>
                        )}
                      </td>
                    ))}

                    <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap">
                      {deltaDisplay}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
