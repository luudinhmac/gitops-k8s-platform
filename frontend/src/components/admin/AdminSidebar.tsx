'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, Layout, Users, Settings, LogOut, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

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
}

const NavContent = ({ mobile = false, setSidebarOpen, pathname, user, logout }: NavContentProps) => {
  const menuItems = [
    { id: 'posts', label: 'Bài viết', icon: FileText, href: '/admin' },
    { id: 'categories', label: 'Danh mục', icon: Layout, href: '/admin/categories' },
    ...(user?.role === 'admin' ? [{ id: 'users', label: 'Người dùng', icon: Users, href: '/admin/users' }] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin' || pathname.startsWith('/admin/posts');
    return pathname.startsWith(href);
  };

  return (
    <>
      <div className={cn("p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between", mobile && "p-4")}>
        <Link 
          href="/" 
          className={cn("text-lg font-display font-bold text-slate-900 dark:text-white", mobile && "text-base")}
          onClick={() => mobile && setSidebarOpen(false)}
        >
          Portfolio Admin
        </Link>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>
      <nav className="flex-grow p-3 space-y-0.5 mt-2">
        {menuItems.map((item) => (
          <Link 
            key={item.id} 
            href={item.href}
            onClick={() => mobile && setSidebarOpen(false)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
              isActive(item.href) 
                ? "bg-primary/10 text-primary" 
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className={cn("p-3 border-t border-slate-200 dark:border-slate-800 space-y-0.5", mobile && "bg-slate-50 dark:bg-slate-900/50")}>
        <Link 
          href="/admin/settings" 
          onClick={() => mobile && setSidebarOpen(false)}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors",
            pathname === '/admin/settings'
              ? "bg-primary/10 text-primary"
              : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <Settings size={16} />
          <span>Cài đặt</span>
        </Link>
        <button 
          onClick={() => {
            logout();
            if (mobile) setSidebarOpen(false);
          }} 
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </>
  );
};

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col fixed inset-y-0 shadow-sm z-50">
        <NavContent 
          setSidebarOpen={setSidebarOpen} 
          pathname={pathname} 
          user={user} 
          logout={logout} 
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
