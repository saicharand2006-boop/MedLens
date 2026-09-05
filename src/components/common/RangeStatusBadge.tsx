import React from 'react';
import { RangeStatus } from '../../types/clinical';
import { ArrowUp, ArrowDown, Check, HelpCircle } from 'lucide-react';

export interface RangeStatusBadgeProps {
  status: RangeStatus;
  size?: 'sm' | 'md';
  showIconOnly?: boolean;
}

export const RangeStatusBadge: React.FC<RangeStatusBadgeProps> = ({
  status,
  size = 'sm',
  showIconOnly = false,
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  switch (status) {
    case 'within_range':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md border bg-emerald-50 text-emerald-800 border-emerald-200 ${sizeClasses}`}
          role="status"
          aria-label="Within reported range"
          title="Value is within the reference range provided in the source report"
        >
          <Check className={`${iconSize} text-emerald-600 shrink-0 stroke-[2.5]`} aria-hidden="true" />
          {!showIconOnly && <span>Within reported range</span>}
        </span>
      );

    case 'above_range':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md border bg-amber-50 text-amber-900 border-amber-300 ${sizeClasses}`}
          role="status"
          aria-label="Above reported range"
          title="Value is above the reference range provided in the source report"
        >
          <ArrowUp className={`${iconSize} text-amber-700 shrink-0 stroke-[2.5]`} aria-hidden="true" />
          {!showIconOnly && <span>Above reported range</span>}
        </span>
      );

    case 'below_range':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md border bg-indigo-50 text-indigo-900 border-indigo-200 ${sizeClasses}`}
          role="status"
          aria-label="Below reported range"
          title="Value is below the reference range provided in the source report"
        >
          <ArrowDown className={`${iconSize} text-indigo-700 shrink-0 stroke-[2.5]`} aria-hidden="true" />
          {!showIconOnly && <span>Below reported range</span>}
        </span>
      );

    case 'range_unavailable':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md border bg-slate-100 text-slate-700 border-slate-300 ${sizeClasses}`}
          role="status"
          aria-label="Reference range not provided in source report"
          title="Reference range not provided in source report. Medical status cannot be inferred."
        >
          <HelpCircle className={`${iconSize} text-slate-500 shrink-0`} aria-hidden="true" />
          {!showIconOnly && <span>Reference range not provided</span>}
        </span>
      );
  }
};
