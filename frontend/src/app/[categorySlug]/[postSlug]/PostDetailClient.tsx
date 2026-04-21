'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar, User as UserIcon, Clock, Share2,
  MessageSquare, Heart, Eye,
  ChevronRight, Layers, ChevronLeft, Search, Trash2, Edit2, Check, X, Tag as TagIcon,
  Facebook, Twitter, Linkedin, Link2, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { sanitizeHTML } from '@/lib/sanitizer';
import UserAvatar from '@/components/common/UserAvatar';
import Navbar from '@/components/layout/Navbar';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Badge from '@/components/common/Badge';
import FormattedDate from '@/components/common/FormattedDate';
import Button from '@/components/ui/Button';
import IconBadge from '@/components/ui/IconBadge';
import AnimateList from '@/components/ui/AnimateList';
import MessageDialog from '@/components/ui/MessageDialog';

// Modular Services
import { postService } from '@/services/postService';
import { commentService } from '@/services/commentService';
import { categoryService as catApi } from '@/services/categoryService';
import { seriesService } from '@/services/seriesService';

import { Post, Comment as CommentType } from '@/types/post';

const buildCommentTree = (comments: CommentType[]) => {
  const map = new Map<number, CommentType>();
  const roots: CommentType[] = [];

  comments.forEach(c => {
    map.set(c.id, { ...c, Replies: [] });
  });

  comments.forEach(c => {
    const node = map.get(c.id);
    if (!node) return;
    if (c.parent_id) {
      const parent = map.get(c.parent_id);
      if (parent) {
        parent.Replies!.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export default function PostDetailClient({ params }: { params: { categorySlug: string, postSlug: string } }) {
  const { categorySlug, postSlug } = params;
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string; _count?: { Post: number } }[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [seriesPosts, setSeriesPosts] = useState<Post[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [activeHash, setActiveHash] = useState<string>('');
  const [isMaintenanceComments, setIsMaintenanceComments] = useState(false);
  const [msgData, setMsgData] = useState<{ isOpen: boolean; title: string; message: string; variant: 'info' | 'success' | 'warning' | 'error' }>({ 
    isOpen: false, title: '', message: '', variant: 'info' 
  });
  const router = useRouter();

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const { settingsService } = await import('@/services/settingsService');
        const settings = await settingsService.getPublicSettings();
        if (settings.maintenance_comments === 'true' && user?.role !== 'admin') {
          setIsMaintenanceComments(true);
        }
      } catch (err) {
        console.error('Failed to check maintenance status:', err);
      }
    };
    checkMaintenance();
  }, [user]);

  useEffect(() => {
    const handleHashChange = () => setActiveHash(window.location.hash);
    handleHashChange(); // Initial check
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to comment if hash changes
  useEffect(() => {
    if (activeHash && activeHash.startsWith('#comment-')) {
      const id = activeHash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300); // Small delay to ensure content is fully rendered
      }
    }
  }, [activeHash, loading]);

  const fetchPostData = useCallback(async () => {
    try {
      const data = await postService.getBySlug(postSlug);

      // Safety check for category
      if (data.Category?.slug !== categorySlug && categorySlug !== 'uncategorized') {
        console.warn('Category slug mismatch');
      }

      setPost(data);

      // Check like status if authenticated
      if (isAuthenticated) {
        const status = await postService.getLikeStatus(data.id);
        setLiked(status.liked);
      }

      // Background view increment
      setTimeout(() => {
        postService.incrementView(data.id);
      }, 60000);

    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [postSlug, categorySlug, isAuthenticated]);

  const fetchSupplementaryData = useCallback(async () => {
    try {
      const [cats, related] = await Promise.all([
        catApi.getAll(),
        postService.getAll({ limit: 5 })
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setRelatedPosts(Array.isArray(related) ? related : []);
    } catch (err) {
      console.error('Sidebar error:', err);
    }
  }, []);

  useEffect(() => {
    fetchPostData();
    fetchSupplementaryData();
  }, [fetchPostData, fetchSupplementaryData]);

  useEffect(() => {
    if (post?.series_id && post.Series?.slug) {
      seriesService.getBySlug(post.Series.slug)
        .then(data => setSeriesPosts(data.Post || []))
        .catch(err => console.error('Series error:', err));
    }
  }, [post?.series_id, post?.Series?.slug]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setMsgData({ isOpen: true, title: 'Yêu cầu đăng nhập', message: 'Vui lòng đăng nhập để có thể tương tác và thích bài viết này nhé!', variant: 'warning' });
      return;
    }
    if (!post) return;

    try {
      const data = await postService.toggleLike(post.id);
      setLiked(data.liked);
      setPost({ ...post, likes: data.liked ? post.likes + 1 : post.likes - 1 });
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;

    setIsSubmitting(true);
    try {
      const newCommentRaw = await commentService.create({
        content: commentText,
        post_id: post.id,
        parent_id: replyingTo,
        user_id: user?.id || null,
        author_name: isAuthenticated ? (user?.fullname || user?.username || 'Thành viên') : 'Khách',
        author_email: user?.email || null
      });

      const formattedComment: CommentType = {
        id: newCommentRaw.id,
        content: newCommentRaw.content,
        author_name: newCommentRaw.author_name,
        author_email: newCommentRaw.author_email,
        created_at: newCommentRaw.created_at,
        user_id: newCommentRaw.user_id,
        parent_id: newCommentRaw.parent_id,
        User: user?.avatar ? { avatar: user.avatar } : null
      };

      setPost({ ...post, Comment: [formattedComment, ...(post.Comment || [])] });
      setCommentText('');
      setReplyingTo(null);
      setCommentError(null);
    } catch (error: any) {
      setCommentError(error.response?.data?.message || 'Có lỗi xảy ra khi thực hiện bình luận.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      await commentService.delete(id);
      if (post) {
        setPost({
          ...post,
          Comment: (post.Comment || []).filter(c => c.id !== id)
        });
      }
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Delete comment error:', error);
    }
  };

  const handleUpdateComment = async (id: number) => {
    if (!editingText.trim() || !post) return;
    try {
      await commentService.update(id, editingText);
      setPost({
        ...post,
        Comment: (post.Comment || []).map(c => c.id === id ? { ...c, content: editingText } : c)
      });
      setEditingCommentId(null);
      setEditingText('');
    } catch (error) {
      console.error('Update comment error:', error);
    }
  };

  if (loading) {
    return (
      <div className="pt-40 pb-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
          <div className="h-64 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          <div className="space-y-4">
            <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
            <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-40 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bài viết không tồn tại</h2>
        <Link href="/" className="text-primary hover:underline mt-4 inline-block">Quay lại trang chính</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 px-4 min-h-screen text-slate-900 dark:text-slate-100 bg-slate-50/30 dark:bg-slate-950/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-1">
          {/* Main Content */}
          <div className="lg:w-9/12 w-full min-w-0">
            {/* Breadcrumbs Inline */}
            <nav className="flex items-center space-x-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
               <Link href="/" className="hover:text-primary transition-colors flex items-center">Kiến thức</Link>
               < ChevronRight size={10} className="text-slate-300" />
               <span className="text-slate-500 truncate">{post.Category?.name || 'Chưa phân loại'}</span>
            </nav>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-2 max-w-4xl">
              {post.title}
            </h1>

            {/* Horizontal Metabar Row */}
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1 py-1 border-y border-slate-100 dark:border-slate-800/50">
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/author/${post.User?.id || 1}`} className="flex items-center text-primary font-bold uppercase tracking-widest text-[9px] hover:text-primary/80 transition-all">
                  <UserAvatar user={post.User} size="xs" className="mr-2" />
                  {post.User?.fullname || post.User?.username || 'Ẩn danh'}
                </Link>
                <div className="w-px h-3 bg-slate-200 dark:bg-slate-800" />
                {post.Category && (
                  <Link href={`/?q=${encodeURIComponent(post.Category.name)}`} className="hover:opacity-80 transition-opacity">
                    <Badge type="category" size="xs">
                      {post.Category.name}
                    </Badge>
                  </Link>
                )}
                {post.Tag && post.Tag.slice(0, 2).map((tag, i) => (
                  <Link key={i} href={`/?q=${encodeURIComponent(tag.name)}`} className="hover:opacity-80 transition-opacity">
                    <Badge type="tag" size="xs">
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
                <div className="w-px h-3 bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-4 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                  <FormattedDate date={post.created_at} showIcon iconSize={10} />
                  <div className="flex items-center">
                    <Clock size={10} className="mr-1.5" />
                    {post.readTime || 5} PHÚT ĐỌC
                  </div>
                  <div className="flex items-center text-primary/70">
                    <Eye size={10} className="mr-1.5" />
                    {post.views || 0} LƯỢT XEM
                  </div>
                </div>
              </div>

              {/* Social Actions - Compact Bar */}
              <div className="flex items-center border border-slate-100 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-slate-900/50 p-0.5">
                <button onClick={handleLike} className={cn("flex items-center space-x-1.5 px-3 py-1 rounded-md font-bold text-[9px] transition-all", liked ? "bg-red-500 text-white" : "text-slate-500 hover:text-red-500 hover:bg-red-50/50")}>
                  <Heart size={12} className={cn(liked && "fill-current")} />
                  <span>{post.likes || 0}</span>
                </button>
                <button onClick={() => document.getElementById('discussion')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center space-x-1.5 px-2 py-1 text-slate-500 hover:text-primary transition-all">
                  <MessageSquare size={12} />
                  <span className="text-[9px] font-bold">{post.Comment?.length || 0}</span>
                </button>
                <div className="relative">
                  <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-1 px-2 text-slate-500 hover:text-primary transition-all rounded-md">
                    <Share2 size={12} />
                  </button>
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                       <button onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`); setShowShareMenu(false); }} className="w-full flex items-center px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                         <Facebook size={14} className="mr-3 text-blue-600" /> Facebook
                       </button>
                       <button onClick={() => { window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`); setShowShareMenu(false); }} className="w-full flex items-center px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                         <Twitter size={14} className="mr-3 text-sky-500" /> Twitter
                       </button>
                       <button onClick={() => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`); setShowShareMenu(false); }} className="w-full flex items-center px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                         <Linkedin size={14} className="mr-3 text-blue-700" /> LinkedIn
                       </button>
                       <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2" />
                       <button onClick={() => { navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : ''); setMsgData({ isOpen: true, title: 'Thành công', message: 'Liên kết bài viết đã được chép vào bộ nhớ đệm!', variant: 'success' }); setShowShareMenu(false); }} className="w-full flex items-center px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                         <Link2 size={14} className="mr-3 text-slate-500" /> Copy Link
                       </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <article className="w-full overflow-hidden max-w-none bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800/50">
              {post.cover_image && (
                <div className="w-full aspect-[21/9] border-b border-slate-100/50 dark:border-slate-800/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${post.cover_image}`}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 relative z-0"
                  />
                </div>
              )}

              <div className="p-8 md:p-12">
                <div
                  className="rich-text-content admin-content article-body"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content || '') }}
                />

                {post.Series && (
                  <div className="mt-1 p-8 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                      <Link href={`/series/${post.Series.slug}`} className="flex items-center space-x-4 group">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary transition-all group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
                          <Layers size={22} />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nằm trong series</h4>
                          <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{post.Series.name}</p>
                        </div>
                      </Link>
                      <Link href={`/series/${post.Series.slug}`} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Xem tất cả</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.prevPost ? (
                        <Link href={`/${post.prevPost.Category?.slug || 'uncategorized'}/${post.prevPost.slug}`}
                          className="flex items-center p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary/50 hover:shadow-xl transition-all group">
                          <ChevronLeft size={24} className="text-primary mr-4 group-hover:-translate-x-1 transition-transform" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bài trước</span>
                            <p className="text-[13px] font-bold text-slate-900 dark:text-white line-clamp-1 mt-1">{post.prevPost.title}</p>
                          </div>
                        </Link>
                      ) : <div className="hidden md:block" />}

                      {post.nextPost ? (
                        <Link href={`/${post.nextPost.Category?.slug || 'uncategorized'}/${post.nextPost.slug}`}
                          className="flex items-center p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary/50 hover:shadow-xl transition-all group justify-end text-right">
                          <div className="mr-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bài tiếp theo</span>
                            <p className="text-[13px] font-bold text-slate-900 dark:text-white line-clamp-1 mt-1">{post.nextPost.title}</p>
                          </div>
                          <ChevronRight size={24} className="text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : <div className="hidden md:block" />}
                    </div>
                  </div>
                )}

                {post.Tag && post.Tag.length > 0 && (
                  <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-3">
                      <IconBadge icon={TagIcon} color="blue" size="sm" className="mr-2" />
                      {post.Tag.map((tag, i) => (
                        <Link key={i} href={`/?q=${tag.name}`} className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary text-slate-500 rounded-xl text-[11px] font-bold transition-all border border-slate-100 dark:border-slate-700">
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Discussion Section */}
            <section id="discussion" className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-100 dark:border-slate-800/50 shadow-sm mt-1">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center">
                  <MessageSquare className="mr-4 text-primary" />
                  Thảo luận
                  <span className="ml-4 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-bold">{post.Comment?.length || 0}</span>
                </h2>
              </div>

              {isMaintenanceComments ? (
                <div className="mb-10 p-8 text-center bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-3xl animate-in zoom-in duration-300">
                  <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
                    <AlertCircle className="text-primary w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tính năng bình luận đang bảo trì</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Chúng tôi đang cập nhật hệ thống bình luận. Vui lòng quay lại sau nhé!</p>
                </div>
              ) : replyingTo === null && (
                <form onSubmit={handleComment} className="mb-10 relative bg-slate-50/50 dark:bg-slate-950/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="relative mb-4">
                    <textarea
                      placeholder="Hãy chia sẻ ý kiến của bạn tại đây..."
                      className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px] text-sm resize-none shadow-sm"
                      value={commentText}
                      onChange={(e) => { setCommentText(e.target.value); setCommentError(null); }}
                    />
                  </div>
                  {commentError && <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold flex items-center shadow-sm animate-in fade-in zoom-in-95"><AlertCircle size={16} className="mr-2" />{commentError}</div>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-bold uppercase tracking-widest pl-2">
                      <UserIcon size={14} className="text-slate-400" />
                      <span>Hành động với tư cách: <b className="text-primary">{isAuthenticated ? user?.fullname || user?.username : 'Khách'}</b></span>
                    </div>
                    <Button type="submit" isLoading={isSubmitting} disabled={!commentText.trim()} size="sm">
                      Gửi bình luận
                    </Button>
                  </div>
                </form>
              )}

              <AnimateList className="space-y-1">
                {post.Comment && post.Comment.length > 0 ? (
                  (() => {
                    const tree = buildCommentTree(post.Comment);
                    const renderComments = (commentsList: CommentType[], isReply = false): React.ReactNode => {
                      return commentsList.map(comment => {
                        const isTarget = activeHash === `#comment-${comment.id}`;
                        
                        return (
                          <div 
                            key={comment.id} 
                            id={`comment-${comment.id}`}
                            className={cn(
                              "group/comment relative transition-all duration-700", 
                              isReply ? "ml-6 md:ml-10 mt-3 md:mt-4 before:content-[''] before:absolute before:-left-4 md:before:-left-6 before:top-4 before:w-3 md:before:w-4 before:h-px before:bg-slate-200 dark:before:bg-slate-700 before:z-0 after:content-[''] after:absolute after:-left-4 md:after:-left-6 after:-top-6 after:h-10 after:w-px after:bg-slate-200 dark:after:bg-slate-700 after:z-0" : "mb-6",
                              isTarget && "ring-2 ring-primary/40 ring-offset-8 rounded-3xl bg-primary/5 p-4 -m-4 shadow-xl shadow-primary/5 z-20"
                            )}
                          >
                           <div className="flex space-x-3 relative z-10">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs uppercase overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                  {comment.User?.avatar ? (
                                    <img src={comment.User.avatar} alt={comment.author_name} className="w-full h-full object-cover" />
                                  ) : (comment.author_name || 'K')[0]}
                              </div>
                              <div className="flex-grow min-w-0">
                                 <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-800 transition-all">
                                    <div className="flex items-center justify-between mb-1.5">
                                       <span className="font-bold text-slate-900 dark:text-white text-[13px]">{comment.author_name}</span>
                                       <span className="text-[10px] text-slate-400 font-medium">
                                          {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                                       </span>
                                    </div>
                                    {editingCommentId === comment.id ? (
                                       <div className="mt-2 space-y-3">
                                          <textarea
                                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                          />
                                          <div className="flex justify-end space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => setEditingCommentId(null)}>Hủy</Button>
                                            <Button size="sm" onClick={() => handleUpdateComment(comment.id)}>Lưu</Button>
                                          </div>
                                       </div>
                                    ) : (
                                       <p className="text-slate-700 dark:text-slate-300 text-[13.5px] leading-relaxed break-words whitespace-pre-wrap">
                                          {comment.content}
                                       </p>
                                    )}
                                 </div>

                                 <div className="flex items-center space-x-4 mt-1.5 ml-2 opacity-80 hover:opacity-100 transition-opacity">
                                   <button onClick={() => { setReplyingTo(replyingTo === comment.id ? null : comment.id); setCommentText(''); }} className="text-[11px] font-bold text-slate-500 hover:text-primary transition-colors">
                                     Phản hồi
                                   </button>
                                   {isAuthenticated && (user?.id === comment.user_id || user?.role === 'admin') && (
                                      <>
                                        {user?.id === comment.user_id && <button onClick={() => { setEditingCommentId(comment.id); setEditingText(comment.content); }} className="text-[11px] font-bold text-slate-500 hover:text-primary transition-colors">Sửa</button>}
                                        {deleteConfirmId === comment.id ? (
                                          <div className="flex items-center space-x-2 text-[10px] bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30">
                                            <span className="text-red-500 font-bold">Xóa?</span>
                                            <button onClick={() => handleDeleteComment(comment.id)} className="text-red-600 hover:text-red-700 font-bold">Có</button>
                                            <button onClick={() => setDeleteConfirmId(null)} className="text-slate-500 hover:text-slate-700">Không</button>
                                          </div>
                                        ) : (
                                          <button onClick={() => setDeleteConfirmId(comment.id)} className="text-[11px] font-bold text-slate-500 hover:text-red-500 transition-colors">Xóa</button>
                                        )}
                                      </>
                                   )}
                                 </div>
                                 
                                 {replyingTo === comment.id && (
                                   <div className="mt-3 mb-2 animate-in fade-in slide-in-from-top-2">
                                      <form onSubmit={handleComment} className="flex flex-col space-y-2 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl relative shadow-sm">
                                         <input type="text" autoFocus value={commentText} onChange={(e) => { setCommentText(e.target.value); setCommentError(null); }} onKeyDown={(e) => { if (e.key === 'Escape') setReplyingTo(null); }} placeholder={`Trả lời ${comment.author_name}...`} className="w-full bg-transparent text-[13px] outline-none px-2 py-1 placeholder:text-slate-400" />
                                         <div className="flex justify-between items-center px-1">
                                           <span className="text-[10px] text-slate-400 ml-1">Nhấn Esc để hủy</span>
                                           <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!commentText.trim()} className="h-7 text-[11px] px-3">Gửi</Button>
                                         </div>
                                      </form>
                                       {commentError && <div className="mt-2 px-2 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold border border-red-100 flex items-center"><AlertCircle size={12} className="inline mr-1" />{commentError}</div>}
                                   </div>
                                 )}
                              </div>
                           </div>
                           {comment.Replies && comment.Replies.length > 0 && (
                              <div className="mt-1 relative">
                                 {renderComments(comment.Replies, true)}
                              </div>
                           )}
                        </div>
                        );
                      });
                    };
                    return <>{renderComments(tree)}</>;
                  })()
                ) : (
                  <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                    <MessageSquare size={40} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Chưa có bình luận nào.</p>
                    <p className="text-slate-500 text-[11px] mt-2">Hãy là người đầu tiên chia sẻ cảm nghĩ!</p>
                  </div>
                )}
              </AnimateList>
            </section>
          </div>

      {/* Sidebar */}
      <aside className="lg:w-3/12 w-full flex-shrink-0 space-y-1 lg:sticky lg:top-24 h-fit">
        {/* Search Box */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-all">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Tìm nội dung hấp dẫn..."
            className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm group-hover:shadow-md"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && router.push(`/?q=${searchValue}`)}
          />
          <button
            onClick={() => router.push(`/?q=${searchValue}`)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
            aria-label="Search"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Same Series Posts */}
        {post.series_id && seriesPosts.length > 0 && (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-primary">
              <Layers size={60} />
            </div>
            <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-6 flex items-center">
              <Layers size={14} className="mr-2" />
              Cùng Series này
            </h3>
            <div className="space-y-4">
              {seriesPosts.map((p, idx) => (
                <Link key={p.id} href={`/${p.Category?.slug || 'uncategorized'}/${p.slug}`} className="flex group">
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold mr-4 transition-all shadow-sm",
                    p.slug === post.slug ? "bg-primary text-white scale-110 shadow-primary/20" : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex-grow pt-1">
                    <p className={cn(
                      "text-[13px] font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2",
                      p.slug === post.slug ? "text-primary" : "text-slate-900 dark:text-white"
                    )}>
                      {p.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Khám phá danh mục</h3>
          <div className="space-y-3">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/?q=${cat.name}`}
                className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all group border border-transparent hover:border-primary/20">
                <span className="text-[14px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary">{cat.name}</span>
                <span className="bg-white dark:bg-slate-900 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-400 shadow-inner group-hover:text-primary">{cat._count?.Post || 0}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Bài viết liên quan</h3>
          <div className="space-y-8">
            {relatedPosts.filter(p => p.id !== post.id).slice(0, 3).map(p => (
              <Link key={p.id} href={`/${p.Category?.slug || 'uncategorized'}/${p.slug}`} className="block group">
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{p.Category?.name}</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                    {p.title}
                  </h4>
                  <div className="flex items-center text-slate-400 text-[10px] space-x-3 font-medium uppercase tracking-tighter">
                    <span>{new Date(p.created_at).toLocaleDateString('vi-VN')}</span>
                    <span>•</span>
                    <span className="flex items-center"><Eye size={10} className="mr-1" /> {p.views || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>
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
