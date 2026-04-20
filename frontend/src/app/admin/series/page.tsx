'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Trash2, Layers, Loader2, FileText, Settings
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
import { seriesService } from '@/services/seriesService';

interface SeriesItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  _count?: { Post: number };
}

export default function SeriesAdminPage() {
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSeries, setNewSeries] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: '', description: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [msgData, setMsgData] = useState<{ isOpen: boolean; title: string; message: string; variant: 'info' | 'success' | 'warning' | 'error' }>({ 
    isOpen: false, title: '', message: '', variant: 'error' 
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await seriesService.getAll();
      setSeries(Array.isArray(data) ? data : []);
    } catch {
      console.error('Error fetching series');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSeries = series.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeries.name.trim()) return;
    setSubmitting(true);
    try {
      // Note: Backend might need slug, but we'll let service handle basic slugify 
      // or pass just name if backend ignores slug on create if not provided.
      // Based on previous code, it was sending {name, description}.
      await seriesService.create(newSeries.name.trim()); 
      // If we need to support description in create, we might need to update seriesService.
      // Let's assume create in service only takes name for now based on previous implementation of service,
      // but I should probably update the service to be more flexible.
      setNewSeries({ name: '', description: '' });
      fetchData();
    } catch {
      setMsgData({ isOpen: true, title: 'Lỗi tạo Series', message: 'Không thể tạo series vào lúc này. Vui lòng thử lại sau.', variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editData.name.trim()) return;
    try {
      await seriesService.update(id, editData.name.trim());
      setEditingId(null);
      fetchData();
    } catch {
      setMsgData({ isOpen: true, title: 'Cập nhật thất bại', message: 'Có lỗi xảy ra khi cập nhật thông tin series.', variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await seriesService.delete(deleteId);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      fetchData();
    } catch {
      setMsgData({ isOpen: true, title: 'Lỗi khi xóa', message: 'Có lỗi xảy ra khi tiến hành xóa series này.', variant: 'error' });
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
        title="Quản lý Series"
        subtitle="Nhóm các bài viết lại với nhau để tạo thành một chuỗi kiến thức."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm series..."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
        {/* Form */}
        <div className="lg:col-span-1">
           <AdminCard title="Tạo Series" icon={Plus} className="sticky top-12">
              <form onSubmit={handleAddSeries} className="space-y-1">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tên Series</label>
                    <input type="text" placeholder="Ví dụ: NestJS Cơ bản..." value={newSeries.name} onChange={e => setNewSeries({...newSeries, name: e.target.value})} required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Mô tả (Tùy chọn)</label>
                    <textarea placeholder="Mô tả ngắn gọn về series này..." value={newSeries.description} onChange={e => setNewSeries({...newSeries, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all min-h-[80px]" />
                 </div>
                 <Button type="submit" isLoading={submitting} className="w-full" size="lg">
                    Lưu Series
                 </Button>
              </form>
           </AdminCard>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
           <AdminCard padding="p-0" title="Danh sách hiện tại" icon={FileText} headerAction={
              <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[9px] font-bold rounded-full text-slate-500 tracking-tight">
                 {filteredSeries.length} series
              </span>
           }>
              <AnimateList component="div" className="divide-y divide-slate-100 dark:divide-slate-800">
                 {filteredSeries.length === 0 ? (
                    <div className="p-4 text-center">
                       <Layers size={48} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-slate-500 font-medium">Không tìm thấy series nào.</p>
                    </div>
                 ) : filteredSeries.map(item => (
                    <div key={item.id} className="p-1 flex items-center justify-between group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                       <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <IconBadge icon={Layers} color="cyan" size="md" className="group-hover:scale-110" />
                          <div className="flex-grow min-w-0">
                             {editingId === item.id ? (
                                <div className="space-y-3 animate-in fade-in slide-in-from-left-4">
                                   <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} autoFocus
                                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-primary/50 rounded-xl text-sm outline-none shadow-lg" />
                                   <textarea value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})}
                                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-primary/50 rounded-xl text-sm outline-none" />
                                   <div className="flex space-x-2">
                                      <Button onClick={() => handleUpdate(item.id)} size="sm">Lưu</Button>
                                      <Button variant="ghost" onClick={() => setEditingId(null)} size="sm">Hủy</Button>
                                   </div>
                                </div>
                             ) : (
                                <>
                                   <p className="text-base font-bold text-slate-900 dark:text-white truncate flex items-center group-hover:text-primary transition-colors">
                                     {item.name} 
                                     <span className="ml-3 px-2 py-0.5 bg-primary/10 text-[9px] text-primary rounded-full font-bold uppercase tracking-tighter">
                                       {item._count?.Post || 0} bài viết
                                     </span>
                                   </p>
                                   {item.description && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>}
                                   <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">Slug: {item.slug}</p>
                                </>
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
                                onClick={() => { setEditingId(item.id); setEditData({ name: item.name, description: item.description || '' }); }}
                              >
                                <Settings size={18} className="text-amber-500" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-9 w-9 hover:border-red-200"
                                onClick={() => { setDeleteId(item.id); setIsDeleteModalOpen(true); }}
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
        title="Xóa Series"
        message="Bạn có chắc chắn muốn xóa series này? Các bài viết trong series sẽ không bị xóa nhưng sẽ không còn thuộc series này nữa."
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

