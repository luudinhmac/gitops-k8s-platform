'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Calendar, User as UserIcon, Clock, ArrowLeft, Share2,
  MessageSquare, Heart, Bookmark, Eye, Terminal,
  ChevronRight, Facebook, Twitter, Link as LinkIcon,
  Smile, MoreHorizontal, Layers, ChevronLeft, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';

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
  series_id: number | null;
  series_order: number;
  Series: {
    id: number;
    name: string;
    slug: string;
  } | null;
  prevPost: { id: number; title: string; slug: string; Category: { slug: string } } | null;
  nextPost: { id: number; title: string; slug: string; Category: { slug: string } } | null;
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
    username: string;
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
  const [categories, setCategories] = useState<any[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [seriesPosts, setSeriesPosts] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter(); // Wait, I need to import useRouter

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

        // Map backend comments (snake_case) to frontend (camelCase)
        if (data.Comment && Array.isArray(data.Comment)) {
          data.Comment = data.Comment.map((c: any) => ({
            ...c,
            authorName: c.author_name || c.authorName || 'Khách',
            authorEmail: c.author_email || c.authorEmail || null,
            createdAt: c.created_at || c.createdAt
          }));
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

    // Fetch supplementary data for sidebar
    const fetchSidebarData = async () => {
      try {
        const [catsRes, relatedRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?limit=5`) // We might need a better related API, but this is a start
        ]);
        if (catsRes.ok) setCategories(await catsRes.json());
        if (relatedRes.ok) setRelatedPosts((await relatedRes.json()).slice(0, 5));
      } catch (err) {
        console.error('Error fetching sidebar data:', err);
      }
    };
    fetchSidebarData();
  }, [postSlug, categorySlug]);

  // Handle fetching series posts if available
  useEffect(() => {
    if (post?.series_id && post.Series?.slug) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/series/${post.Series.slug}`)
        .then(res => res.json())
        .then(data => setSeriesPosts(data.Post || []))
        .catch(err => console.error('Error fetching series posts:', err));
    }
  }, [post?.series_id, post?.Series?.slug]);

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
      const payload = {
        content: commentText,
        post_id: post.id,
        author_name: isAuthenticated ? (user?.fullname || user?.username || 'Thành viên') : 'Khách',
        author_email: user?.email || null
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newComment = await response.json();
        const formattedComment = {
          id: newComment.id,
          content: newComment.content,
          authorName: newComment.author_name,
          authorEmail: newComment.author_email,
          createdAt: newComment.created_at
        };
        setPost({ ...post, Comment: [formattedComment, ...(post.Comment || [])] });
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
        <Link href="/blog" className="text-primary hover:underline mt-4 inline-block">Quay lại trang blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title={post.title}
          breadcrumbs={[
            { label: 'Blog', href: '/blog' },
            { label: post.Category?.name || 'Kỹ thuật' }
          ]}
        >
          {/* Metadata Section */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/author/${post.User?.id || 1}`} className="flex items-center text-primary bg-primary/10 px-3 py-1.5 rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-primary/20 transition-all">
                <UserIcon size={12} className="mr-2" />
                {post.User?.fullname || post.User?.username || 'Ẩn danh'}
              </Link>
              {post.Category && (
                <Link
                  href={`/blog?q=${post.Category.name}`}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {post.Category.name}
                </Link>
              )}
              {post.Series && (
                <Link
                  href={`/series/${post.Series.slug}`}
                  className="flex items-center text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-indigo-500/20 transition-all"
                >
                  <Layers size={12} className="mr-2" />
                  {post.Series.name}
                </Link>
              )}
              <div className="flex items-center space-x-3 text-slate-400 text-[9px] font-bold uppercase tracking-widest border-l border-slate-200 dark:border-slate-800 pl-4 h-5">
                <div className="flex items-center">
                  <Calendar size={10} className="mr-1.5" />
                  {new Date(post.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center">
                  <Clock size={10} className="mr-1.5" />
                  {post.readTime || 5} phút đọc
                </div>
                <div className="flex items-center">
                  <Eye size={10} className="mr-1.5" />
                  {post.views || 0}
                </div>
              </div>
            </div>

            <div className="flex items-center p-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center space-x-2 px-3 py-1 rounded-lg font-bold text-[9px] transition-all",
                  liked ? "bg-red-500 text-white shadow-md shadow-red-500/20" : "text-slate-500 hover:text-red-500"
                )}
              >
                <Heart size={12} className={cn(liked && "fill-current")} />
                <span>Yêu thích ({post.likes || 0})</span>
              </button>
              <div className="w-px h-3 bg-slate-200 dark:bg-slate-800 mx-1" />
              <button
                onClick={() => document.getElementById('discussion')?.scrollIntoView({ behavior: 'smooth' })}
                className="p-1 text-slate-500 hover:text-primary transition-colors flex items-center space-x-1 px-2"
              >
                <MessageSquare size={12} />
                <span className="text-[9px] font-bold">{post.Comment?.length || 0}</span>
              </button>
              <div className="w-px h-3 bg-slate-200 dark:bg-slate-800 mx-1" />
              <button className="p-1 text-slate-500 hover:text-primary transition-colors px-2">
                <Share2 size={12} />
              </button>
            </div>
          </div>
        </PageHeader>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="mb-8">
            <div className="aspect-[21/9] rounded-xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${post.cover_image}`}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Main Content & Sidebar Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Main Content (Fluid) */}
          <div className="flex-1 min-w-0">
            <div className="max-w-none prose prose-lg dark:prose-invert">
              <div
                className="rich-text-content admin-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Series Navigation Box */}
              {post.Series && (
                <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Link href={`/series/${post.Series.slug}`} className="flex items-center space-x-3 group">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary transition-colors group-hover:text-white">
                        <Layers size={18} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nằm trong series</h4>
                        <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{post.Series.name}</p>
                      </div>
                    </Link>
                    <Link href={`/series/${post.Series.slug}`} className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline">Xem tất cả</Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {post.prevPost ? (
                      <Link href={`/${post.prevPost.Category?.slug || 'uncategorized'}/${post.prevPost.slug}`}
                        className="flex items-center p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-lg transition-all group">
                        <ChevronLeft size={20} className="text-primary mr-3 group-hover:-translate-x-1 transition-transform" />
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Bài trước</span>
                          <p className="text-[11px] font-bold text-slate-900 dark:text-white line-clamp-1">{post.prevPost.title}</p>
                        </div>
                      </Link>
                    ) : <div className="hidden md:block" />}

                    {post.nextPost ? (
                      <Link href={`/${post.nextPost.Category?.slug || 'uncategorized'}/${post.nextPost.slug}`}
                        className="flex items-center p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-lg transition-all group justify-end text-right">
                        <div className="mr-3">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Bài tiếp theo</span>
                          <p className="text-[11px] font-bold text-slate-900 dark:text-white line-clamp-1">{post.nextPost.title}</p>
                        </div>
                        <ChevronRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : <div className="hidden md:block" />}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Fixed Width 320px on LG) */}
          <aside className="lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-32 h-fit">
            {/* Search Box - Refined: No Card, No Title */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm nội dung..."
                className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && router.push(`/blog?q=${searchValue}`)}
              />
              <button
                onClick={() => router.push(`/blog?q=${searchValue}`)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                aria-label="Search"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Same Series Posts (If in series) */}
            {post.series_id && seriesPosts.length > 0 && (
              <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                 <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Cùng Series này</h3>
                 <div className="space-y-3">
                    {seriesPosts.map((p, idx) => (
                      <Link key={p.id} href={`/${p.Category?.slug || 'uncategorized'}/${p.slug}`} className="flex group">
                         <div className={cn(
                           "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold mr-3 transition-colors",
                           p.slug === post.slug ? "bg-primary text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                         )}>
                           {idx + 1}
                         </div>
                         <div className="flex-grow">
                            <p className={cn(
                               "text-[12px] font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2",
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
            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Danh mục</h3>
                <div className="space-y-2">
                   {categories.map((cat) => (
                     <Link key={cat.id} href={`/blog?q=${cat.name}`} 
                        className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all group">
                        <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary">{cat.name}</span>
                        <span className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-slate-400">{cat._count?.Post || 0}</span>
                     </Link>
                   ))}
                </div>
            </div>

            {/* Related Posts (Same Category) */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Bài viết liên quan</h3>
              <div className="space-y-5">
                {relatedPosts.filter(p => p.id !== post.id).slice(0, 3).map(p => (
                  <Link key={p.id} href={`/${p.Category?.slug || 'uncategorized'}/${p.slug}`} className="block group">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-primary uppercase tracking-widest mb-1">{p.Category?.name}</span>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-2">
                        {p.title}
                      </h4>
                      <span className="text-[8px] text-slate-400 font-bold uppercase">{new Date(p.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Discussion Section */}
        <section id="discussion" className="bg-white dark:bg-slate-900 rounded-xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm mb-12">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8 flex items-center">
            Thảo luận <span className="ml-3 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{post.Comment?.length || 0}</span>
          </h2>

          <form onSubmit={handleComment} className="mb-12">
            <div className="relative mb-4">
              <textarea
                placeholder="Hãy để lại ý kiến của bạn..."
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[100px] text-sm resize-none"
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
                  {(comment.authorName || 'K')[0]}
                </div>
                <div className="flex-grow">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
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
              <div className="text-center py-10 border border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
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
