'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Trash2, Layout, Loader2, FileText, Settings, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminCard from '@/features/admin/components/AdminCard';
import Button from '@/shared/components/ui/Button';
import IconBadge from '@/shared/components/ui/IconBadge';
import AnimateList from '@/shared/components/ui/AnimateList';
import ConfirmationDialog from '@/shared/components/ui/ConfirmationDialog';
import MessageDialog from '@/shared/components/ui/MessageDialog';

// Modular Services
import { categoryService } from '@/features/categories/services/categoryService';

interface Category {
  id: number;
  name: string;
  parent_id?: number | null;
  created_at?: string;
  _count?: { Post: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editParentId, setEditParentId] = useState<string>('');
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

  const getDisplayCategories = () => {
    if (searchQuery.trim()) {
      return categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    const ordered: Category[] = [];
    const parents = categories.filter(c => !c.parent_id);
    parents.forEach(p => {
      ordered.push(p);
      const children = categories.filter(c => c.parent_id === p.id);
      ordered.push(...children);
    });
    categories.forEach(c => {
      if (c.parent_id && !ordered.some(oc => oc.id === c.id)) {
        ordered.push(c);
      }
    });
    return ordered;
  };

  const displayCats = getDisplayCategories();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setSubmitting(true);
    try {
      await categoryService.create(newCategory.trim(), parentCategoryId ? parseInt(parentCategoryId) : null);
      setNewCategory('');
      setParentCategoryId('');
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
      await categoryService.update(id, editName.trim(), editParentId ? parseInt(editParentId) : null);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
           <AdminCard title="Tạo mới" icon={Plus} className="sticky top-12">
              <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                     <label htmlFor="category-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tên danh mục</label>
                     <input id="category-name" name="category_name" type="text" placeholder="Ví dụ: Công nghệ, Đời sống..." value={newCategory} onChange={e => setNewCategory(e.target.value)} required
                       className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                     <label htmlFor="parent-category" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Danh mục cha (Không bắt buộc)</label>
                     <select 
                       id="parent-category" 
                       name="parent_category" 
                       value={parentCategoryId} 
                       onChange={e => setParentCategoryId(e.target.value)}
                       className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all"
                     >
                       <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Làm danh mục chính</option>
                       {categories
                         .filter(cat => !cat.parent_id)
                         .map(cat => (
                           <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{cat.name}</option>
                         ))}
                     </select>
                  </div>
                  <div className="flex justify-end pt-2">
                     <Button type="submit" isLoading={submitting} size="lg" className="min-w-[140px]">
                        Lưu danh mục
                     </Button>
                  </div>
              </form>
           </AdminCard>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
           <AdminCard padding="p-0" title="Danh sách hiện tại" icon={Layout} headerAction={
              <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[9px] font-bold rounded-full text-slate-500 tracking-tight">
                 {displayCats.length} mục
              </span>
           }>
              <AnimateList component="div" className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayCats.length === 0 ? (
                     <div className="p-4 text-center">
                        <Layout size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-500 font-medium">Không tìm thấy danh mục nào.</p>
                     </div>
                  ) : displayCats.map(cat => (
                     <div key={cat.id} className={cn(
                       "p-1.5 flex items-center justify-between group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all",
                       cat.parent_id && !searchQuery && "pl-8 md:pl-12 border-l-2 border-slate-200 dark:border-slate-800 ml-4"
                     )}>
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                           <IconBadge 
                             icon={cat.parent_id ? FileText : Layout} 
                             color={cat.parent_id ? "slate" : "blue"} 
                             size="md" 
                             className="group-hover:scale-110" 
                           />
                           <div className="flex-grow min-w-0">
                              {editingId === cat.id ? (
                                <div className="flex flex-col space-y-3 w-full max-w-md p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl animate-in fade-in slide-in-from-left-2 transition-all">
                                   <div className="space-y-1">
                                      <label htmlFor={`edit-category-${cat.id}`} className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tên danh mục</label>
                                      <input 
                                        id={`edit-category-${cat.id}`}
                                        name="edit_category_name"
                                        type="text" 
                                        value={editName} 
                                        onChange={e => setEditName(e.target.value)} 
                                        autoFocus
                                        onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                      />
                                   </div>
                                   <div className="space-y-1">
                                      <label htmlFor={`edit-parent-${cat.id}`} className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Danh mục cha</label>
                                      <select 
                                        id={`edit-parent-${cat.id}`} 
                                        name="edit_parent_id" 
                                        value={editParentId} 
                                        onChange={e => setEditParentId(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20"
                                      >
                                         <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Làm danh mục chính</option>
                                         {categories
                                           .filter(c => {
                                             if (c.id === cat.id) return false;
                                             if (c.parent_id) return false;
                                             const hasChildren = categories.some(child => child.parent_id === cat.id);
                                             if (hasChildren) return false;
                                             return true;
                                           })
                                           .map(c => (
                                             <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{c.name}</option>
                                           ))}
                                      </select>
                                   </div>
                                   <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                      <Button variant="ghost" onClick={() => setEditingId(null)} size="sm">Hủy</Button>
                                      <Button onClick={() => handleUpdate(cat.id)} size="sm">Lưu</Button>
                                   </div>
                                </div>
                              ) : (
                                <div className="animate-in fade-in duration-500">
                                   <p className="text-base font-bold text-slate-900 dark:text-white truncate flex items-center group-hover:text-primary transition-colors">
                                     {cat.parent_id && !searchQuery && (
                                       <span className="text-slate-400 font-normal mr-2">↳</span>
                                     )}
                                     {cat.name} 
                                     <span className="ml-3 px-2 py-0.5 bg-primary/10 text-[9px] text-primary rounded-full font-bold uppercase tracking-tighter">
                                       {cat._count?.Post || 0} bài viết
                                     </span>
                                     {cat.parent_id && (
                                       <span className="ml-2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[8px] text-slate-500 rounded font-semibold">
                                         Danh mục con
                                       </span>
                                     )}
                                   </p>
                                   <p className="text-[11px] text-slate-400 font-medium mt-1">
                                     ID: #{cat.id} <span className="mx-2 opacity-30">•</span> {new Date(cat.created_at || "").toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}
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
                                 onClick={() => {
                                   setEditingId(cat.id);
                                   setEditName(cat.name);
                                   setEditParentId(cat.parent_id ? cat.parent_id.toString() : "");
                                 }}
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


