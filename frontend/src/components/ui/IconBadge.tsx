"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export type IconColor = "sky" | "blue" | "emerald" | "amber" | "rose" | "cyan" | "indigo" | "slate" | "red";

interface IconBadgeProps {
  icon: LucideIcon;
  color?: IconColor;
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

const IconBadge = ({ icon: Icon, color = "slate", size = "md", className, animate = true }: IconBadgeProps) => {
  const colorStyles = {
    sky: "bg-sky-500/10 text-sky-500",
    blue: "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    rose: "bg-rose-500/10 text-rose-500",
    red: "bg-red-500/10 text-red-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
    cyan: "bg-cyan-500/10 text-cyan-500",
    slate: "bg-slate-500/10 text-slate-500",
  };

  const sizeStyles = {
    sm: "w-7 h-7 p-1.5",
    md: "w-9 h-9 p-2",
    lg: "w-12 h-12 p-3",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const content = (
    <div className={cn("rounded-lg flex items-center justify-center shrink-0 transition-colors", colorStyles[color], sizeStyles[size], className)}>
      <Icon size={iconSizes[size]} className="drop-shadow-sm" />
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }} 
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {content}
    </motion.div>
  );
};

export default IconBadge;
