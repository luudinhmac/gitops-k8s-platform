"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "success" | "danger" | "warning" | "ghost" | "outline" | "secondary";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "as"> {
  variant?: ButtonVariant;
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  component?: React.ElementType | string;
  href?: string | object;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
}

const Button = React.forwardRef<any, ButtonProps>(
  (allProps, ref) => {
    const { 
      component: ComponentProp, 
      className, 
      variant = "primary", 
      size = "md", 
      isLoading, 
      children, 
      disabled, 
      ...props 
    } = allProps;

    const MotionComponent = ComponentProp ? motion.create(ComponentProp as any) : motion.button;

    const variantStyles = {
      primary: "bg-gradient-to-b from-primary/90 via-primary to-primary-hover border border-white/10 dark:border-white/5 shadow-[0_4px_12px_rgba(99,102,241,0.25),_inset_0_1px_1px_rgba(255,255,255,0.3)] ring-4 ring-primary/5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] active:scale-[0.98]",
      secondary: "bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 text-white border border-white/10 dark:border-white/5 shadow-[0_4px_12px_rgba(100,116,139,0.2),_inset_0_1px_1px_rgba(255,255,255,0.3)] ring-4 ring-slate-500/5 hover:shadow-[0_6px_20px_rgba(100,116,139,0.35)] active:scale-[0.98]",
      success: "bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 text-white border border-white/25 dark:border-white/10 shadow-[0_4px_15px_rgba(16,185,129,0.3),_inset_0_1px_1px_rgba(255,255,255,0.4)] ring-4 ring-emerald-500/10 hover:shadow-[0_6px_22px_rgba(16,185,129,0.55)] active:scale-[0.98]",
      danger: "bg-gradient-to-b from-red-400 via-red-500 to-red-600 text-white border border-white/10 dark:border-white/5 shadow-[0_4px_12px_rgba(239,68,68,0.25),_inset_0_1px_1px_rgba(255,255,255,0.3)] ring-4 ring-red-500/5 hover:shadow-[0_6px_20px_rgba(239,68,68,0.45)] active:scale-[0.98]",
      warning: "bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-white border border-white/10 dark:border-white/5 shadow-[0_4px_12px_rgba(245,158,11,0.25),_inset_0_1px_1px_rgba(255,255,255,0.3)] ring-4 ring-amber-500/5 hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] active:scale-[0.98]",
      ghost: "bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
      outline: "bg-transparent border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors",
    };

    const sizeStyles = {
      xs: "px-3 py-1 text-[10px] rounded-full",
      sm: "px-4 py-1.5 text-xs rounded-full",
      md: "px-6 py-2.5 text-sm rounded-full",
      lg: "px-8 py-3.5 text-base rounded-full",
      icon: "p-2.5 rounded-full",
    };

    const domProps = { ...props };
    delete (domProps as any).as;
    delete (domProps as any).component;
    delete (domProps as any).variant;
    delete (domProps as any).size;
    delete (domProps as any).isLoading;

    return (
      <MotionComponent
        ref={ref}
        whileHover={!disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...domProps}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && children}
      </MotionComponent>
    );
  }
);

Button.displayName = "Button";

export default Button;

