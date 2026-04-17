import React from 'react';
import { cn } from '@/lib/utils';

type BadgeType = 'role' | 'category' | 'tag';

interface BadgeProps {
  children: React.ReactNode;
  type?: BadgeType;
  variant?: 'admin' | 'editor' | 'user' | 'default';
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
