'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart3, 
  FileText, 
  Layout, 
  Plus, 
  Settings, 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Loader2,
  LogOut,
  Tag as TagIcon,
  MessageCircle,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
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
      
      let filteredPosts = Array.isArray(postsData) ? postsData : [];
      // Editor chỉ thấy bài của mình
      if (user?.role !== 'admin') {
        filteredPosts = filteredPosts.filter((p: any) => p.author_id === user?.id);
      }
      
      setPosts(filteredPosts);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchData();
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Không thể xóa bài viết');
      
      // Refresh list
      fetchData();
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa bài viết');
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/toggle-publish`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Không thể cập nhật trạng thái hiển thị');
      fetchData();
    } catch (err) {
      alert('Lỗi khi thay đổi trạng thái hiển thị');
    }
  };

  const menuItems = [
    { id: 'posts', label: 'Bài viết', icon: FileText, href: '/admin' },
    { id: 'categories', label: 'Danh mục', icon: Layout, href: '/admin/categories' },
    // Chỉ Admin mới thấy tab Người dùng
    ...(user?.role === 'admin' ? [{ id: 'users', label: 'Người dùng', icon: Users, href: '/admin/users' }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col fixed inset-y-0 shadow-sm z-50">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="text-xl font-display font-bold text-gradient">
            Portfolio Admin
          </Link>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link 
              key={item.id}
              href={item.id === 'categories' ? '/admin/categories' : item.href}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                ((item.id === 'overview' && activeTab === 'overview') || (item.id === 'posts' && activeTab === 'posts')) 
                  ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <Link 
            href="/admin/settings"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings size={18} />
            <span>Cài đặt</span>
          </Link>
          
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Quản lý bài viết</h1>
            <p className="text-sm text-slate-500">Xem, tạo và chỉnh sửa các bài viết trên Blog của bạn.</p>
          </div>

          <div className="flex items-center space-x-4">
             <div className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Tìm bài viết..."
                  className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-64 shadow-sm"
                />
             </div>
             <Link 
              href="/admin/posts/new" 
              className="px-5 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center"
             >
                <Plus size={18} className="mr-2" />
                Viết bài mới
             </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Tổng bài viết', count: posts.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Tổng lượt xem', count: posts.reduce((acc, p) => acc + (p.views || 0), 0), icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Danh mục', count: categories.length, icon: Layout, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { label: 'Thẻ', count: posts.reduce((acc, p) => acc + (p.Tag?.length || 0), 0), icon: TagIcon, color: 'text-pink-500', bg: 'bg-pink-500/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                    <stat.icon className={stat.color} size={22} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.count}</h3>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            ))}
        </div>

        {/* Posts Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Tiêu đề (Xem nội dung)</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Danh mục</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Người viết</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-5"><div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                      <td className="px-8 py-5"><div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                      <td className="px-8 py-5"><div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg" /></td>
                      <td className="px-8 py-5 text-right"><div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-24 text-center">
                       <div className="flex flex-col items-center">
                          <FileText size={48} className="text-slate-200 dark:text-slate-800 mb-4" />
                          <p className="text-slate-500 font-medium">Chưa có bài viết nào được tạo.</p>
                          <Link href="/admin/posts/new" className="mt-4 text-primary font-bold hover:underline">Viết bài ngay</Link>
                       </div>
                    </td>
                  </tr>
                ) : posts.map((post) => (
                  <tr key={post.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-5">
                      <Link href={`/blog/${post.id}`} className="block" target="_blank">
                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors flex items-center">
                          {!post.is_published && <EyeOff size={14} className="mr-2 text-slate-400" />}
                          {post.title}
                        </span>
                        {!post.is_published && <span className="mt-1 block text-[10px] text-slate-400 font-bold italic">ĐANG ẨN (DRAFT)</span>}
                        {post.is_pinned && <span className="mt-1 inline-block px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">GHIM</span>}
                      </Link>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                        {post.Category?.name || 'Chưa phân loại'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-semibold text-slate-500">
                      <div className="flex flex-col">
                        <span>{post.User?.fullname || 'Admin'}</span>
                        <span className="text-[10px] text-slate-400 mt-1">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Ẩn/Hiện: chỉ chủ bài hoặc admin */}
                        {(user?.role === 'admin' || post.author_id === user?.id) && (
                          <button 
                            title={post.is_published ? "Ẩn bài viết" : "Hiện bài viết"}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              post.is_published ? "text-slate-400 hover:text-blue-500 hover:bg-blue-50" : "text-blue-500 bg-blue-50 hover:bg-blue-100"
                            )}
                            onClick={() => handleTogglePublish(post.id)}
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {/* Sửa: chỉ chủ bài mới được sửa */}
                        {post.author_id === user?.id && (
                          <Link 
                            href={`/admin/posts/edit/${post.id}`}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          >
                            <Edit size={18} />
                          </Link>
                        )}
                        {/* Xóa: Admin xóa tất cả, Editor chỉ xóa bài của mình */}
                        {(user?.role === 'admin' || post.author_id === user?.id) && (
                          <button 
                            className="p-2 text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 size={18} />
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
      </main>
    </div>
  );
}
