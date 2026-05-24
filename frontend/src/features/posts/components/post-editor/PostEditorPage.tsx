'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { slugify } from '@/lib/utils';

// New Modular Components
import EditorHeader from './EditorHeader';
import EditorLayout from './EditorLayout';
import Sidebar from './sidebar/Sidebar';
import SettingsPanel from './sidebar/SettingsPanel';
import CoverImagePanel from './sidebar/CoverImagePanel';
import PublishPanel from './sidebar/PublishPanel';
import SeoPanel from '@/features/posts/seo/components/SeoPanel';

// Core Editor Component
import RichEditor from '@/features/posts/components/RichEditor';
import AdminCard from '@/features/admin/components/AdminCard';
import MessageDialog from '@/shared/components/ui/MessageDialog';

// Services
import { postService } from '@/features/posts/services/postService';
import { categoryService } from '@/features/categories/services/categoryService';
import { seriesService } from '@/features/series/services/seriesService';

interface PostEditorPageProps {
  postId?: number;
}

export default function PostEditorPage({ postId }: PostEditorPageProps) {
  const isEditMode = !!postId;
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth() as { user: any; loading: boolean; isAuthenticated: boolean };
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [seriesList, setSeriesList] = useState<any[]>([]);
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
    is_published: true,
    excerpt: '',
    focus_keyword: '',
    created_at: '',
    updated_at: ''
  });

  // Maintenance & Permission Logic
  useEffect(() => {
    const checkStatus = async () => {
      if (!authLoading && isAuthenticated && user) {
        if (user.can_post === false || user.is_active === false) {
          setPermissionError('Thông báo không có quyền hoặc bị chặn, vui lòng liên hệ quản trị viên để unlock.');
          return;
        }

        if (!['admin', 'superadmin'].includes(user.role)) {
          try {
            const { settingService } = await import('@/features/settings/services/settingService');
            const settings = await settingService.getPublicSettings();
            if (settings.maintenance_posts === 'true') {
              setPermissionError('Tính năng viết bài đang trong quá trình bảo trì. Vui lòng quay lại sau nhé!');
              return;
            }
          } catch (err) { console.error(err); }
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
        seriesService.getMySeries()
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
          tags: post.Tag?.map((t: any) => t.name).join(', ') || '',
          series_name: post.Series?.name || '',
          series_order: post.series_order?.toString() || '0',
          cover_image: post.cover_image || '',
          is_pinned: post.is_pinned || false,
          is_published: post.is_published ?? true,
          excerpt: post.excerpt || '',
          focus_keyword: (post as any).focus_keyword || '',
          created_at: post.created_at || '',
          updated_at: post.updated_at || ''
        });
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu bài viết.');
    } finally {
      setLoading(false);
    }
  }, [postId, isEditMode, isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [fetchData, isAuthenticated]);

  const handleSubmit = async (publishedState?: boolean) => {
    setSubmitting(true);
    setError(null);
    try {
      const { created_at, updated_at, ...dataToSave } = formData;
      const postData = {
        ...dataToSave,
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

      setTimeout(() => {
        router.push('/profile?tab=posts');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (isEditMode && loading)) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950" suppressHydrationWarning={true}><Loader2 size={40} className="animate-spin text-primary" /></div>;
  }

  if (permissionError) {
    return <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">{permissionError}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20" suppressHydrationWarning={true}>
      <EditorHeader 
        title={formData.title}
        isEditMode={isEditMode}
        postId={postId}
        submitting={submitting}
        hasErrors={!!error}
        onSave={handleSubmit}
      />

      <EditorLayout 
        sidebar={
          <Sidebar 
            settingsContent={
              <div className="space-y-8">
                <SettingsPanel 
                  categories={categories}
                  seriesList={seriesList}
                  formData={formData}
                  setFormData={setFormData}
                  userRole={user?.role}
                />
                <CoverImagePanel 
                  coverImage={formData.cover_image}
                  setCoverImage={(url) => setFormData({ ...formData, cover_image: url })}
                  onMessage={(msg) => setMsgData({ ...msg, isOpen: true })}
                />
              </div>
            }
            seoContent={
              <SeoPanel 
                formData={{
                  title: formData.title,
                  slug: formData.slug,
                  content: formData.content,
                  tags: formData.tags
                }}
                focusKeyword={formData.focus_keyword}
                setFocusKeyword={(val: string) => setFormData({ ...formData, focus_keyword: val })}
                metaDescription={formData.excerpt}
                setMetaDescription={(val: string) => setFormData({ ...formData, excerpt: val })}
              />
            }
            publishContent={
              <PublishPanel 
                isPublished={formData.is_published}
                setIsPublished={(val) => setFormData({ ...formData, is_published: val })}
                createdAt={formData.created_at}
                updatedAt={formData.updated_at}
              />
            }
          />
        }
      >
        <AdminCard>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="pe-title" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tiêu đề bài viết</label>
              <input 
                id="pe-title"
                name="pe-title"
                type="text" 
                placeholder="Nhập tiêu đề..." 
                autoFocus
                value={formData.title} 
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setFormData({ ...formData, title: newTitle, slug: slugify(newTitle) });
                }}
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary text-lg font-bold placeholder:text-slate-400 shadow-inner" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="pe-content-editor" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nội dung bài viết</label>
              <RichEditor 
                id="pe-content-editor"
                name="content"
                value={formData.content} 
                onChange={(content) => setFormData({ ...formData, content })} 
              />
            </div>
          </div>
        </AdminCard>
      </EditorLayout>

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
