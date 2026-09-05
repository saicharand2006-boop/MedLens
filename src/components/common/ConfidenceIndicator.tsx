import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export interface ConfidenceIndicatorProps {
  confidence: number;
  showBar?: boolean;
  size?: 'sm' | 'md';
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  showBar = true,
}) => {
  const isHigh = confidence >= 90;
  const isMedium = confidence >= 80 && confidence < 90;
  const isLow = confidence < 80;

  const colorClass = isHigh
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : isMedium
      ? 'text-amber-700 bg-amber-50 border-amber-200'
      : 'text-rose-700 bg-rose-50 border-rose-200';

  const barColor = isHigh
    ? 'bg-emerald-600'
    : isMedium
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 font-mono text-xs px-1.5 py-0.5 rounded border ${colorClass}`}
        title={`Extraction Confidence: ${confidence}%`}
      >
        {isLow ? (
          <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
        ) : (
          <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
        )}
        <span>{confidence}%</span>
      </span>

      {showBar && (
        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden shrink-0 hidden sm:block">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${Math.min(Math.max(confidence, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
