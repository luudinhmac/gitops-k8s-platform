"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { Info, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

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
  buttonLabel = "OK",
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
      case "success": return <CheckCircle size={44} className="text-emerald-500 dark:text-emerald-400 drop-shadow-[0_2px_10px_rgba(16,185,129,0.5)]" />;
      case "warning": return <AlertTriangle size={44} className="text-amber-500 dark:text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]" />;
      case "error": return <XCircle size={44} className="text-red-500 dark:text-red-400 drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)]" />;
      default: return <Info size={44} className="text-blue-500 dark:text-blue-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.5)]" />;
    }
  };

  const getBgColorClass = () => {
    switch (variant) {
      case "success": return "from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/5 border-emerald-500/20 dark:border-emerald-500/30 shadow-[0_8px_32px_rgba(16,185,129,0.15)]";
      case "warning": return "from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/5 border-amber-500/20 dark:border-amber-500/30 shadow-[0_8px_32px_rgba(245,158,11,0.15)]";
      case "error": return "from-red-500/10 to-red-500/5 dark:from-red-500/20 dark:to-red-500/5 border-red-500/20 dark:border-red-500/30 shadow-[0_8px_32px_rgba(239,68,68,0.15)]";
      default: return "from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/5 border-blue-500/20 dark:border-blue-500/30 shadow-[0_8px_32px_rgba(59,130,246,0.15)]";
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
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[400px] bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-slate-200/80 dark:border-slate-800/80 p-8 overflow-hidden mx-auto"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800/50 p-2 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              {/* Glowing 3D Shield/Ring Wrapper */}
              <div className={cn(
                "relative flex items-center justify-center w-28 h-28 rounded-full border border-white/20 dark:border-slate-700/30 shadow-[0_10px_35px_rgba(0,0,0,0.12),_inset_0_2px_5px_rgba(255,255,255,0.25)] bg-gradient-to-b from-slate-100/50 to-slate-200/30 dark:from-slate-800/50 dark:to-slate-900/30 backdrop-blur-sm mt-4",
                variant === "success" && "shadow-[0_10px_35px_rgba(16,185,129,0.2)]",
                variant === "warning" && "shadow-[0_10px_35px_rgba(245,158,11,0.2)]",
                variant === "error" && "shadow-[0_10px_35px_rgba(239,68,68,0.2)]",
                variant === "info" && "shadow-[0_10px_35px_rgba(59,130,246,0.2)]"
              )}>
                <div className={cn(
                  "absolute inset-2.5 rounded-full flex items-center justify-center border bg-gradient-to-b p-4 shadow-inner",
                  getBgColorClass()
                )}>
                  {getIcon()}
                </div>
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
                className="w-full tracking-wide uppercase shadow-[0_8px_25px_rgba(16,185,129,0.3)] dark:shadow-[0_8px_25px_rgba(16,185,129,0.2)] font-bold border border-white/20"
                size="lg"
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

