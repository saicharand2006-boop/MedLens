import React from 'react';
import { FileSearch } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-4 rounded-lg border-2 border-dashed border-slate-200 bg-white/50 ${className}`}>
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-50 text-teal-700 mb-4">
        {icon || <FileSearch className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
