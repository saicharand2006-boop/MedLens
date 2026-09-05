import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 max-w-5xl">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Clinical Information Boundary:</strong> MedLens is an information organization and comprehension platform, <strong>not a medical diagnosis or treatment system</strong>. All extracted metrics and summaries are provided for verification and discussion with licensed medical professionals.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="text-amber-700 hover:text-amber-900 p-0.5 rounded hover:bg-amber-100 transition-colors shrink-0"
        aria-label="Dismiss disclaimer banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
