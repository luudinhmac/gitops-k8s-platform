'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  centered?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  centered = false,
  className,
  children
}: PageHeaderProps) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className={cn("flex items-center space-x-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400", centered && "justify-center")}>
          <Link href="/" className="hover:text-primary transition-colors flex items-center">
            <Home size={12} className="mr-1" />
            Home
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight size={10} className="text-slate-300" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-500 truncate max-w-[150px]">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Title Section */}
      <h1 className={cn(
        "font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-4",
        centered ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl md:text-4xl lg:text-5xl"
      )}>
        {title}
      </h1>

      {description && (
        <p className={cn(
          "text-slate-500 max-w-2xl leading-relaxed",
          centered ? "mx-auto text-base" : "text-sm md:text-base"
        )}>
          {description}
        </p>
      )}

      {children && <div className={cn("mt-6", centered && "flex justify-center")}>{children}</div>}
    </div>
  );
}

