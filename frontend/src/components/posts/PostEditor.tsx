'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Save, Loader2, Image as ImageIcon, Tag, Layout, AlertCircle, ArrowLeft, FileText } from 'lucide-react';
import { slugify } from '@/lib/utils';
import RichEditor from '@/components/admin/RichEditor';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/common/Badge';

// Modular Services
import { postService } from '@/services/postService';
import { categoryService } from '@/services/categoryService';
import { seriesService } from '@/services/seriesService';
import { uploadService } from '@/services/uploadService';

interface Category {
  id: number;
  name: string;
}

interface PostTag {
  name: string;
}

interface PostEditorProps {
  postId?: number;
}

export default function PostEditor({ postId }: PostEditorProps) {
  const isEditMode = !!postId;
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth() as { user: any; loading: boolean; isAuthenticated: boolean };
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [seriesList, setSeriesList] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category_id: '',
    tags: '',
    series_name: '',
    series_order: '0',
    cover_image: '',
    is_pinned: false,
    is_published: true
  });

  // Security check for can_post
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (!user.can_post) {
        setPermissionError('Thông báo không có quyền hoặc bị chặn, vui lòng liên hệ quản trị viên để unlock.');
      }
    }
  }, [authLoading, isAuthenticated, user]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    if (isEditMode) setLoading(true);
    
    try {
      const [cats, seriesData] = await Promise.all([
        categoryService.getAll(),
        seriesService.getAll()
      ]);

      setCategories(Array.isArray(cats) ? cats : []);
      setSeriesList(Array.isArray(seriesData) ? seriesData : []);

      if (isEditMode && postId) {
        const post = await postService.getById(postId);
        
        // Ownership check: only author or admin can edit
        if (post.author_id !== user.id && user.role !== 'admin') {
           setPermissionError('Bạn không có quyền chỉnh sửa bài viết của người khác.');
           return;
        }

        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          content: post.content || '',
          category_id: (post as any).category_id?.toString() || post.Category?.id?.toString() || '',
          tags: post.Tag?.map((t: PostTag) => t.name).join(', ') || '',
          series_name: post.Series?.name || '',
          series_order: post.series_order?.toString() || '0',
          cover_image: post.cover_image || '',
          is_pinned: post.is_pinned || false,
          is_published: post.is_published ?? true
        });
      }
    } catch (err: any) {
      console.error(err);
      setError('Có lỗi xảy ra khi tải dữ liệu bài viết.');
    } finally {
      setLoading(false);
    }
  }, [postId, isEditMode, isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated) {
        fetchData();
    }
  }, [fetchData, isAuthenticated]);

  const handleSubmit = async (publishedState?: boolean) => {
    setSubmitting(true);
    setError(null);

    try {
      let finalSeriesId = null;
      if (formData.series_name) {
        const existing = seriesList.find(s => s.name.toLowerCase() === formData.series_name.toLowerCase());
        if (existing) {
          finalSeriesId = existing.id;
        } else {
          const newS = await seriesService.create(formData.series_name);
          finalSeriesId = newS.id;
        }
      }

      const postData = {
        ...formData,
        is_published: publishedState !== undefined ? publishedState : formData.is_published,
        series_id: finalSeriesId,
        series_order: parseInt(formData.series_order) || 0,
        category_id: formData.category_id ? parseInt(formData.category_id) : null
      };

      if (isEditMode && postId) {
        await postService.update(postId, postData);
      } else {
        await postService.create(postData);
      }

      router.push('/profile?tab=posts');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadService.uploadImage(file, 'post');
      setFormData({ ...formData, cover_image: data.url });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể tải ảnh lên!');
    }
  };

  if (authLoading || (isEditMode && loading)) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 size={40} className="animate-spin text-primary" /></div>;
  }

  if (permissionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Truy cập bị chặn</h2>
            <p className="text-slate-500 mb-6 text-sm">{permissionError}</p>
            <Button component={Link} href="/" variant="outline" className="w-full">Quay lại trang chủ</Button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminPageHeader 
        title={isEditMode ? "Chỉnh sửa bài viết" : "Viết bài mới"}
        subtitle={isEditMode ? `ID: #${postId} • ${formData.title || 'Đang soạn thảo'}` : "Bắt đầu chia sẻ kiến thức của bạn"}
        showBack={true}
        backHref="/profile"
        primaryAction={{
          label: isEditMode ? "Cập nhật bài viết" : "Xuất bản bài viết",
          icon: Save,
          onClick: () => handleSubmit(true),
          loading: submitting,
          disabled: !!error
        }}
        secondaryAction={{
          label: "Lưu bản nháp",
          icon: FileText,
          onClick: () => handleSubmit(false),
          loading: submitting,
          disabled: !!error
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
          <div className="lg:col-span-2 space-y-1">
            {error && <div className="p-4 bg-red-50 text-red-600 border border-red-100 font-bold rounded-2xl text-sm mb-4 animate-in fade-in slide-in-from-top-2">{error}</div>}
            <AdminCard>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tiêu đề bài viết</label>
                  {!formData.is_published && (
                    <Badge variant="warning" className="mb-2 text-[8px] px-2 py-0.5">Bản nháp</Badge>
                  )}
                </div>
                <div className="mb-1">
                  <input 
                    type="text" 
                    placeholder="Nhập tiêu đề..." 
                    value={formData.title} 
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setFormData({ 
                        ...formData, 
                        title: newTitle, 
                        slug: slugify(newTitle) 
                      });
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

          <div className="space-y-1 pb-10">
             <AdminCard title="Cài đặt" icon={Layout} padding="p-5 md:p-6">
                <div className="space-y-1">
                   <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Danh mục</label>
                      <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs appearance-none outline-none focus:ring-2 focus:ring-primary">
                         <option value="">Chọn danh mục</option>
                         {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
                      </select>
                   </div>
                   <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Thẻ (ngăn cách bởi dấu phẩy)</label>
                      <div className="relative">
                        <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="tag1, tag2..." value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Đường dẫn (Slug)</label>
                      <input 
                        type="text" 
                        placeholder="bai-viet-seo..." 
                        value={formData.slug} 
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm" 
                      />
                   </div>
                   <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Series bài viết</label>
                      <input 
                        list="series-options"
                        placeholder="Chọn hoặc nhập mới..."
                        value={formData.series_name}
                        onChange={(e) => setFormData({ ...formData, series_name: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                      />
                      <datalist id="series-options">
                        {seriesList.map(s => ( <option key={s.id} value={s.name} /> ))}
                      </datalist>
                   </div>
                   {formData.series_name && (
                     <div className="animate-in slide-in-from-top-2 duration-300">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Thứ tự trong Series</label>
                        <input type="number" placeholder="0" value={formData.series_order} onChange={(e) => setFormData({ ...formData, series_order: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm" />
                     </div>
                   )}
                   {user?.role === 'admin' && (
                     <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Ghim bài viết</span>
                        <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer" checked={formData.is_pinned} onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })} />
                     </div>
                   )}
                </div>
             </AdminCard>

             <AdminCard title="Ảnh bìa" icon={ImageIcon} padding="p-5 md:p-6">
                <div className="relative aspect-video bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 overflow-hidden group hover:border-primary transition-colors">
                   {formData.cover_image ? (
                     <>
                       <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${formData.cover_image}`} 
                        alt="Post Cover" 
                        className="w-full h-full object-cover" 
                       />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-white text-[10px] font-bold bg-black/30 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl cursor-pointer shadow-lg">Thay đổi ảnh</span>
                       </div>
                     </>
                   ) : (
                     <div className="text-center p-4">
                       <ImageIcon size={24} className="mb-2 mx-auto opacity-50 text-slate-400" />
                       <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-500">Chọn ảnh bìa</span>
                     </div>
                   )}
                   <input
                     type="file"
                     accept="image/*"
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     onChange={handleFileUpload}
                   />
                </div>
             </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}
