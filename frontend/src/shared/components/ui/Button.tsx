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
      primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90",
      secondary: "bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600",
      success: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600",
      danger: "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600",
      warning: "bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600",
      ghost: "bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800",
      outline: "bg-transparent border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5",
    };

    const sizeStyles = {
      xs: "px-2 py-1 text-[10px] rounded-lg",
      sm: "px-3 py-1.5 text-xs rounded-lg",
      md: "px-5 py-2.5 text-sm rounded-xl",
      lg: "px-8 py-4 text-base rounded-2xl",
      icon: "p-2.5 rounded-xl",
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

