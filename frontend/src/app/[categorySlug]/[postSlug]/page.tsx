'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  Calendar, User as UserIcon, Clock, ArrowLeft, Share2, 
  MessageSquare, Heart, Bookmark, Eye, Terminal, 
  ChevronRight, Facebook, Twitter, Link as LinkIcon,
  Smile, MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorEmail: string | null;
  createdAt: string;
}

interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  series: string | null;
  created_at: string;
  readTime: number;
  views: number;
  likes: number;
  Category: {
    name: string;
    slug: string;
  } | null;
  User: {
    id: number;
    fullname: string;
    avatar: string | null;
    profession: string | null;
  };
  Tag: {
    name: string;
  }[];
  Comment: Comment[];
}

export default function PostSlugDetailPage({ params }: { params: Promise<{ categorySlug: string, postSlug: string }> }) {
  const { categorySlug, postSlug } = use(params);
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch by postSlug (the backend supports id or slug in the same endpoint)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postSlug}`);
        if (!response.ok) throw new Error('Post not found');
        const data = await response.json();
        
        // Security check: ensure category matches
        if (data.Category?.slug !== categorySlug && categorySlug !== 'uncategorized') {
           // Optionally redirect or handle mismatch
           console.warn('Category slug mismatch');
        }

        setPost(data);

        // Check like status
        const likedStatusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${data.id}/like-status`, { credentials: 'include' });
        if (likedStatusRes.ok) {
          const status = await likedStatusRes.json();
          setLiked(status.liked);
        }

        // Increment view count after 1 min
        const viewTimer = setTimeout(async () => {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${data.id}?action=view`, { method: 'GET' });
        }, 60000);

        return () => clearTimeout(viewTimer);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, categorySlug]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thích bài viết.');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post?.id}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        if (post) setPost({ ...post, likes: data.liked ? post.likes + 1 : post.likes - 1 });
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!post) return;

    setIsSubmitting(true);
    try {
      const payload = isAuthenticated ? { content: commentText } : { 
        content: commentText,
        authorName: 'Khách',
        authorEmail: null
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newComment = await response.json();
        setPost({ ...post, Comment: [newComment, ...(post.Comment || [])] });
        setCommentText('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-40 pb-20 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
          <div className="h-64 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[3rem]" />
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
        <Link href="/blog" className="text-primary hover:underline mt-4 inline-block">Quay lại trang blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Breadcrumb */}
        <nav className="flex items-center space-x-4 mb-12 text-sm">
          <Link 
            href="/blog" 
            className="group flex items-center text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Tất cả bài viết
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400 truncate max-w-[200px]">{post.Category?.name || 'Kỹ thuật'}</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center text-primary bg-primary/10 px-3 py-1.5 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
              <UserIcon size={14} className="mr-2" />
              {post.User?.fullname || 'Ẩn danh'}
            </div>
            {post.Category && (
              <Link 
                href={`/blog?q=${post.Category.name}`}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {post.Category.name}
              </Link>
            )}
            <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <Calendar size={14} className="mr-2 text-primary" />
              {new Date(post.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <Clock size={14} className="mr-2 text-primary" />
              {post.readTime || 5} phút đọc
            </div>
            <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
               <Eye size={14} className="mr-2 text-primary" />
               {post.views || 0}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          {/* Action Bar */}
          <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 mb-10">
            <div className="flex items-center">
                <Link href={`/author/${post.User?.id || 1}`} className="flex items-center group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold overflow-hidden ring-2 ring-white dark:ring-slate-900 transition-transform group-hover:scale-105 mr-3">
                     {post.User?.avatar ? <img src={post.User.avatar} alt={post.User.fullname} className="w-full h-full object-cover" /> : (post.User?.fullname?.[0] || 'A')}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Tác giả</span>
                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-sm">{post.User?.fullname || 'Ẩn danh'}</span>
                  </div>
                </Link>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleLike} 
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all",
                  liked ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : "bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700 hover:text-red-500"
                )}
              >
                <Heart size={16} className={cn(liked && "fill-current")} />
                <span>{liked ? "Đã thích" : "Yêu thích"}</span>
                <span className="opacity-60 text-[10px]">({post.likes || 0})</span>
              </button>
              <button className="p-2.5 bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700 rounded-2xl hover:text-primary transition-colors">
                 <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="mb-16">
            <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${post.cover_image}`} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 px-2 md:px-0">
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-40 flex flex-col items-center space-y-6">
              <div className="flex flex-col items-center space-y-1">
                <button 
                  onClick={handleLike}
                  className={cn(
                    "p-3.5 rounded-2xl transition-all duration-300",
                    liked 
                      ? "bg-red-500 text-white shadow-red-500/20" 
                      : "bg-white dark:bg-slate-900 text-slate-400 hover:text-red-500 border border-slate-100 dark:border-slate-800"
                  )}
                >
                  <Heart size={20} className={cn(liked && "fill-current")} />
                </button>
                <span className="text-[10px] font-bold text-slate-400">{post.likes || 0}</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <button className="p-4 bg-white dark:bg-slate-900 text-slate-400 hover:text-primary border border-slate-100 dark:border-slate-800 rounded-2xl transition-all">
                  <MessageSquare size={20} />
                </button>
                <span className="text-[10px] font-bold text-slate-400">{post.Comment?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-11 prose prose-lg dark:prose-invert max-w-none">
            <div 
              className="rich-text-content admin-content"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </div>
        </div>

        {/* Discussion Section */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm mb-20">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8 flex items-center">
            Thảo luận <span className="ml-3 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{post.Comment?.length || 0}</span>
          </h2>
          
          <form onSubmit={handleComment} className="mb-12">
            <div className="relative mb-4">
              <textarea 
                placeholder="Viết suy nghĩ của bạn..."
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[100px] text-sm resize-none"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Đang bình luận với {isAuthenticated ? user?.username : 'Khách'}
              </div>
              <button 
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {post.Comment && post.Comment.length > 0 ? post.Comment.slice(0, 10).map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                  {comment.authorName[0]}
                </div>
                <div className="flex-grow">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{comment.authorName}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 border border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                <MessageSquare size={32} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 text-xs font-medium">Chưa có bình luận nào.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
