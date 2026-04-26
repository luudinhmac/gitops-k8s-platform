'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, notFound } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/features/admin/components/AdminSidebar';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen, isCollapsed } = useSidebar();
  const pathname = usePathname();
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || (user && !['admin', 'superadmin'].includes(user.role))) {
        // Stealth mode: Instead of redirect, we'll let the render check trigger notFound()
        console.log('[Security] Unauthorized access to admin, hiding presence.');
      }
    }
  }, [user, loading, isAuthenticated]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || (user && !['admin', 'superadmin'].includes(user.role))) {
    notFound();
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <main className={cn(
        "flex-1 w-full relative min-h-screen transition-all duration-300",
        isCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        <div className="p-1 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}

