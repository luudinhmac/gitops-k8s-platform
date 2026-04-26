"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { Info, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonLabel?: string;
  variant?: "info" | "success" | "warning" | "error";
}

export default function MessageDialog({
  isOpen,
  onClose,
  title,
  message,
  buttonLabel = "Đã hiểu",
  variant = "info",
}: MessageDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const getIcon = () => {
    switch (variant) {
      case "success": return <CheckCircle size={40} className="text-emerald-500" />;
      case "warning": return <AlertTriangle size={40} className="text-amber-500" />;
      case "error": return <XCircle size={40} className="text-red-500" />;
      default: return <Info size={40} className="text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (variant) {
      case "success": return "bg-emerald-50 dark:bg-emerald-500/10";
      case "warning": return "bg-amber-50 dark:bg-amber-500/10";
      case "error": return "bg-red-50 dark:bg-red-500/10";
      default: return "bg-blue-50 dark:bg-blue-500/10";
    }
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
            className="relative w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden mx-auto"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-5">
              <div className={`p-5 rounded-3xl ${getBgColor()}`}>
                {getIcon()}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">{message}</p>
              </div>
            </div>

            <div className="mt-10">
              <Button 
                variant={variant === 'error' ? 'danger' : variant === 'info' ? 'primary' : variant as any} 
                onClick={onClose} 
                className="w-full py-4 rounded-2xl shadow-xl"
              >
                {buttonLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

