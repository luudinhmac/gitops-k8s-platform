'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FileText, Plus, Edit, Trash2, Eye,
  Tag as TagIcon, MessageSquare, Heart,
  ChevronUp, ChevronDown, Layout, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';
import AdminCard from '@/features/admin/components/AdminCard';

// Professional Modules
import { postService } from '@/features/posts/services/postService';
import { categoryService } from '@/features/categories/services/categoryService';
import { usePostActions } from '@/hooks/post/usePostActions';
import Button from '@/shared/components/ui/Button';
import IconBadge from '@/shared/components/ui/IconBadge';
import AnimateList from '@/shared/components/ui/AnimateList';
import ConfirmationDialog from '@/shared/components/ui/ConfirmationDialog';
import MessageDialog from '@/shared/components/ui/MessageDialog';
import PromptDialog from '@/shared/components/ui/PromptDialog';
import Skeleton from '@/shared/components/ui/Skeleton';
import { Post as AdminPost } from '@portfolio/contracts';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'interaction'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [msgData, setMsgData] = useState<{ isOpen: boolean; title: string; message: string; variant: 'info' | 'success' | 'warning' | 'error' }>({ 
    isOpen: false, title: '', message: '', variant: 'info' 
  });
  const [promptData, setPromptData] = useState<{ isOpen: boolean; postId: number | null }>({ isOpen: false, postId: null });

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [postsData, catsData] = await Promise.all([
        postService.getAdminPosts({ 
          q: searchQuery, 
          sort: sortBy === 'date' ? 'latest' : sortBy 
        }),
        categoryService.getAll()
      ]);

      setPosts(postsData?.items || []);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, searchQuery, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Modular Logic
  const { deletePost, togglePublish, isActionLoading } = usePostActions(() => fetchData());

  const handleTogglePublish = async (id: number, reason?: string) => {
    try {
      const post = posts.find(p => p.id === id);
      const isBlocking = ['admin', 'superadmin'].includes(user?.role || '') && post?.author_id !== user?.id && !post?.is_blocked;
      
      if (isBlocking && reason === undefined) {
        setPromptData({ isOpen: true, postId: id });
        return;
      }

      await togglePublish(id, reason);
      setPromptData({ isOpen: false, postId: null });
    } catch (err: any) {
      setMsgData({ isOpen: true, title: 'Lỗi thực thi', message: err.message || 'Không thể thay đổi trạng thái bài viết vào lúc này.', variant: 'error' });
    }
  };

  const sortedPosts = posts; // Now handled by backend

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Quản lý bài viết"
        subtitle="Xem, tạo và chỉnh sửa các bài viết trên Blog."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm bài viết..."
        primaryAction={{
          label: "Viết bài",
          icon: Plus,
          href: "/write"
        }}
      />

      <div className="space-y-1">
        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {[
            { label: 'Tổng bài viết', count: posts.length, icon: FileText, color: 'blue' as const },
            { label: 'Tổng lượt xem', count: posts.reduce((a, p) => a + (p.views || 0), 0), icon: Eye, color: 'sky' as const },
            { label: 'Danh mục', count: categories.length, icon: Layout, color: 'cyan' as const },
            { label: 'Thẻ', count: posts.reduce((a, p) => a + (p.Tag?.length || 0), 0), icon: TagIcon, color: 'cyan' as const },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
            >
              <IconBadge icon={stat.icon} color={stat.color} size="md" className="mb-3" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">{stat.count}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Posts Table ── */}
        <AdminCard padding="p-0" title="Danh sách bài viết" icon={FileText}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bài viết</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Danh mục</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">
                    <div className="flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => {
                        if (sortBy === 'interaction') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortBy('interaction'); setSortOrder('desc'); }
                      }}
                    >
                      <span>Thống kê</span>
                      {sortBy === 'interaction' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                    </div>
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <AnimateList component="tbody" className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedPosts.map((post) => (
                  <tr key={post.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {post.is_pinned && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded uppercase">Highlight</span>}
                            <Link
                              href={`/${post.Category?.slug || 'uncategorized'}/${post.slug}`}
                              target="_blank"
                              className="group/title"
                            >
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[240px] md:max-w-md group-hover/title:text-primary transition-colors">
                                {post.title}
                              </h4>
                            </Link>
                          </div>
                          <p className="text-[11px] text-slate-500 flex items-center">
                            <span className="font-medium text-slate-400">{post.Category?.name || 'Chưa phân loại'}</span>
                            <span className="mx-2 opacity-50">•</span>
                            <span>{post.Author?.fullname || 'Ẩn danh'}</span>
                            <span className="mx-2 opacity-50">•</span>
                            <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden lg:table-cell">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold rounded-lg uppercase">
                        {post.Category?.name || 'None'}
                      </span>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-slate-500 text-[11px] font-medium" title="Lượt xem">
                          <IconBadge icon={Eye} color="sky" size="sm" animate={false} className="mr-1.5 bg-transparent p-0 w-auto h-auto opacity-70" />
                          {post.views || 0}
                        </div>
                        <div className="flex items-center text-slate-500 text-[11px] font-medium" title="Bình luận">
                          <IconBadge icon={MessageSquare} color="blue" size="sm" animate={false} className="mr-1.5 bg-transparent p-0 w-auto h-auto opacity-70" />
                          {post._count?.Comment || 0}
                        </div>
                        <div className="flex items-center text-slate-500 text-[11px] font-medium" title="Yêu thích">
                          <IconBadge icon={Heart} color="rose" size="sm" animate={false} className="mr-1.5 bg-transparent p-0 w-auto h-auto opacity-70" />
                          {post.likes || 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {(() => {
                        const isOwn = post.author_id === user?.id;
                        const isPub = !!post.is_published;
                        const isBlk = !!post.is_blocked;

                        if (isBlk) {
                          return (
                            <button onClick={() => handleTogglePublish(post.id)}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-all">
                              Bị chặn
                            </button>
                          );
                        }

                        if (isOwn) {
                          return (
                            <button onClick={() => handleTogglePublish(post.id)}
                              className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                isPub ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              )}>
                              {isPub ? 'Công khai' : 'Bản nháp'}
                            </button>
                          );
                        }

                        // If not own but is published: Admin can click to hide
                        if (isPub && (user?.role === 'admin' || user?.role === 'superadmin')) {
                          return (
                            <button onClick={() => handleTogglePublish(post.id)}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all">
                              Đang hiển thị
                            </button>
                          );
                        }

                        return (
                          <div className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold inline-block cursor-default opacity-80",
                            isBlk ? "bg-red-100 text-red-700" : 
                            (isPub ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")
                          )}>
                            {isBlk ? 'Bị chặn' : (isPub ? 'Đang hiển thị' : 'Bản nháp')}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {post.author_id === user?.id && (
                          <Link href={`/posts/${post.id}/edit`}>
                            <Button variant="outline" size="icon" className="h-8 w-8 hover:border-amber-200">
                              <Edit size={14} className="text-amber-500" />
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:border-red-200"
                          onClick={() => { setDeleteId(post.id); setIsDeleteModalOpen(true); }}
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </AnimateList>
            </table>
          </div>
        </AdminCard>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (deleteId) {
            deletePost(deleteId).then(() => setIsDeleteModalOpen(false));
          }
        }}
        isLoading={isActionLoading}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác và sẽ gỡ bỏ bài viết vĩnh viễn khỏi hệ thống."
      />

      <PromptDialog
        isOpen={promptData.isOpen}
        onClose={() => setPromptData({ isOpen: false, postId: null })}
        onConfirm={(reason) => {
          if (promptData.postId) handleTogglePublish(promptData.postId, reason);
        }}
        title="Lý do chặn bài viết"
        message="Vui lòng nhập lý do (vi phạm quy định, spam...) để tác giả được biết."
        placeholder="Ví dụ: Nội dung vi phạm quy tắc cộng đồng..."
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

