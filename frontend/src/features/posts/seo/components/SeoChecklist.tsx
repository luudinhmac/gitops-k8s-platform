'use client';

import { SeoCheck } from '../types';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeoChecklistProps {
  checks: SeoCheck[];
}

export default function SeoChecklist({ checks }: SeoChecklistProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SEO Checklist</h4>
      <div className="space-y-1.5">
        {checks.map((check) => (
          <div 
            key={check.id}
            className="flex items-start p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm group hover:border-primary/20 transition-all"
          >
            <div className="mt-0.5 shrink-0">
              {check.type === 'success' && <CheckCircle2 size={14} className="text-emerald-500" />}
              {check.type === 'warning' && <AlertCircle size={14} className="text-amber-500" />}
              {check.type === 'error' && <XCircle size={14} className="text-red-500" />}
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-none">
                {check.label}
              </p>
              <p className="text-[9px] text-slate-400 mt-1.5 leading-relaxed group-hover:text-slate-500 transition-colors">
                {check.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
