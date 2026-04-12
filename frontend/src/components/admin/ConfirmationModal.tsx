'use client';

import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'danger',
  loading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              type === 'danger' ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
            )}>
              <AlertTriangle size={24} />
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X size={20} />
            </button>
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{message}</p>
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "px-6 py-2.5 text-white rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 flex items-center disabled:opacity-50",
              type === 'danger' ? "bg-red-500 shadow-red-500/20 hover:bg-red-600" : "bg-amber-500 shadow-amber-500/20 hover:bg-amber-600"
            )}
          >
            {loading && <Loader2 size={14} className="animate-spin mr-2" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
