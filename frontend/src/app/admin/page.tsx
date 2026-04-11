'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  FileText, Layout, Plus, Settings, Users, Edit, Trash2, Eye,
  Search, Loader2, LogOut, Tag as TagIcon, EyeOff, Home, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [postsRes, catsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/admin`, { credentials: 'include' }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { credentials: 'include' })
      ]);
      const postsData = await postsRes.json();
      const catsData = await catsRes.json();
      let filtered = Array.isArray(postsData) ? postsData : [];
      if (user?.role !== 'admin') {
        filtered = filtered.filter((p: any) => p.author_id === user?.id);
      }
      setPosts(filtered);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) fetchData();
  }, [authLoading, isAuthenticated]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 size={40} className="animate-spin text-primary" /></div>;
  }
  if (!isAuthenticated) return null;

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error();
      fetchData();
    } catch { alert('Có lỗi xảy ra khi xóa bài viết'); }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/toggle-publish`, { method: 'PATCH', credentials: 'include' });
      if (!res.ok) throw new Error();
      fetchData();
    } catch { alert('Lỗi khi thay đổi trạng thái hiển thị'); }
  };

  const menuItems = [
    { id: 'posts', label: 'Bài viết', icon: FileText, href: '/admin' },
    { id: 'categories', label: 'Danh mục', icon: Layout, href: '/admin/categories' },
    ...(user?.role === 'admin' ? [{ id: 'users', label: 'Người dùng', icon: Users, href: '/admin/users' }] : []),
  ];

  const filteredPosts = posts.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col fixed inset-y-0 shadow-sm z-50">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="text-xl font-display font-bold text-gradient">Portfolio Admin</Link>
        </div>
        <nav className="flex-grow p-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <Link key={item.id} href={item.href}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all">
              <item.icon size={18} /><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <Link href="/admin/settings" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Settings size={18} /><span>Cài đặt</span>
          </Link>
          <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={18} /><span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link href="/" className="text-lg font-display font-bold text-gradient" onClick={() => setSidebarOpen(false)}>Portfolio Admin</Link>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={20} /></button>
            </div>
            <nav className="flex-grow p-4 space-y-1">
              {menuItems.map((item) => (
                <Link key={item.id} href={item.href} onClick={() => setSidebarOpen(false)}
                  className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary transition-all">
                  <item.icon size={18} /><span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <Link href="/profile" onClick={() => setSidebarOpen(false)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
                <Settings size={18} /><span>Hồ sơ</span>
              </Link>
              <button onClick={() => { logout(); setSidebarOpen(false); }} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut size={18} /><span>Đăng xuất</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-grow lg:ml-64 pb-24 lg:pb-0">

        {/* ── Mobile Top Bar ── */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500 hover:text-primary rounded-xl hover:bg-slate-100 transition-all">
            <Menu size={22} />
          </button>
          <span className="font-bold text-slate-800 dark:text-white text-sm">Quản lý bài viết</span>
          <Link href="/admin/posts/new" className="p-2 bg-primary text-white rounded-xl shadow-md shadow-primary/30">
            <Plus size={20} />
          </Link>
        </div>

        <div className="p-4 md:p-8">
          {/* ── Header (desktop) ── */}
          <header className="hidden md:flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Quản lý bài viết</h1>
              <p className="text-sm text-slate-500">Xem, tạo và chỉnh sửa các bài viết trên Blog.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Tìm bài viết..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none w-56 shadow-sm" />
              </div>
              <Link href="/admin/posts/new" className="px-5 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center">
                <Plus size={18} className="mr-2" />Viết bài mới
              </Link>
            </div>
          </header>

          {/* ── Mobile Search ── */}
          <div className="md:hidden mb-5">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Tìm bài viết..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none shadow-sm" />
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-10">
            {[
              { label: 'Tổng bài viết', count: posts.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Tổng lượt xem', count: posts.reduce((a, p) => a + (p.views || 0), 0), icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Danh mục', count: categories.length, icon: Layout, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { label: 'Thẻ', count: posts.reduce((a, p) => a + (p.Tag?.length || 0), 0), icon: TagIcon, color: 'text-pink-500', bg: 'bg-pink-500/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className={cn("w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                  <stat.icon className={stat.color} size={18} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{stat.count}</h3>
                <p className="text-xs md:text-sm font-medium text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── Posts Table (Desktop md+) ── */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Tiêu đề</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Danh mục</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Người viết</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-5"><div className="h-4 w-56 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                        <td className="px-6 py-5"><div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                        <td className="px-6 py-5"><div className="h-4 w-28 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                        <td className="px-6 py-5 text-right"><div className="h-8 w-20 bg-slate-100 dark:bg-slate-800 rounded-lg ml-auto" /></td>
                      </tr>
                    ))
                  ) : filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <FileText size={40} className="mx-auto text-slate-200 dark:text-slate-800 mb-3" />
                        <p className="text-slate-500 font-medium">Chưa có bài viết nào.</p>
                        <Link href="/admin/posts/new" className="mt-3 inline-block text-primary font-bold hover:underline">Viết bài ngay</Link>
                      </td>
                    </tr>
                  ) : filteredPosts.map((post) => (
                    <tr key={post.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/blog/${post.id}`} target="_blank" className="block">
                          <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors flex items-center">
                            {!post.is_published && <EyeOff size={13} className="mr-2 text-slate-400 flex-shrink-0" />}
                            {post.title}
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            {!post.is_published && <span className="text-[10px] text-slate-400 font-bold italic">ĐANG ẨN</span>}
                            {post.is_pinned && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">GHIM</span>}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                          {post.Category?.name || 'Chưa phân loại'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                        <div className="flex flex-col">
                          <span>{post.User?.fullname || 'Admin'}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {(user?.role === 'admin' || post.author_id === user?.id) && (
                            <button title={post.is_published ? 'Ẩn' : 'Hiện'}
                              className={cn("p-2 rounded-lg transition-all", post.is_published ? "text-slate-400 hover:text-blue-500 hover:bg-blue-50" : "text-blue-500 bg-blue-50 hover:bg-blue-100")}
                              onClick={() => handleTogglePublish(post.id)}>
                              <Eye size={17} />
                            </button>
                          )}
                          {post.author_id === user?.id && (
                            <Link href={`/admin/posts/edit/${post.id}`} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                              <Edit size={17} />
                            </Link>
                          )}
                          {(user?.role === 'admin' || post.author_id === user?.id) && (
                            <button className="p-2 text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all" onClick={() => handleDelete(post.id)}>
                              <Trash2 size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Posts Card List (Mobile) ── */}
          <div className="md:hidden space-y-3">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                  <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded mb-3" />
                  <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              ))
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <FileText size={36} className="mx-auto text-slate-200 dark:text-slate-800 mb-3" />
                <p className="text-slate-500 text-sm font-medium">Chưa có bài viết nào.</p>
                <Link href="/admin/posts/new" className="mt-2 inline-block text-primary font-bold text-sm">Viết bài ngay →</Link>
              </div>
            ) : filteredPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4">
                  {/* Title row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
                        {!post.is_published && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded inline-flex items-center"><EyeOff size={10} className="mr-1" />ẨN</span>}
                        {post.is_pinned && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">GHIM</span>}
                      </div>
                      <Link href={`/blog/${post.id}`} target="_blank" className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mb-4">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-500">
                      {post.Category?.name || 'Chưa phân loại'}
                    </span>
                    <span>{post.User?.fullname || 'Admin'}</span>
                    <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    {(user?.role === 'admin' || post.author_id === user?.id) && (
                      <button
                        onClick={() => handleTogglePublish(post.id)}
                        className={cn(
                          "flex-1 flex items-center justify-center py-2 rounded-xl text-xs font-bold transition-all",
                          post.is_published ? "bg-slate-100 dark:bg-slate-800 text-slate-500" : "bg-blue-50 text-blue-600"
                        )}>
                        <Eye size={14} className="mr-1.5" />
                        {post.is_published ? 'Ẩn bài' : 'Hiện bài'}
                      </button>
                    )}
                    {post.author_id === user?.id && (
                      <Link href={`/admin/posts/edit/${post.id}`}
                        className="flex-1 flex items-center justify-center py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold transition-all hover:bg-primary/20">
                        <Edit size={14} className="mr-1.5" />Sửa bài
                      </Link>
                    )}
                    {(user?.role === 'admin' || post.author_id === user?.id) && (
                      <button onClick={() => handleDelete(post.id)}
                        className="flex items-center justify-center w-10 h-9 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl text-xs font-bold transition-all hover:bg-red-100">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 safe-area-inset-bottom">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          <Link href="/" className="flex flex-col items-center px-4 py-1.5 text-slate-400 hover:text-primary transition-colors">
            <Home size={22} /><span className="text-[10px] font-bold mt-0.5">Trang chủ</span>
          </Link>
          {menuItems.map(item => (
            <Link key={item.id} href={item.href} className="flex flex-col items-center px-4 py-1.5 text-slate-400 hover:text-primary transition-colors">
              <item.icon size={22} /><span className="text-[10px] font-bold mt-0.5">{item.label}</span>
            </Link>
          ))}
          <button onClick={logout} className="flex flex-col items-center px-4 py-1.5 text-red-400 hover:text-red-500 transition-colors">
            <LogOut size={22} /><span className="text-[10px] font-bold mt-0.5">Thoát</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
