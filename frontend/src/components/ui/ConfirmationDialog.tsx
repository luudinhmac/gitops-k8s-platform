"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { AlertCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 min-h-screen">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 overflow-hidden mx-auto"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-5">
              <div className={cn(
                "p-5 rounded-3xl",
                variant === 'danger' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 
                variant === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' :
                'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'
              )}>
                <AlertCircle size={40} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-2">{message}</p>
              </div>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 mt-10">
              <Button variant="ghost" onClick={onClose} disabled={isLoading} className="w-full py-3 order-2 sm:order-1">
                {cancelLabel}
              </Button>
              <Button variant={variant} onClick={onConfirm} isLoading={isLoading} className="w-full py-3 order-1 sm:order-2 shadow-lg shadow-red-500/20">
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
