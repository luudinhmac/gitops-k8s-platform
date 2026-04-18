'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen, isCollapsed } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(`/login?redirect=${pathname}`);
      } else if (user && user.role === 'user') {
        // Only kick regular users out of purely administrative areas
        const forbiddenRoutes = /^\/admin\/(users|categories|series|settings)/;
        if (forbiddenRoutes.test(pathname)) {
          router.push('/?error=unauthorized');
        }
      }
    }
  }, [isAuthenticated, loading, router, user, pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const isForbiddenForUser = user && user.role === 'user' && /^\/admin\/(users|categories|series|settings)/.test(pathname);

  if (loading || !isAuthenticated || isForbiddenForUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
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
