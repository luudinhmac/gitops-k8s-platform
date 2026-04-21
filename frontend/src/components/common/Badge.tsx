import React from 'react';
import { cn } from '@/lib/utils';

type BadgeType = 'role' | 'category' | 'tag';

interface BadgeProps {
  children: React.ReactNode;
  type?: BadgeType;
  variant?: 'superadmin' | 'admin' | 'editor' | 'user' | 'warning' | 'success' | 'info' | 'default';
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  type = 'default', 
  variant = 'default', 
  className,
  size = 'xs'
}) => {
  const baseStyles = "inline-flex items-center font-bold uppercase tracking-widest rounded-md transition-all";
  
  const sizeStyles = {
    xs: "px-1.5 py-0.5 text-[8px]",
    sm: "px-2 py-0.5 text-[9px]",
    md: "px-2.5 py-1 text-[10px]"
  };

  const typeStyles = {
    role: {
      superadmin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500 border border-red-200/50 dark:border-red-800/50",
      admin: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500",
      editor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500",
      user: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      default: "bg-slate-100 text-slate-600"
    },
    category: "bg-primary/10 text-primary border border-primary/5",
    tag: "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors",
    default: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
  };

  const getStyle = () => {
    if (variant === 'warning') return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border border-amber-200/50 dark:border-amber-800/50";
    if (variant === 'success') return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500 border border-emerald-200/50 dark:border-emerald-800/50";
    if (variant === 'info') return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-500 border border-sky-200/50 dark:border-sky-800/50";
    
    if (type === 'role') {
      return typeStyles.role[variant as keyof typeof typeStyles.role] || typeStyles.role.default;
    }
    return typeStyles[type as keyof typeof typeStyles] || typeStyles.default;
  };

  return (
    <span className={cn(baseStyles, sizeStyles[size], getStyle() as string, className)}>
      {children}
    </span>
  );
};

export default Badge;
