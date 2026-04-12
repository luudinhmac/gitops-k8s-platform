'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText, Layout, Users, Settings, LogOut, X, Layers, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavContentProps {
  mobile?: boolean;
  setSidebarOpen: (open: boolean) => void;
  pathname: string;
  user: {
    id: number;
    fullname: string;
    role: string;
  } | null;
  logout: () => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

const NavContent = ({ mobile = false, setSidebarOpen, pathname, user, logout, isCollapsed = false, setIsCollapsed }: NavContentProps) => {
  const menuItems = [
    { id: 'posts', label: 'Bài viết', icon: FileText, href: '/admin' },
    ...(user?.role === 'admin' || user?.role === 'editor' ? [
      { id: 'categories', label: 'Danh mục', icon: Layout, href: '/admin/categories' },
      { id: 'series', label: 'Series', icon: Layers, href: '/admin/series' }
    ] : []),
    ...(user?.role === 'admin' ? [{ id: 'users', label: 'Người dùng', icon: Users, href: '/admin/users' }] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin' || pathname.startsWith('/admin/posts');
    return pathname.startsWith(href);
  };

  return (
    <>
      <div className={cn("p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between", mobile && "p-4", !mobile && isCollapsed && "px-0 justify-center")}>
        <Link
          href="/"
          className={cn("text-lg font-display font-bold text-slate-900 dark:text-white transition-all", mobile && "text-base", !mobile && isCollapsed && "text-[0px] opacity-0 overflow-hidden w-0")}
          onClick={() => mobile && setSidebarOpen(false)}
        >
          {isCollapsed ? "P" : "Trang chủ"}
        </Link>
        {!mobile && isCollapsed && <div className="text-xl font-bold text-primary">P</div>}
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>
      <nav className={cn("flex-grow p-3 space-y-1 mt-2", isCollapsed && "px-2")}>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            title={isCollapsed ? item.label : undefined}
            onClick={() => mobile && setSidebarOpen(false)}
            className={cn(
              "w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
              isCollapsed ? "justify-center px-0" : "space-x-3",
              isActive(item.href)
                ? "bg-primary/10 text-primary"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <item.icon size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className={cn("p-3 border-t border-slate-200 dark:border-slate-800 space-y-1", mobile && "bg-slate-50 dark:bg-slate-900/50", isCollapsed && "px-2")}>
        {user?.role === 'admin' && (
          <Link
            href="/admin/settings"
            title={isCollapsed ? "Cài đặt" : undefined}
            onClick={() => mobile && setSidebarOpen(false)}
            className={cn(
              "w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold transition-colors",
              isCollapsed ? "justify-center px-0" : "space-x-3",
              pathname === '/admin/settings'
                ? "bg-primary/10 text-primary"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <Settings size={isCollapsed ? 20 : 16} />
            {!isCollapsed && <span>Cài đặt</span>}
          </Link>
        )}
        <button
          onClick={() => {
            logout();
            if (mobile) setSidebarOpen(false);
          }}
          title={isCollapsed ? "Đăng xuất" : undefined}
          className={cn(
            "w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors",
            isCollapsed ? "justify-center px-0" : "space-x-3"
          )}
        >
          <LogOut size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>

        {!mobile && setIsCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2.5 mt-4 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      {/* User Session Info */}
      <div className={cn(
        "p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50",
        isCollapsed && "p-2"
      )}>
        <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center space-x-0")}>
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold overflow-hidden shrink-0">
            {(user as any)?.avatar ? <img src={(user as any).avatar} alt={user?.fullname} className="w-full h-full object-cover" /> : (user?.fullname || 'A')?.[0]?.toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 pr-2">
              <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{user?.fullname}</p>
              <div className="flex items-center mt-0.5">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mr-1.5",
                  user?.role === 'admin' ? "bg-amber-400" : "bg-blue-400"
                )} />
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col fixed inset-y-0 shadow-sm z-50 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <NavContent
          setSidebarOpen={setSidebarOpen}
          pathname={pathname}
          user={user}
          logout={logout}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
            <NavContent
              mobile
              setSidebarOpen={setSidebarOpen}
              pathname={pathname}
              user={user}
              logout={logout}
            />
          </aside>
        </div>
      )}
    </>
  );
}
