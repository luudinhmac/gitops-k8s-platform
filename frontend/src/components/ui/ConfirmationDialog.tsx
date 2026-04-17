"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { AlertCircle, X } from "lucide-react";
import React from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "success";
  isLoading?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy bỏ",
  variant = "danger",
  isLoading = false,
}: ConfirmationDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className={cn(
                "p-4 rounded-2xl",
                variant === 'danger' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 
                variant === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' :
                'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'
              )}>
                <AlertCircle size={32} />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <Button variant="ghost" onClick={onClose} disabled={isLoading} className="w-full">
                {cancelLabel}
              </Button>
              <Button variant={variant} onClick={onConfirm} isLoading={isLoading} className="w-full">
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Global utility because cn is imported from @/lib/utils but I don't want to break the flow
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
