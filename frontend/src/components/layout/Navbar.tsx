'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, ChevronRight, LayoutDashboard, User, LogOut, PenSquare, ChevronDown, Moon, Sun, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

import UserAvatar from '@/components/common/UserAvatar';
import Badge from '@/components/common/Badge';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const navItems = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Hồ sơ', href: '/about' },
    { name: 'Khóa học', href: '/about#courses' },
    { name: 'Dự án', href: '/about#projects' },
    { name: 'Giới thiệu', href: '/about#about' },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // Navbar is now permanently fixed at the top
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div suppressHydrationWarning={true} className="max-w-7xl mx-auto glass md:rounded-b-xl px-6 py-2.5 md:py-3.5 shadow-sm border-b md:border-b md:border-x border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div suppressHydrationWarning={true} className="flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-display font-bold text-gradient flex-shrink-0">
            Portfolio
          </Link>

          {/* Search Bar in Navbar */}
          <div suppressHydrationWarning={true} className="hidden lg:flex flex-grow max-w-md mx-8 relative group">
            <div suppressHydrationWarning={true} className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all rounded-full text-sm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/?q=${encodeURIComponent(searchValue)}`);
                }
              }}
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors">
                {item.name}
              </Link>
            ))}

            {mounted && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 glass rounded-full text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            )}

            {!loading && (
              isAuthenticated && user ? (
                /* Avatar Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 px-1.5 py-1 glass rounded-full hover:shadow-md transition-all group"
                  >
                    <UserAvatar user={user} size="sm" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                      {user.fullname || user.username}
                    </span>
                    <ChevronDown size={14} className={cn("text-slate-400 transition-transform", dropdownOpen && "rotate-180")} />
                  </button>

                  <div className={cn(
                    "absolute right-0 top-full mt-2 w-52 glass rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-200 origin-top-right",
                    dropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                  )}>
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullname || user.username}</p>
                    </div>

                    <div className="p-2 space-y-0.5">
                      <Link href="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <User size={16} className="mr-2.5" /> Hồ sơ cá nhân
                      </Link>

                      <Link href="/admin/posts/new" onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <PenSquare size={16} className="mr-2.5" /> Viết bài mới
                      </Link>

                      {user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                          <LayoutDashboard size={16} className="mr-2.5" /> Trang quản trị
                        </Link>
                      )}
                    </div>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                        <LogOut size={16} className="mr-2.5" /> Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href={`/login?redirect=${pathname}`}
                  className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-primary/20 flex items-center group">
                  Đăng nhập
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              )
            )}
          </div>

          {/* Mobile Toggle & Theme */}
          <div className="md:hidden flex items-center space-x-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-slate-600 dark:text-slate-300"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button className="p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute top-24 left-4 right-4 glass rounded-xl p-6 transition-all duration-300 origin-top shadow-2xl",
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}
              className="text-lg font-medium text-slate-700 dark:text-slate-200"
              onClick={() => setIsOpen(false)}>
              {item.name}
            </Link>
          ))}

          {!loading && (
            isAuthenticated && user ? (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center space-x-3 mb-4">
                  <UserAvatar user={user} size="md" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{user.fullname || user.username}</p>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setIsOpen(false)}
                  className="flex items-center w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium">
                  <User size={18} className="mr-3" /> Hồ sơ cá nhân
                </Link>
                <Link href="/admin/posts/new" onClick={() => setIsOpen(false)}
                  className="flex items-center w-full py-3 px-4 rounded-xl bg-primary/10 text-primary font-medium">
                  <PenSquare size={18} className="mr-3" /> Viết bài mới
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setIsOpen(false)}
                    className="flex items-center w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium">
                    <LayoutDashboard size={18} className="mr-3" /> Trang quản trị
                  </Link>
                )}
                <button onClick={() => { logout(); setIsOpen(false); }}
                  className="flex items-center w-full py-3 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 font-medium">
                  <LogOut size={18} className="mr-3" /> Đăng xuất
                </button>
              </div>
            ) : (
              <Link href="/login"
                className="w-full py-4 bg-primary text-white rounded-xl text-center font-medium shadow-lg shadow-primary/20 flex items-center justify-center"
                onClick={() => setIsOpen(false)}>
                Đăng nhập
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
