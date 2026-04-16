'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Layers, Loader2, FileText, Settings
} from 'lucide-react';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';

export default function SeriesAdminPage() {
  const [series, setSeries] = useState<{ id: number; name: string; slug: string; description?: string; created_at: string; _count?: { Post: number } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSeries, setNewSeries] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: '', description: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredSeries = series.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchSeries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/series`);
      const data = await res.json();
      setSeries(Array.isArray(data) ? data : []);
    } catch {
      console.error('Error fetching series');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeries.name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/series`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newSeries)
      });
      if (!res.ok) throw new Error();
      setNewSeries({ name: '', description: '' });
      fetchSeries();
    } catch {
      alert('Lỗi khi tạo series');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editData.name.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/series/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editData)
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      fetchSeries();
    } catch {
      alert('Có lỗi xảy ra khi cập nhật series');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/series/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error();
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      fetchSeries();
    } catch {
      alert('Có lỗi xảy ra khi xóa series');
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className="lg:col-span-1">
           <AdminCard title="Tạo Series" icon={Plus} className="sticky top-24">
              <form onSubmit={handleAddSeries} className="space-y-4">
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
                 <button type="submit" disabled={submitting} className="w-full py-3.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center">
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Lưu Series'}
                 </button>
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
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                 {filteredSeries.length === 0 ? (
                    <div className="p-10 text-center">
                       <Layers size={48} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-slate-500 font-medium">Không tìm thấy series nào.</p>
                    </div>
                 ) : filteredSeries.map(item => (
                    <div key={item.id} className="p-4 md:p-6 flex items-center justify-between group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                       <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                             <Layers size={20} />
                          </div>
                          <div className="flex-grow min-w-0">
                             {editingId === item.id ? (
                                <div className="space-y-3 animate-in fade-in slide-in-from-left-4">
                                   <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} autoFocus
                                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-primary/50 rounded-xl text-sm outline-none shadow-lg" />
                                   <textarea value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})}
                                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border-2 border-primary/50 rounded-xl text-sm outline-none" />
                                   <div className="flex space-x-2">
                                      <button onClick={() => handleUpdate(item.id)} className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-bold">Lưu</button>
                                      <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-[10px] font-bold">Hủy</button>
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
                               <button onClick={() => { setEditingId(item.id); setEditData({ name: item.name, description: item.description || '' }); }} 
                                 className="p-2.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all" title="Sửa">
                                  <Settings size={18} />
                               </button>
                               <button onClick={() => { setDeleteId(item.id); setIsDeleteModalOpen(true); }} 
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
        title="Xóa Series"
        message="Bạn có chắc chắn muốn xóa series này? Các bài viết trong series sẽ không bị xóa nhưng sẽ không còn thuộc series này nữa."
      />
    </>
  );
}
