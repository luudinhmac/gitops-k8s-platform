'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { Calendar, User as UserIcon, Mail, Eye, ArrowLeft, Loader2, Sparkles, MapPin, Briefcase, Heart, MessageSquare } from 'lucide-react';
import AnimateList from '@/components/ui/AnimateList';
import Button from '@/components/ui/Button';
import FormattedDate from '@/components/common/FormattedDate';
import Badge from '@/components/common/Badge';

// Modular Services
import { userService } from '@/services/userService';
import { postService } from '@/services/postService';

interface Post {
  id: number;
  title: string;
  slug: string;
  cover_image: string | null;
  created_at: string;
  is_pinned?: boolean;
  author_id: number;
  views: number;
  Category?: { name: string; slug: string } | null;
  Tag?: { name: string }[];
  likes?: number;
  _count?: { Comment: number; PostLike: number };
}

interface Author {
  id: number;
  fullname: string; 
  username: string; 
  email?: string; 
  profession?: string; 
  avatar?: string;
  created_at: string;
}

export default function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [userData, postsData] = await Promise.all([
        userService.getById(id),
        postService.getAll({ limit: 100 }) // Assuming limit 100 for author posts
      ]);
      // Cast to any to handle flexible response formats quietly
      const rawPostsData = postsData as any;
      setAuthor(userData as unknown as Author);
      
      // Filter posts by author_id
      const authorId = parseInt(id);
      const postsArray = Array.isArray(rawPostsData) ? rawPostsData : (rawPostsData?.posts || []);
      const authorPosts = postsArray.filter((p: Post) => p.author_id === authorId);
      setPosts(authorPosts);
    } catch (error: unknown) {
      console.error('Error fetching author data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="pt-40 pb-12 px-4 min-h-screen text-center bg-slate-50/30 dark:bg-slate-950/30">
        <Loader2 size={40} className="animate-spin text-primary mx-auto mb-6" />
        <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse mx-auto mb-6" />
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-4 animate-pulse" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="pt-48 pb-12 px-4 text-center bg-slate-50/30 dark:bg-slate-950/30 min-h-screen">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
           <UserIcon size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-4 font-display text-slate-900 dark:text-white">Tác giả không tồn tại</h2>
        <p className="text-slate-500 mb-8">Thông tin người dùng này không khả dụng hoặc đã bị xóa.</p>
        <Button component={Link} href="/">Quay lại trang chính</Button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen bg-slate-50/30 dark:bg-slate-950/30">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center space-x-4 mb-10 text-xs animate-in fade-in duration-500">
          <Link href="/" className="group flex items-center font-bold text-slate-400 hover:text-primary transition-all">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            TRANG CHỦ
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">TÁC GIẢ</span>
        </nav>
        
        {/* Author Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800/50 shadow-2xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center mb-16 relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full translate-y-12 -translate-x-12 pointer-events-none" />
           
           <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500 animate-pulse" />
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-gradient-to-tr from-primary to-blue-500 p-1 relative z-10 shadow-2xl">
                <div className="w-full h-full rounded-[1.8rem] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                  {author.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={author.avatar} 
                      alt={author.fullname || author.username} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-tr from-primary to-blue-500 bg-clip-text text-transparent">
                      {(author.fullname || author.username)?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                 <Sparkles size={20} />
              </div>
           </div>
           
           <div className="text-center relative z-10">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
                {author.fullname || author.username}
              </h1>
              <div className="flex items-center justify-center gap-2 mb-6 text-primary font-bold text-xs uppercase tracking-widest">
                 <Briefcase size={14} />
                 <span>{author.profession || 'Chuyên gia nội dung'}</span>
                 <span className="text-slate-300">•</span>
                 <span>@{author.username}</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] font-bold text-slate-500">
                <div className="flex items-center bg-slate-50 dark:bg-slate-950/50 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <Mail size={14} className="mr-2.5 text-primary" />
                  {author.email || 'Private Email'}
                </div>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950/50 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                   <FormattedDate date={author.created_at} showIcon iconSize={14} className="text-slate-500" />
                </div>
                <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-2xl border border-primary/10">
                  <span className="mr-1.5">{posts.length}</span> BÀI VIẾT
                </div>
              </div>
           </div>
        </div>

        {/* Posts List Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between ml-2">
            <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
               Ấn phẩm gần đây ({posts.length})
            </h2>
            <div className="h-px flex-grow mx-6 bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="grid gap-6">
            {posts.length > 0 ? (
              <AnimateList className="divide-y divide-slate-100 dark:divide-slate-800">
                {posts.map(post => (
                  <article key={post.id} className="py-6 group transition-all duration-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 px-4 -mx-4 rounded-2xl">
                     <Link href={`/${post.Category?.slug || 'uncategorized'}/${post.slug}`}>
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                         {post.title}
                       </h3>
                     </Link>

                     <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                       <span className="flex items-center">
                         <Calendar size={14} className="mr-1.5" /> 
                         {new Date(post.created_at).toLocaleDateString('vi-VN')}
                       </span>
                       <span className="flex items-center text-primary/70">
                         <Eye size={14} className="mr-1.5" /> {post.views}
                       </span>
                       <span className="flex items-center text-red-500/70">
                         <Heart size={14} className="mr-1.5" /> {post.likes || 0}
                       </span>
                       <span className="flex items-center text-blue-500/70">
                         <MessageSquare size={14} className="mr-1.5" /> {post._count?.Comment || 0}
                       </span>
                     </div>
                  </article>
                ))}
              </AnimateList>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                 <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <UserIcon size={32} />
                 </div>
                 <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Chưa có bài viết nào</p>
                 <p className="text-xs text-slate-400 mt-2">Nội dung sẽ sớm được cập nhật.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
