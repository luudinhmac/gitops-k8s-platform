'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Save, Loader2, Image as ImageIcon, Layout } from 'lucide-react';
import RichEditor from '@/components/admin/RichEditor';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';

interface Category {
  id: number;
  name: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { loading: authLoading, isAuthenticated } = useAuth() as { loading: boolean; isAuthenticated: boolean };
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [seriesList, setSeriesList] = useState<{ id: number; name: string }[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category_id: '',
    tags: '',
    series_name: '',
    series_order: '0',
    cover_image: '',
    is_pinned: false
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catsRes, seriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/series`)
        ]);
        const catsData = await catsRes.json();
        const seriesData = await seriesRes.json();
        setCategories(Array.isArray(catsData) ? catsData : []);
        setSeriesList(Array.isArray(seriesData) ? seriesData : []);
      } catch {
        console.error('Error fetching initial data');
      }
    };
    fetchInitialData();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      let finalSeriesId = null;
      if (formData.series_name) {
        const existing = seriesList.find(s => s.name.toLowerCase() === formData.series_name.toLowerCase());
        if (existing) {
          finalSeriesId = existing.id;
        } else {
          const sRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/series`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: formData.series_name, slug: formData.series_name.toLowerCase().replace(/\s+/g, '-') }),
          });
          if (sRes.ok) {
            const newS = await sRes.json();
            finalSeriesId = newS.id;
          }
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          series_id: finalSeriesId,
          series_order: parseInt(formData.series_order) || 0,
          category_id: formData.category_id ? parseInt(formData.category_id) : null
        }),
      });

      if (!response.ok) throw new Error('Không thể tạo bài viết');

      router.push('/admin');
      router.refresh();
    } catch {
      alert('Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 size={40} className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminPageHeader
        title="Viết bài mới"
        subtitle="Trạng thái: Đang soạn thảo"
        showBack={true}
        backHref="/admin"
        primaryAction={{
          label: "Xuất bản bài viết",
          icon: Save,
          onClick: handleSubmit,
          loading: loading
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <AdminCard>
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tiêu đề</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề..."
                  value={formData.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const suggestedSlug = newTitle.toLowerCase()
                      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                      .replace(/[đĐ]/g, 'd')
                      .replace(/[^a-z0-9\s-]/g, '')
                      .trim()
                      .replace(/\s+/g, '-');
                    setFormData({ ...formData, title: newTitle, slug: suggestedSlug });
                  }}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary text-base font-bold placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nội dung bài viết</label>
                <RichEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </AdminCard>
          </div>

          <div className="space-y-4 pb-10">
            <AdminCard title="Cài đặt" icon={Layout} padding="p-5 md:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Danh mục</label>
                  <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs appearance-none outline-none">
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Thẻ (ngăn cách bởi dấu phẩy)</label>
                  <input type="text" placeholder="tag1, tag2..." value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Đường dẫn (Slug)</label>
                  <input
                    type="text"
                    placeholder="bai-viet-seo..."
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-[8px] text-slate-400 mt-1 ml-1 italic">Dùng cho SEO URL: /category/<b>{formData.slug || 'slug'}</b></p>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Series bài viết (chọn hoặc nhập mới)</label>
                  <input
                    list="series-options"
                    placeholder="Chọn hoặc nhập tên Series mới..."
                    value={formData.series_name}
                    onChange={(e) => setFormData({ ...formData, series_name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none"
                  />
                  <datalist id="series-options">
                    {seriesList.map(s => (<option key={s.id} value={s.name} />))}
                  </datalist>
                  {!seriesList.some(s => s.name.toLowerCase() === formData.series_name.toLowerCase()) && formData.series_name && (
                    <p className="text-[8px] text-primary mt-1 ml-1 font-bold italic">Sẽ tạo Series mới: {formData.series_name}</p>
                  )}
                </div>
                {formData.series_name && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Thứ tự bài trong Series</label>
                    <input type="number" placeholder="0" value={formData.series_order} onChange={(e) => setFormData({ ...formData, series_order: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none" />
                  </div>
                )}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Ghim lên đầu Blog</span>
                  <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer" checked={formData.is_pinned} onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })} />
                </div>
              </div>
            </AdminCard>

            <AdminCard title="Ảnh bìa" icon={ImageIcon} padding="p-5 md:p-6">
              <div className="relative aspect-video bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 overflow-hidden group">
                {formData.cover_image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${formData.cover_image}`} alt="Post Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold bg-black/50 px-3 py-1.5 rounded-lg cursor-pointer">Thay đổi ảnh</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon size={24} className="mb-2 mx-auto opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-500">Chọn ảnh bài viết</span>
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
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload?type=post`, {
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
                    } catch {
                      alert('Không thể tải ảnh lên!');
                    }
                  }}
                />
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}
