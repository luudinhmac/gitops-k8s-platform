'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, ChevronRight, LayoutDashboard, User, LogOut, PenSquare, ChevronDown, Moon, Sun, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from '@/features/notifications/components/NotificationBell';

import UserAvatar from '@/features/users/components/UserAvatar';
import Badge from '@/shared/components/common/Badge';
import ErrorBoundary from '@/shared/components/common/ErrorBoundary';
import { categoryApi } from '@/features/categories/api/category-api';
import { Category } from '@/types';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeMobileSubs, setActiveMobileSubs] = useState<number[]>([]);

  const navItems = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Giới thiệu', href: '/about' },
    { name: 'Khóa học', href: '/courses' },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    categoryApi.getAll()
      .then(data => {
        setCategories(data || []);
      })
      .catch(err => {
        console.error('Failed to fetch categories for navbar:', err);
      });
  }, []);

  const toggleMobileSubmenu = (id: number) => {
    setActiveMobileSubs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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

  // Handle ESC key to close search and focus input when opened
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
        clearTimeout(timer);
      };
    }
  }, [isSearchOpen]);

  if (pathname.startsWith('/portal-dashboard') || pathname === '/maintenance') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div suppressHydrationWarning={true} className="max-w-7xl mx-auto glass md:rounded-b-xl px-6 py-2.5 md:py-3.5 shadow-sm border-b md:border-b md:border-x border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div suppressHydrationWarning={true} className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl md:text-2xl font-display font-bold text-gradient flex-shrink-0">
            Zero2Ops
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors">
              Trang chủ
            </Link>

            {/* Direct Parent Categories in Navbar */}
            {(() => {
              const parentCategories = categories.filter(c => !c.parent_id);
              return parentCategories.map(parent => {
                const children = categories.filter(c => c.parent_id === parent.id);
                const hasChildren = children.length > 0;

                if (hasChildren) {
                  return (
                    <div key={parent.id} className="relative group/category py-2">
                      <Link 
                        href={`/?category=${encodeURIComponent(parent.name)}`}
                        className="flex items-center space-x-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors"
                      >
                        <span>{parent.name}</span>
                        <ChevronDown size={14} className="transition-transform duration-200 group-hover/category:rotate-180" />
                      </Link>

                      {/* Sub-categories Dropdown (opens directly downward) */}
                      <div className="absolute left-0 top-full mt-1 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-800 opacity-0 pointer-events-none group-hover/category:opacity-100 group-hover/category:pointer-events-auto transition-all duration-200 p-2 space-y-0.5 z-[60]">
                        <Link href={`/?category=${encodeURIComponent(parent.name)}`} className="flex items-center w-full px-3 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-all border-b border-slate-100 dark:border-slate-800 mb-1">
                          Tất cả {parent.name}
                        </Link>
                        {children.map(child => (
                          <Link key={child.id} href={`/?category=${encodeURIComponent(child.name)}`} className="flex items-center w-full px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                            <span className="truncate">{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <Link key={parent.id} href={`/?category=${encodeURIComponent(parent.name)}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors">
                      {parent.name}
                    </Link>
                  );
                }
              });
            })()}

            {navItems.slice(1).map((item) => (
              <Link key={item.name} href={item.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors">
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {mounted && (
              <>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 glass rounded-full text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
                  aria-label="Tìm kiếm"
                >
                  <Search size={18} />
                </button>

                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 glass rounded-full text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {isAuthenticated && (
                  <ErrorBoundary featureName="Thông báo" fallback={<div className="p-2 opacity-50"><Bell size={18} /></div>}>
                    <NotificationBell />
                  </ErrorBoundary>
                )}
              </>
            )}

            {!loading && (
              isAuthenticated && user ? (
                /* Avatar Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 px-1.5 py-1 glass rounded-full hover:shadow-md transition-all group cursor-pointer"
                  >
                    <UserAvatar user={user} size="sm" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                      {user.fullname || user.username}
                    </span>
                    <ChevronDown size={14} className={cn("text-slate-400 transition-transform", dropdownOpen && "rotate-180")} />
                  </button>

                  <div className={cn(
                    "absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden transition-all duration-200 origin-top-right z-50",
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

                      <Link href="/write" onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <PenSquare size={16} className="mr-2.5" /> Viết bài mới
                      </Link>

                      {['admin', 'superadmin'].includes(user.role) && (
                        <Link href="/portal-dashboard" onClick={() => setDropdownOpen(false)}
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer"
                  aria-label="Tìm kiếm"
                >
                  <Search size={20} />
                </button>

                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 text-slate-600 dark:text-slate-300"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                {isAuthenticated && (
                  <ErrorBoundary featureName="Thông báo" fallback={<div className="p-2 opacity-50"><Bell size={18} /></div>}>
                    <NotificationBell />
                  </ErrorBoundary>
                )}
              </div>
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
          <Link href="/"
            className="text-lg font-medium text-slate-700 dark:text-slate-200"
            onClick={() => setIsOpen(false)}>
            Trang chủ
          </Link>

          {/* Direct Parent Categories in Mobile Menu */}
          {(() => {
            const parentCategories = categories.filter(c => !c.parent_id);
            return parentCategories.map(parent => {
              const children = categories.filter(c => c.parent_id === parent.id);
              const hasChildren = children.length > 0;

              if (hasChildren) {
                const isSubmenuOpen = activeMobileSubs.includes(parent.id);
                return (
                  <div key={parent.id} className="space-y-1">
                    <button 
                      onClick={() => toggleMobileSubmenu(parent.id)}
                      className="flex items-center justify-between w-full text-lg font-medium text-slate-700 dark:text-slate-200 py-1"
                    >
                      <span>{parent.name}</span>
                      <ChevronDown size={18} className={cn("transition-transform duration-200", isSubmenuOpen && "rotate-180")} />
                    </button>
                    {isSubmenuOpen && (
                      <div className="pl-4 space-y-2.5 pt-1.5 border-l border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-1 duration-150">
                        <Link 
                          href={`/?category=${encodeURIComponent(parent.name)}`}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm font-bold text-primary py-0.5"
                        >
                          Tất cả {parent.name}
                        </Link>
                        {children.map(child => (
                          <Link 
                            key={child.id} 
                            href={`/?category=${encodeURIComponent(child.name)}`}
                            onClick={() => setIsOpen(false)}
                            className="block text-sm font-semibold text-slate-500 dark:text-slate-400 py-0.5"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Link 
                    key={parent.id}
                    href={`/?category=${encodeURIComponent(parent.name)}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-lg font-medium text-slate-700 dark:text-slate-200 py-1"
                  >
                    {parent.name}
                  </Link>
                );
              }
            });
          })()}

          {navItems.slice(1).map((item) => (
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
                <Link href="/write" onClick={() => setIsOpen(false)}
                  className="flex items-center w-full py-3 px-4 rounded-xl bg-primary/10 text-primary font-medium">
                  <PenSquare size={18} className="mr-3" /> Viết bài mới
                </Link>
                {['admin', 'superadmin'].includes(user.role) && (
                  <Link href="/portal-dashboard" onClick={() => setIsOpen(false)}
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

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 min-h-screen">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Search Box Input (Image 2 style) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-slate-200 dark:border-slate-800 p-3 mx-auto z-10"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSearchOpen(false);
                  router.push(`/?q=${encodeURIComponent(searchValue)}`);
                }}
                className="flex items-center gap-3.5 px-4 py-2"
              >
                <Search size={22} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-lg font-medium py-1"
                  autoComplete="off"
                />
                
                {/* Clear / Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (searchValue) {
                      setSearchValue('');
                    } else {
                      setIsSearchOpen(false);
                    }
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all p-1 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-full"
                >
                  <X size={20} className="stroke-[2.5]" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}

