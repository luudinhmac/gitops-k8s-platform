'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Calendar, User as UserIcon, Mail, Eye } from 'lucide-react';

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
}

export default function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [author, setAuthor] = useState<{ 
    fullname: string; 
    username: string; 
    email?: string; 
    profession?: string; 
    avatar?: string;
    created_at: string;
  } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin user
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setAuthor(userData);
        }

        // Lấy bài viết và lọc theo author_id 
        // (Do backend đơn giản, tạm filter ở frontend. Nếu backend có API ?author=id thì tốt hơn)
        const postsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          const authorPosts = postsData.filter((p: Post) => p.author_id === parseInt(id));
          setPosts(authorPosts);
        }
      } catch (error: unknown) {
        console.error('Error fetching author data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-12 px-4 min-h-screen max-w-4xl mx-auto text-center">
         <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse mx-auto mb-6" />
         <div className="h-8 w-48 bg-slate-100 dark:bg-slate-800 rounded mx-auto mb-4 animate-pulse" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="pt-48 pb-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Tác giả không tồn tại</h2>
        <Link href="/" className="text-primary hover:underline">Quay lại trang chính</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Author Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center mb-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-full" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 blur-[60px] rounded-full" />
           
           <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white text-3xl md:text-5xl font-bold mb-6 relative z-10 shadow-xl shadow-primary/20">
             {author.avatar ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img 
                 src={author.avatar} 
                 alt={author.fullname || author.username} 
                 className="w-full h-full rounded-full object-cover" 
               />
             ) : (author.fullname || author.username)?.[0]?.toUpperCase()}
           </div>
           
           <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-1.5 relative z-10">
             {author.fullname || author.username}
           </h1>
           <p className="text-primary text-xs font-medium tracking-wide mb-5 relative z-10">
             {author.profession || 'Thành viên'} • @{author.username}
           </p>
           
           <div className="flex flex-wrap items-center justify-center gap-3 text-[13px] font-medium text-slate-500 relative z-10">
             <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
               <Mail size={14} className="mr-2 text-slate-400" />
               {author.email || 'Không công khai'}
             </div>
             <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
               <Calendar size={14} className="mr-2 text-slate-400" />
               Tham gia: {new Date(author.created_at).toLocaleDateString('vi-VN')}
             </div>
             <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full text-primary font-bold">
               {posts.length} bài viết
             </div>
           </div>
        </div>

        {/* Posts List */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
           Bài viết của {author.fullname || author.username}
        </h2>

        <div className="grid gap-5">
          {posts.length > 0 ? (
            posts.map(post => (
              <article key={post.id} className="group glass p-5 md:p-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5">
                 <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Date Block */}
                    <div className="flex-shrink-0 flex flex-col justify-center items-center p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl w-full md:w-24 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                        Tháng {new Date(post.created_at).getMonth() + 1}
                      </span>
                      <span className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-none">
                        {new Date(post.created_at).getDate()}
                      </span>
                      <span className="text-xs font-medium text-slate-400 mt-1">
                        {new Date(post.created_at).getFullYear()}
                      </span>
                    </div>

                    {/* Content Block */}
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {post.Category?.name || 'Chưa phân loại'}
                        </span>
                        {post.is_pinned && (
                          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center">
                            Ghim
                          </span>
                        )}
                      </div>

                      <Link href={`/${post.Category?.slug || 'uncategorized'}/${post.slug}`}>
                        <h3 className="text-lg md:text-xl font-display font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors leading-snug">
                          {post.title}
                        </h3>
                      </Link>

                      {/* Tags */}
                      {post.Tag && post.Tag.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.Tag.map((tag: { name: string }, idx: number) => (
                            <span key={idx} className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center text-[10px] font-bold text-slate-500 mt-auto">
                        <span className="flex items-center mr-4 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full">
                          <Eye size={12} className="mr-1.5" /> {post.views}
                        </span>
                        <span className="flex items-center border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full">
                          <UserIcon size={12} className="mr-1.5" /> {(post.Tag?.length || 0)} thẻ
                        </span>
                      </div>
                    </div>
                 </div>
              </article>
            ))
          ) : (
            <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
               <p className="text-slate-500 font-medium">Tác giả này chưa có bài viết nào.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
