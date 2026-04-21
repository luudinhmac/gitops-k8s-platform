'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Trash2, Layout, Loader2, FileText, Settings, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import Button from '@/components/ui/Button';
import IconBadge from '@/components/ui/IconBadge';
import AnimateList from '@/components/ui/AnimateList';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import MessageDialog from '@/components/ui/MessageDialog';

// Modular Services
import { categoryService } from '@/services/categoryService';

interface Category {
  id: number;
  name: string;
  created_at?: string;
  _count?: { Post: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [msgData, setMsgData] = useState<{ isOpen: boolean; title: string; message: string; variant: 'info' | 'success' | 'warning' | 'error' }>({ 
    isOpen: false, title: '', message: '', variant: 'error' 
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setSubmitting(true);
    try {
      await categoryService.create(newCategory.trim());
      setNewCategory('');
      fetchData();
    } catch {
      setMsgData({ isOpen: true, title: 'Lỗi hệ thống', message: 'Danh mục này có thể đã tồn tại. Vui lòng thử tên khác.', variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    try {
      await categoryService.update(id, editName.trim());
      setEditingId(null);
      fetchData();
    } catch {
      setMsgData({ isOpen: true, title: 'Cập nhật thất bại', message: 'Có lỗi xảy ra khi cập nhật danh mục. Vui lòng thử lại.', variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await categoryService.delete(deleteId);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      fetchData();
    } catch {
      setMsgData({ isOpen: true, title: 'Lỗi khi xóa', message: 'Có lỗi xảy ra khi xóa danh mục này.', variant: 'error' });
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
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm danh mục..."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
        {/* Form */}
        <div className="lg:col-span-1">
           <AdminCard title="Tạo mới" icon={Plus} className="sticky top-12">
              <form onSubmit={handleAddCategory} className="space-y-1">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tên danh mục</label>
                    <input type="text" placeholder="Ví dụ: Công nghệ, Đời sống..." value={newCategory} onChange={e => setNewCategory(e.target.value)} required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                 </div>
                 <Button type="submit" isLoading={submitting} className="w-full" size="lg">
                    Lưu danh mục
                 </Button>
              </form>
           </AdminCard>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
           <AdminCard padding="p-0" title="Danh sách hiện tại" icon={Layout} headerAction={
              <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[9px] font-bold rounded-full text-slate-500 tracking-tight">
                 {filteredCategories.length} mục
              </span>
           }>
              <AnimateList component="div" className="divide-y divide-slate-100 dark:divide-slate-800">
                 {filteredCategories.length === 0 ? (
                    <div className="p-4 text-center">
                       <Layout size={48} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-slate-500 font-medium">Không tìm thấy danh mục nào.</p>
                    </div>
                 ) : filteredCategories.map(cat => (
                    <div key={cat.id} className="p-1 flex items-center justify-between group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                       <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <IconBadge icon={FileText} color="blue" size="md" className="group-hover:scale-110" />
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
                                  <Button onClick={() => handleUpdate(cat.id)} size="sm">Lưu</Button>
                                  <Button variant="ghost" onClick={() => setEditingId(null)} size="sm">Hủy</Button>
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
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-9 w-9 hover:border-amber-200"
                                onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                              >
                                <Settings size={18} className="text-amber-500" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-9 w-9 hover:border-red-200"
                                onClick={() => { setDeleteId(cat.id); setIsDeleteModalOpen(true); }}
                              >
                                <Trash2 size={18} className="text-red-500" />
                              </Button>
                            </>
                          )}
                       </div>
                    </div>
                 ))}
              </AnimateList>
           </AdminCard>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này? Tất cả bài viết thuộc danh mục này sẽ được chuyển về trạng thái 'Chưa phân loại'."
      />
      
      <MessageDialog 
        isOpen={msgData.isOpen}
        onClose={() => setMsgData({ ...msgData, isOpen: false })}
        title={msgData.title}
        message={msgData.message}
        variant={msgData.variant}
      />
    </>
  );
}

