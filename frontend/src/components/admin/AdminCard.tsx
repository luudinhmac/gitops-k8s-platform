'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AdminCardProps {
  children: ReactNode;
  title?: string;
  icon?: LucideIcon;
  description?: string;
  className?: string;
  headerAction?: ReactNode;
  padding?: string;
}

export default function AdminCard({
  children,
  title,
  icon: Icon,
  description,
  className,
  headerAction,
  padding = "p-4 md:p-5"
}: AdminCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all",
      className
    )}>
      {(title || Icon || headerAction) && (
        <div className="px-4 md:px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center">
            {Icon && <Icon size={14} className="mr-2 text-primary" />}
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-none">{title}</h3>
              {description && <p className="text-[10px] text-slate-500 mt-1">{description}</p>}
            </div>
          </div>
          {headerAction && (
            <div className="flex items-center">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className={padding}>
        {children}
      </div>
    </div>
  );
}
