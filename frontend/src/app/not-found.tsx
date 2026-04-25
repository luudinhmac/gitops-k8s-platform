'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Search, ArrowRight, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/shared/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import { postService } from '@/features/posts/services/postService';
import { Post } from '@portfolio/contracts';

export default function NotFound() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await postService.getAll();
        setRecentPosts(posts.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch posts for 404 page', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0f172a] selection:bg-primary/30">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-20 w-full justify-center">
          {/* Image/Meme Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative lg:w-1/2 max-w-lg aspect-square"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse z-0" />
            <div className="relative z-10 w-full h-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group">
              <img 
                src="/images/meme-404.png" 
                alt="404 Meme" 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Error Code</span>
                <h2 className="text-4xl font-extrabold text-white tracking-tighter">404</h2>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 text-center lg:text-left space-y-8"
          >
            <div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6">
                Ối! Không tìm thấy <span className="text-primary italic">trang này.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                Có vẻ như đường dẫn bạn đang tìm kiếm đã bị dời đi, bị xóa hoặc chưa bao giờ tồn tại. Đừng lo, robot của chúng mình đang tìm cách sửa nó!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 gap-2 group shadow-xl shadow-primary/20 hover:shadow-primary/40">
                  <Home size={18} />
                  Về Trang Chủ
                </Button>
              </Link>
              <Link href="/?q=">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 gap-2 group bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all">
                  <Search size={18} />
                  Tìm bài viết
                </Button>
              </Link>
            </div>

            <div className="pt-6 flex items-center justify-center lg:justify-start gap-4">
               <div className="flex -space-x-3 overflow-hidden">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-800 border border-white/10" />
                  ))}
               </div>
               <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">+1.2k người khác cũng đi lạc</span>
            </div>
          </motion.div>
        </div>

        {/* Featured Content Suggestions */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full border-t border-slate-100 dark:border-white/5 pt-20"
        >
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-bold dark:text-white flex items-center gap-3">
              <ArrowRight className="text-primary" />
              Khám phá nội dung khác
            </h3>
            <Link href="/" className="text-primary text-sm font-bold hover:underline">Xem tất cả</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-white/5 animate-pulse" />
              ))
            ) : (
              recentPosts.map((post) => (
                <Link key={post.id} href={`/${post.Category?.slug || 'uncategorized'}/${post.slug}`} className="group h-full">
                  <article className="bg-slate-50/50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-all h-full flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
                         {post.Category?.name || 'Blog'}
                       </span>
                       <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold">
                         <span className="flex items-center gap-1"><Clock size={12} /> 5 min</span>
                         <span className="flex items-center gap-1"><MessageSquare size={12} /> {post._count?.Comment || 0}</span>
                       </div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 flex-grow">
                      {post.content?.substring(0, 100).replace(/<[^>]*>/g, '')}...
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                       <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                       <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">By {post.User?.fullname || 'Admin'}</span>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

