'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, Plus, Trash2, Layout, Loader2, FileText, Search, Menu, Home, LogOut, Users, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function CategoriesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<{ id: number; name: string; created_at?: string; _count?: { Post: number } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newCategory.trim() })
      });
      if (!res.ok) throw new Error();
      setNewCategory('');
      fetchCategories();
    } catch {
      alert('Lỗi: Danh mục có thể đã tồn tại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: editName.trim() })
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      fetchCategories();
    } catch {
      alert('Có lỗi xảy ra khi cập nhật danh mục');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả bài viết thuộc danh mục này sẽ được chuyển về "Chưa phân loại".')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error();
      fetchCategories();
    } catch {
      alert('Có lỗi xảy ra khi xóa danh mục');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 pb-24 lg:pb-0">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
           <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500"><Menu size={22} /></button>
           <span className="font-semibold text-slate-900 dark:text-white">Danh mục</span>
           <div className="w-9" />
        </div>

        <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
          <header className="hidden md:flex flex-col mb-10">
            <div className="flex items-center space-x-2 text-primary mb-2">
              <Layout size={20} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Hệ thống quản trị</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Quản lý danh mục</h1>
            <p className="text-sm text-slate-500 mt-1">Tổ chức các bài viết của bạn theo chủ đề để tối ưu SEO.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
               <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-24">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Plus size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Tạo mới</h3>
                  </div>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tên danh mục</label>
                        <input type="text" placeholder="Ví dụ: Công nghệ, Đời sống..." value={newCategory} onChange={e => setNewCategory(e.target.value)} required
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                     </div>
                     <button type="submit" disabled={submitting} className="w-full py-4 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center">
                        {submitting ? <Loader2 size={20} className="animate-spin" /> : 'Lưu danh mục'}
                     </button>
                  </form>
               </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2">
               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
                  <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Danh sách hiện tại</h3>
                        <span className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold rounded-full text-slate-500 tracking-tight">
                           {categories.length} item
                        </span>
                     </div>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                     {loading ? (
                       [...Array(3)].map((_, i) => (
                         <div key={i} className="p-8 flex items-center space-x-4 animate-pulse">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                            <div className="flex-1 space-y-2">
                               <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                               <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded w-1/4" />
                            </div>
                         </div>
                       ))
                     ) : categories.length === 0 ? (
                        <div className="p-20 text-center">
                           <Layout size={48} className="mx-auto text-slate-200 mb-4" />
                           <p className="text-slate-500 font-medium">Chưa có danh mục nào được tạo.</p>
                        </div>
                     ) : categories.map(cat => (
                        <div key={cat.id} className="p-6 md:p-8 flex items-center justify-between group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                           <div className="flex items-center space-x-4 flex-1 min-w-0">
                              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                                 <FileText size={20} />
                              </div>
                              <div className="flex-grow min-w-0">
                                 {editingId === cat.id ? (
                                   <div className="flex items-center space-x-2 w-full max-w-md animate-in fade-in slide-in-from-left-2 transition-all">
                                      <input 
                                        type="text" 
                                        value={editName} 
                                        onChange={e => setEditName(e.target.value)} 
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                                        className="flex-grow px-4 py-2 bg-white dark:bg-slate-800 border-2 border-primary/50 rounded-xl text-sm outline-none shadow-lg shadow-primary/5"
                                      />
                                      <button onClick={() => handleUpdate(cat.id)} className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95">Lưu</button>
                                      <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all active:scale-95">Hủy</button>
                                   </div>
                                 ) : (
                                   <div className="animate-in fade-in duration-500">
                                      <p className="text-base font-bold text-slate-900 dark:text-white truncate flex items-center group-hover:text-primary transition-colors">
                                        {cat.name} 
                                        <span className="ml-3 px-2 py-0.5 bg-primary/10 text-[9px] text-primary rounded-full font-bold uppercase tracking-tighter">
                                          {cat._count?.Post || 0} bài viết
                                        </span>
                                      </p>
                                      <p className="text-[11px] text-slate-400 font-medium mt-1">
                                        ID: #{cat.id} <span className="mx-2 opacity-30">•</span> {new Date(cat.created_at || '').toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                      </p>
                                   </div>
                                 )}
                              </div>
                           </div>
                           <div className="flex items-center space-x-2 ml-4">
                              {!editingId && (
                                <>
                                  <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} 
                                    className="p-2.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all" title="Sửa">
                                     <Settings size={18} />
                                  </button>
                                  <button onClick={() => handleDelete(cat.id)} 
                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all" title="Xóa">
                                     <Trash2 size={18} />
                                  </button>
                                </>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <Link href="/admin" className="flex flex-col items-center p-2 text-slate-400">
            <Home size={22} /><span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Bài viết</span>
          </Link>
          <Link href="/admin/categories" className="flex flex-col items-center p-2 text-primary">
            <Layout size={22} /><span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Danh mục</span>
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin/users" className="flex flex-col items-center p-2 text-slate-400">
              <Users size={22} /><span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Tác giả</span>
            </Link>
          )}
      </nav>
    </div>
  );
}
