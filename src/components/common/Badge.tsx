import React from 'react';
import { ProvenanceCategory, VerificationStatus } from '../../types/clinical';
import { User, FileText, Sparkles, CheckCircle2, Clock, AlertTriangle, Edit3 } from 'lucide-react';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'user' | 'extracted' | 'ai' | 'success' | 'warning' | 'danger' | 'purple' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium rounded',
    sm: 'text-xs px-2 py-0.5 font-medium rounded-md',
    md: 'text-sm px-2.5 py-1 font-medium rounded-md',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border border-slate-200',
    user: 'bg-blue-50 text-blue-800 border border-blue-200',
    extracted: 'bg-teal-50 text-teal-800 border border-teal-200',
    ai: 'bg-purple-50 text-purple-800 border border-purple-200',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200',
    purple: 'bg-violet-50 text-violet-800 border border-violet-200',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 shrink-0 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const ProvenanceBadge: React.FC<{ category: ProvenanceCategory; size?: 'xs' | 'sm' | 'md' }> = ({
  category,
  size = 'sm',
}) => {
  switch (category) {
    case 'user_provided':
      return (
        <Badge variant="user" size={size} icon={<User className="w-3 h-3 text-blue-600" />}>
          User Provided
        </Badge>
      );
    case 'extracted_from_report':
      return (
        <Badge variant="extracted" size={size} icon={<FileText className="w-3 h-3 text-teal-600" />}>
          Extracted from Report
        </Badge>
      );
    case 'ai_generated':
      return (
        <Badge variant="ai" size={size} icon={<Sparkles className="w-3 h-3 text-purple-600" />}>
          AI Generated
        </Badge>
      );
  }
};

export const VerificationStatusBadge: React.FC<{ status: VerificationStatus; size?: 'xs' | 'sm' | 'md' }> = ({
  status,
  size = 'sm',
}) => {
  switch (status) {
    case 'verified':
      return (
        <Badge variant="success" size={size} icon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}>
          Verified
        </Badge>
      );
    case 'needs_review':
      return (
        <Badge variant="warning" size={size} icon={<Clock className="w-3 h-3 text-amber-600" />}>
          Needs Review
        </Badge>
      );
    case 'edited':
      return (
        <Badge variant="default" size={size} icon={<Edit3 className="w-3 h-3 text-slate-600" />}>
          Human Edited
        </Badge>
      );
    case 'low_confidence':
      return (
        <Badge variant="danger" size={size} icon={<AlertTriangle className="w-3 h-3 text-rose-600" />}>
          Low Confidence
        </Badge>
      );
    case 'conflicting':
      return (
        <Badge variant="danger" size={size} icon={<AlertTriangle className="w-3 h-3 text-rose-600" />}>
          Conflicting
        </Badge>
      );
  }
};
