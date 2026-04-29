'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Save, Loader2, Image as ImageIcon, Tag, Layout, AlertCircle, ArrowLeft, FileText, Check } from 'lucide-react';
import { slugify, cn } from '@/lib/utils';
import RichEditor from '@/features/posts/components/RichEditor';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminCard from '@/features/admin/components/AdminCard';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/common/Badge';
import MessageDialog from '@/shared/components/ui/MessageDialog';

// Modular Services
import { postService } from '@/features/posts/services/postService';
import { categoryService } from '@/features/categories/services/categoryService';
import { seriesService } from '@/features/series/services/seriesService';
import { uploadService } from '@/shared/services/uploadService';

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
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [msgData, setMsgData] = useState<{ isOpen: boolean; title: string; message: string; variant: 'info' | 'success' | 'warning' | 'error' }>({ 
    isOpen: false, title: '', message: '', variant: 'error' 
  });
  
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

  // Security check for can_post & Maintenance
  useEffect(() => {
    const checkStatus = async () => {
      if (!authLoading && isAuthenticated && user) {
        // 1. Check user permissions
        if (user.can_post === false || user.is_active === false) {
          setPermissionError('Thông báo không có quyền hoặc bị chặn, vui lòng liên hệ quản trị viên để unlock.');
          return;
        }

        // 2. Check Maintenance Mode (Only for non-admins)
        if (!['admin', 'superadmin'].includes(user.role)) {
          try {
            const { settingService } = await import('@/features/settings/services/settingService');
            const settings = await settingService.getPublicSettings();
            if (settings.maintenance_posts === 'true') {
              setPermissionError('Tính năng viết bài đang trong quá trình bảo trì. Vui lòng quay lại sau nhé!');
              return;
            }
          } catch (err) {
            console.error('Failed to check maintenance status:', err);
          }
        }
        
        setPermissionError(null);
      }
    };
    checkStatus();
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
      const postData = {
        ...formData,
        is_published: publishedState !== undefined ? publishedState : formData.is_published,
        series_order: parseInt(formData.series_order) || 0,
        category_id: formData.category_id ? parseInt(formData.category_id) : null
      };

      if (isEditMode && postId) {
        await postService.update(postId, postData);
        setStatusMsg({ type: 'success', text: 'Đã cập nhật bài viết thành công!' });
      } else {
        await postService.create(postData);
        setStatusMsg({ type: 'success', text: 'Đã đăng bài viết thành công!' });
      }

      // Short delay to show success message before redirecting
      setTimeout(() => {
        router.push('/profile?tab=posts');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      if (err.response?.status === 403) {
         setPermissionError(err.response?.data?.message || 'Bạn không có quyền thực hiện hành động này.');
      } else {
         setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết');
      }
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
      setMsgData({ 
        isOpen: true, 
        title: 'Lỗi tải ảnh', 
        message: err.response?.data?.message || 'Không thể tải ảnh lên vào lúc này. Vui lòng kiểm tra lại định dạng hoặc kích thước ảnh.', 
        variant: 'error' 
      });
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
            {error && <div className="p-4 bg-red-50 text-red-600 border border-red-100 font-bold rounded-2xl text-sm mb-4 animate-in fade-in slide-in-from-top-2 flex items-center">
              <AlertCircle size={18} className="mr-2 shrink-0" />
              {error}
            </div>}
            
            {statusMsg && (
              <div className={cn(
                "p-4 rounded-2xl text-sm mb-4 animate-in fade-in slide-in-from-top-2 flex items-center font-bold shadow-sm border",
                statusMsg.type === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
              )}>
                {statusMsg.type === 'success' ? <Check size={18} className="mr-2 shrink-0" /> : <AlertCircle size={18} className="mr-2 shrink-0" />}
                {statusMsg.text}
              </div>
            )}
            
            <AdminCard>
                <div className="mb-1 flex items-center justify-between">
                  <label htmlFor="post-title" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tiêu đề bài viết</label>
                  {!formData.is_published && (
                    <Badge variant="warning" className="mb-2 text-[8px] px-2 py-0.5">Bản nháp</Badge>
                  )}
                </div>
                <div className="mb-1">
                  <input 
                    id="post-title"
                    name="title"
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
                  <label htmlFor="post-content-editor" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nội dung bài viết</label>
                  <RichEditor 
                    id="post-content-editor"
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
                      <label htmlFor="post-category" className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Danh mục</label>
                      <select id="post-category" name="category_id" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs appearance-none outline-none focus:ring-2 focus:ring-primary">
                         <option value="">Chọn danh mục</option>
                         {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
                      </select>
                   </div>
                    <div>
                      <label htmlFor="post-tags" className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Thẻ (ngăn cách bởi dấu phẩy)</label>
                      <div className="relative">
                        <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input id="post-tags" name="tags" type="text" placeholder="tag1, tag2..." value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm" />
                      </div>
                   </div>
                    <div>
                      <label htmlFor="post-slug" className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Đường dẫn (Slug)</label>
                      <input 
                        id="post-slug"
                        name="slug"
                        type="text" 
                        placeholder="bai-viet-seo..." 
                        value={formData.slug} 
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm" 
                      />
                   </div>
                    <div>
                      <label htmlFor="post-series" className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Series bài viết</label>
                      <input 
                        id="post-series"
                        name="series_name"
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
                         <label htmlFor="post-series-order" className="block text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 ml-1">Thứ tự trong Series</label>
                         <input id="post-series-order" name="series_order" type="number" placeholder="0" value={formData.series_order} onChange={(e) => setFormData({ ...formData, series_order: e.target.value })}
                           className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm" />
                      </div>
                    )}
                    {['admin', 'superadmin'].includes(user?.role || '') && (
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                         <label htmlFor="post-pinned" className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight cursor-pointer">Ghim bài viết</label>
                         <input id="post-pinned" name="is_pinned" type="checkbox" className="w-4 h-4 accent-primary cursor-pointer" checked={formData.is_pinned} onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })} />
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
                   <label htmlFor="post-cover-upload" className="sr-only">Tải ảnh bìa</label>
                   <input
                     id="post-cover-upload"
                     name="cover_image_file"
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

      <MessageDialog 
        isOpen={msgData.isOpen}
        onClose={() => setMsgData({ ...msgData, isOpen: false })}
        title={msgData.title}
        message={msgData.message}
        variant={msgData.variant}
      />
    </div>
  );
}

