"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { HelpCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export default function PromptDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  defaultValue = "",
  placeholder = "Nhập nội dung...",
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy bỏ",
  isLoading = false,
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      setValue(defaultValue);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, defaultValue]);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(value);
  };

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
            className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden mx-auto"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                <HelpCircle size={40} />
              </div>
              
              <div className="space-y-2 w-full">
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">{message}</p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-6 mt-2">
                 <div className="relative group">
                    <textarea
                      autoFocus
                      required
                      placeholder={placeholder}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium min-h-[100px] resize-none"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                 </div>

                 <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                    <Button 
                      variant="ghost" 
                      type="button"
                      onClick={onClose} 
                      disabled={isLoading}
                      className="w-full py-4 rounded-2xl order-2 sm:order-1"
                    >
                      {cancelLabel}
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      isLoading={isLoading}
                      className="w-full py-4 rounded-2xl shadow-xl shadow-primary/20 order-1 sm:order-2"
                    >
                      {confirmLabel}
                    </Button>
                 </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

