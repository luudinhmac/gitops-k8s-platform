'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, Plus, Trash2, Layout, Loader2, FileText, Search, Menu, Home, LogOut, Users, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { useSidebar } from '@/context/SidebarContext';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';

export default function CategoriesPage() {
  const { user, isAuthenticated } = useAuth();
  const { setSidebarOpen } = useSidebar();
  const [categories, setCategories] = useState<{ id: number; name: string; created_at?: string; _count?: { Post: number } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error();
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      fetchCategories();
    } catch {
      alert('Có lỗi xảy ra khi xóa danh mục');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader 
        title="Quản lý danh mục"
        subtitle="Quản lý các danh mục bài viết trên hệ thống."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
           <AdminCard title="Tạo mới" icon={Plus} padding="p-5 md:p-6" className="sticky top-24">
              <form onSubmit={handleAddCategory} className="space-y-4">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tên danh mục</label>
                    <input type="text" placeholder="Ví dụ: Công nghệ, Đời sống..." value={newCategory} onChange={e => setNewCategory(e.target.value)} required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                 </div>
                 <button type="submit" disabled={submitting} className="w-full py-3.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center">
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Lưu danh mục'}
                 </button>
              </form>
           </AdminCard>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
           <AdminCard padding="p-0" title="Danh sách hiện tại" icon={Layout} headerAction={
              <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[9px] font-bold rounded-full text-slate-500 tracking-tight">
                 {categories.length} mục
              </span>
           }>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                 {categories.length === 0 ? (
                    <div className="p-10 text-center">
                       <Layout size={48} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-slate-500 font-medium">Chưa có danh mục nào được tạo.</p>
                    </div>
                 ) : categories.map(cat => (
                    <div key={cat.id} className="p-6 md:p-8 flex items-center justify-between group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                       <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
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
                              <button onClick={() => { setDeleteId(cat.id); setIsDeleteModalOpen(true); }} 
                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all" title="Xóa">
                                 <Trash2 size={18} />
                              </button>
                            </>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </AdminCard>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này? Tất cả bài viết thuộc danh mục này sẽ được chuyển về trạng thái 'Chưa phân loại'."
      />
    </>
  );
}
