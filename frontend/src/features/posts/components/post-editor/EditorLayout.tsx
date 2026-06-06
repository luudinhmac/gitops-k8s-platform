'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EditorLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  className?: string;
}

export default function EditorLayout({ children, sidebar, className }: EditorLayoutProps) {
  return (
    <div className={cn("max-w-[1400px] mx-auto px-4 lg:px-6 py-1", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 relative items-start">
        {/* Main Content Area */}
        <main className="lg:col-span-8 space-y-1">
          {children}
        </main>

        {/* Sticky Sidebar Area */}
        <aside className="lg:col-span-4 space-y-1 sticky top-[120px] md:top-[132px] h-fit">
          {sidebar}
        </aside>
      </div>
    </div>
  );
}
