'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Layout, 
  Loader2,
  FileText,
  Search
} from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      
      if (!res.ok) throw new Error('Không thể thêm danh mục');
      
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      alert('Lỗi: Danh mục có thể đã tồn tại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này? Các bài viết thuộc danh mục này sẽ trở thành "Chưa phân loại".')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Không thể xóa danh mục');
      fetchCategories();
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa danh mục');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin" 
              className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý danh mục</h1>
              <p className="text-sm text-slate-500">Phân loại bài viết để người đọc dễ dàng tìm kiếm.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Category Form */}
          <div className="md:col-span-1">
             <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-8">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                   <Plus size={16} className="mr-2 text-primary" />
                   Thêm danh mục mới
                </h3>
                <form onSubmit={handleAddCategory} className="space-y-4">
                   <input 
                    type="text" 
                    placeholder="Tên danh mục..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                   />
                   <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
                   >
                     {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Thành phẩm'}
                   </button>
                </form>
             </div>
          </div>

          {/* Categories List */}
          <div className="md:col-span-2">
             <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                   <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                      <Layout size={16} className="mr-2 text-primary" />
                      Danh sách danh mục
                   </h3>
                   <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 uppercase tracking-widest">
                      Tổng: {categories.length}
                   </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                   {loading ? (
                     [...Array(3)].map((_, i) => (
                       <div key={i} className="p-6 animate-pulse flex justify-between">
                          <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-md" />
                          <div className="h-4 w-8 bg-slate-100 dark:bg-slate-800 rounded-md" />
                       </div>
                     ))
                   ) : categories.length === 0 ? (
                     <div className="p-12 text-center text-slate-500 text-sm">
                        Chưa có danh mục nào.
                     </div>
                   ) : categories.map((cat) => (
                     <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <div className="flex items-center space-x-3">
                           <div className="p-2 bg-primary/5 rounded-lg text-primary">
                              <FileText size={16} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                 ID: #{cat.id} • Tạo ngày {new Date(cat.created_at).toLocaleDateString('vi-VN')}
                              </p>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-slate-300 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                           <Trash2 size={18} />
                        </button>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
