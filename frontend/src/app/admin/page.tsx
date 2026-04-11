'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  FileText, Layout, Plus, Settings, Users, Edit, Trash2, Eye,
  Search, Loader2, LogOut, Tag as TagIcon, EyeOff, Home, Menu, X, PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminPost {
  id: number;
  title: string;
  slug: string;
  views: number;
  likes: number;
  created_at: string;
  is_published: boolean;
  author_id: number;
  is_pinned?: boolean;
  Category?: { name: string, slug: string } | null;
  User?: { fullname: string } | null;
  Tag?: { name: string }[];
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
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
      let filtered: AdminPost[] = Array.isArray(postsData) ? postsData : [];
      if (user?.role !== 'admin') {
        filtered = filtered.filter(p => p.author_id === user?.id);
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
    fetchData();
  }, [isAuthenticated, user]);

  const handleDeletePost = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Không thể xóa bài viết');
    }
  };

  const togglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/toggle-publish`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (res.ok) {
        setPosts(posts.map(p => p.id === id ? { ...p, is_published: !currentStatus } : p));
      } else {
        alert('Lỗi khi thay đổi trạng thái bài viết');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.Category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.User?.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Sidebar ── */}
      <AdminSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* ── Main Content ── */}
      <main className="flex-1 w-full lg:ml-64 relative min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
          {/* Header */}
          <header className="hidden md:flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">Quản lý bài viết</h1>
              <p className="text-[13px] text-slate-500">Xem, tạo và chỉnh sửa các bài viết trên Blog.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Tìm bài viết..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] focus:ring-2 focus:ring-primary/20 outline-none w-52 shadow-sm" />
              </div>
              <Link href="/admin/posts/new" className="px-4 py-2 bg-primary text-white rounded-xl text-[13px] font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center">
                <Plus size={16} className="mr-2" />Viết bài
              </Link>
            </div>
          </header>

          {/* ── Mobile Header & Search ── */}
          <div className="md:hidden flex items-center justify-between mb-6">
            <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold">Quản lý</h1>
            <Link href="/admin/posts/new" className="p-2 bg-primary text-white rounded-xl">
              <Plus size={20} />
            </Link>
          </div>
          <div className="md:hidden mb-5">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Tìm bài viết..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none shadow-sm" />
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
            {[
              { label: 'Tổng bài viết', count: posts.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Tổng lượt xem', count: posts.reduce((a, p) => a + (p.views || 0), 0), icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Danh mục', count: categories.length, icon: Layout, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { label: 'Thẻ', count: posts.reduce((a, p) => a + (p.Tag?.length || 0), 0), icon: TagIcon, color: 'text-pink-500', bg: 'bg-pink-500/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:shadow-md">
                <div className={cn("w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                  <stat.icon className={stat.color} size={16} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-none">{stat.count}</h3>
                <p className="text-[11px] font-bold text-slate-500 mt-2 uppercase tracking-tight">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── Posts Table ── */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bài viết</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Danh mục</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Thống kê</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                        Không tìm thấy bài viết nào.
                      </td>
                    </tr>
                  ) : filteredPosts.map((post) => (
                    <tr key={post.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {post.is_pinned && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded uppercase">Highlight</span>}
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[240px] md:max-w-md">{post.title}</h4>
                            </div>
                            <p className="text-[11px] text-slate-500 flex items-center">
                              <span className="font-medium text-slate-400">{post.Category?.name || 'Chưa phân loại'}</span>
                              <span className="mx-2 opacity-50">•</span>
                              <span>{post.User?.fullname || 'Ẩn danh'}</span>
                              <span className="mx-2 opacity-50">•</span>
                              <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden lg:table-cell">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold rounded-lg uppercase">
                          {post.Category?.name || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-slate-500 text-xs">
                            <Eye size={14} className="mr-1.5" />{post.views || 0}
                          </div>
                          <div className="flex items-center text-slate-500 text-xs">
                            <TagIcon size={14} className="mr-1.5" />{post.Tag?.length || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button onClick={() => togglePublish(post.id, post.is_published)} 
                          className={cn("px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all",
                            post.is_published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                          )}>
                          {post.is_published ? 'Đang bật' : 'Đang ẩn'}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1 transition-opacity">
                          <Link 
                            href={`/${post.Category?.slug || 'uncategorized'}/${post.slug}`} 
                            target="_blank" 
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link href={`/admin/posts/edit/${post.id}`} className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/5 rounded-lg transition-all">
                            <Edit size={14} />
                          </Link>
                          <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
