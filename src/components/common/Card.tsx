import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  className = '',
  badge,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-shadow hover:shadow ${className}`}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="font-medium text-slate-800 text-sm md:text-base">{header}</div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};
