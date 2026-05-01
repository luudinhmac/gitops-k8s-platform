'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, Sun, Moon, LucideIcon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  primaryAction?: {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    href?: string;
    loading?: boolean;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    href?: string;
    loading?: boolean;
    disabled?: boolean;
  };
  sticky?: boolean;
  maxWidth?: string;
}

export default function AdminPageHeader({
  title,
  subtitle,
  showBack = false,
  backHref = '/portal-dashboard',
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  primaryAction,
  secondaryAction,
  sticky = true,
  maxWidth = "1400px"
}: AdminPageHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { setSidebarOpen } = useSidebar();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isStandalone = !pathname.startsWith('/portal-dashboard');
  
  const headerClasses = cn(
    "z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all",
    sticky ? cn(
      "sticky",
      isStandalone ? "top-[68px] md:top-[80px]" : "top-0"
    ) : ""
  );

  const containerClasses = cn(
    "mx-auto px-4 lg:px-6 py-1 grid grid-cols-[1fr_auto_1fr] items-center",
    maxWidth === "1400px" ? "max-w-[1400px]" : "max-w-full"
  );

  return (
    <header className={headerClasses}>
      <div className={containerClasses}>
        {/* Left Section: Back or Menu + Title */}
        <div className="flex items-center space-x-3 md:space-x-4 overflow-hidden min-w-0">
          {showBack ? (
            <Link 
              href={backHref}
              className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all shadow-sm shrink-0"
              title="Quay lại"
            >
              <ArrowLeft size={18} />
            </Link>
          ) : (
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 shrink-0"
            >
              <Menu size={18} />
            </button>
          )}

          <div className="overflow-hidden shrink-0">
            <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
              {title}
            </h1>
          </div>
        </div>

        {/* Center Section: Search (Fixed position and width) */}
        <div className="hidden md:flex justify-center px-4">
          {onSearchChange && (
            <div className="relative w-full max-w-[400px]">
              <label htmlFor="admin-search" className="sr-only">Tìm kiếm</label>
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <DebouncedSearchInput 
                id="admin-search"
                placeholder={searchPlaceholder || "Tìm kiếm..."}
                value={searchQuery || ""}
                onChange={onSearchChange}
              />
            </div>
          )}
        </div>

        {/* Right Section: Theme, Actions */}
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0 justify-self-end">
          {secondaryAction && (
            secondaryAction.href ? (
              <Link 
                href={secondaryAction.href}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center"
              >
                <secondaryAction.icon size={14} className="md:mr-2" />
                <span className="hidden md:inline">{secondaryAction.label}</span>
              </Link>
            ) : (
              <button 
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled || secondaryAction.loading}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center disabled:opacity-50"
              >
                <secondaryAction.icon size={14} className={cn("md:mr-2", secondaryAction.loading && "animate-spin")} />
                <span className="hidden md:inline">{secondaryAction.label}</span>
              </button>
            )
          )}

          {primaryAction && (
            primaryAction.href ? (
              <Link 
                href={primaryAction.href}
                className="px-4 py-2 bg-primary text-white rounded-xl text-[11px] font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center"
              >
                <primaryAction.icon size={14} className="md:mr-2" />
                <span className="hidden md:inline">{primaryAction.label}</span>
              </Link>
            ) : (
              <button 
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled || primaryAction.loading}
                className="px-4 py-2 bg-primary text-white rounded-xl text-[11px] font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center disabled:opacity-50 disabled:translate-y-0"
              >
                <primaryAction.icon size={14} className={cn("md:mr-2", primaryAction.loading && "animate-spin")} />
                <span className="hidden md:inline">{primaryAction.label}</span>
              </button>
            )
          )}

          {mounted && !isStandalone && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-primary transition-all shadow-sm shrink-0"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Search - if needed */}
      {onSearchChange && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <DebouncedSearchInput 
              id="admin-search-mobile"
              placeholder={searchPlaceholder || "Tìm kiếm..."}
              value={searchQuery || ""}
              onChange={onSearchChange}
            />
          </div>
        </div>
      )}
    </header>
  );
}

// Internal Debounced Input Component
function DebouncedSearchInput({ 
  id, 
  placeholder, 
  value, 
  onChange 
}: { 
  id: string; 
  placeholder: string; 
  value: string; 
  onChange: (val: string) => void 
}) {
  const [localValue, setLocalValue] = useState(value);

  // Use a ref to track the last value we notified the parent about
  const lastNotifiedValue = useRef(value);

  // Synchronize local value ONLY if external value changes significantly (e.g. cleared by parent)
  // This prevents focus jumps or stutters while typing
  useEffect(() => {
    if (value !== lastNotifiedValue.current) {
      setLocalValue(value);
      lastNotifiedValue.current = value;
    }
  }, [value]);

  useEffect(() => {
    // Don't trigger if it's the same as what we already notified
    if (localValue === lastNotifiedValue.current) return;

    const handler = setTimeout(() => {
      lastNotifiedValue.current = localValue;
      onChange(localValue);
    }, 500); // Match home page 500ms

    return () => clearTimeout(handler);
  }, [localValue, onChange]);

  return (
    <input 
      id={id}
      name={id}
      type="text" 
      placeholder={placeholder}
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      autoComplete="off"
      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
    />
  );
}

