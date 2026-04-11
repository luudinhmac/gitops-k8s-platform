'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Tag, Layout } from 'lucide-react';
import RichEditor from '@/components/admin/RichEditor';
import { cn } from '@/lib/utils';

export default function NewPostPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth() as { user: { role: string; id: number } | null; loading: boolean; isAuthenticated: boolean };
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category_id: '',
    tags: '',
    series: '',
    cover_image: '',
    is_pinned: false
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          series: formData.series.trim() || null,
          category_id: formData.category_id ? parseInt(formData.category_id) : null
        }),
      });

      if (!response.ok) throw new Error('Không thể tạo bài viết');

      router.push('/admin');
      router.refresh();
    } catch (err) {
      alert('Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 size={40} className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 md:pb-0">
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
         <Link href="/admin" className="p-2 text-slate-500"><ArrowLeft size={20} /></Link>
         <span className="font-bold text-slate-800 dark:text-white">Viết bài mới</span>
         <button onClick={handleSubmit} disabled={loading} className="p-2 bg-primary text-white rounded-xl shadow-md">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
         </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all shadow-sm"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Viết bài mới</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Trạng thái: Đang soạn thảo</p>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center">
            {loading ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
            Xuất bản bài viết
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Tiêu đề</label>
                  <input 
                    type="text" 
                    placeholder="Nhập tiêu đề..." 
                    value={formData.title} 
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      // Simple slugify for preview
                      const suggestedSlug = newTitle.toLowerCase()
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
                        .replace(/[đĐ]/g, 'd')
                        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
                        .trim()
                        .replace(/\s+/g, '-');
                      setFormData({ ...formData, title: newTitle, slug: suggestedSlug });
                    }}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary text-lg font-bold" 
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Nội dung bài viết</label>
                  <RichEditor 
                    value={formData.content} 
                    onChange={(content) => setFormData({ ...formData, content })} 
                  />
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 pb-10">
             <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold mb-6 flex items-center"><Layout size={16} className="mr-2 text-primary" /> Cài đặt</h3>
                <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Danh mục</label>
                      <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm appearance-none outline-none">
                         <option value="">Chọn danh mục</option>
                         {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
                      </select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Thẻ (ngăn cách bởi dấu phẩy)</label>
                      <input type="text" placeholder="tag1, tag2..." value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm outline-none" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Đường dẫn (Slug)</label>
                      <input 
                        type="text" 
                        placeholder="bai-viet-seo..." 
                        value={formData.slug} 
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" 
                      />
                      <p className="text-[9px] text-slate-400 mt-1 ml-1 italic">Dùng cho SEO URL: /category/<b>{formData.slug || 'slug'}</b></p>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Series bài viết</label>
                      <input type="text" placeholder="Tên series (v.d: DevOps Guide)" value={formData.series} onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm outline-none" />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Ghim bài viết</span>
                      <input type="checkbox" className="w-5 h-5 accent-primary" checked={formData.is_pinned} onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })} />
                   </div>
                </div>
             </div>
             
             <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold mb-4 flex items-center text-slate-900 dark:text-white"><ImageIcon size={16} className="mr-2 text-primary" /> Ảnh bìa</h3>
                <div className="relative aspect-video bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 overflow-hidden group">
                   {formData.cover_image ? (
                     <>
                       <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${formData.cover_image}`} alt="Cover" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-lg cursor-pointer">Thay đổi ảnh</span>
                       </div>
                     </>
                   ) : (
                     <div className="text-center p-4">
                       <ImageIcon size={24} className="mb-2 mx-auto opacity-50" />
                       <span className="text-[10px] font-bold uppercase tracking-widest block">Chọn ảnh bài viết</span>
                     </div>
                   )}
                   <input
                     type="file"
                     accept="image/*"
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     onChange={async (e) => {
                       const file = e.target.files?.[0];
                       if (!file) return;
                       
                       const form = new FormData();
                       form.append('file', file);
                       
                       try {
                         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
                           method: 'POST',
                           body: form,
                           credentials: 'include'
                         });
                         const data = await res.json();
                         if (res.ok) {
                           setFormData({ ...formData, cover_image: data.url });
                         } else {
                           alert(data.message || 'Lỗi tải ảnh lên');
                         }
                       } catch (err) {
                         alert('Không thể tải ảnh lên!');
                       }
                     }}
                   />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
