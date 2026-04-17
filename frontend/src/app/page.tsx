'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Calendar, User as UserIcon, Clock, ChevronRight, Eye, Terminal, MessageSquare, Tag as TagIcon, Layout, Bookmark, LayoutGrid, Sparkles, Loader2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import UserAvatar from '@/components/common/UserAvatar';
import Navbar from '@/components/layout/Navbar';
import AnimateList from '@/components/ui/AnimateList';
import PostCard from '@/components/common/PostCard';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Modular Services
import { postService } from '@/services/postService';
import { categoryService as catApi } from '@/services/categoryService';
import { seriesService } from '@/services/seriesService';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  Series?: {
    name: string;
    slug: string;
  } | null;
  created_at: string;
  readTime: number;
  views: number;
  author_id: number;
  Category: {
    name: string;
    slug: string;
  } | null;
  User: {
    fullname: string;
    username: string;
    avatar?: string | null;
  };
  Tag: {
    name: string;
  }[];
}

interface Category {
  id: number;
  name: string;
  _count?: {
    Post: number;
  };
}

interface Series {
  id: number;
  name: string;
  slug: string;
}

function BlogContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentSeries, setRecentSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(q);

  useEffect(() => {
    setSearchTerm(q);
  }, [q]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [postsData, catsData, seriesData] = await Promise.all([
        postService.getAll({ q, limit: 12 }),
        catApi.getAll(),
        seriesService.getAll()
      ]);

      setPosts(Array.isArray(postsData) ? (postsData as any) : []);
      setCategories(catsData);
      setRecentSeries(Array.isArray(seriesData) ? seriesData.slice(0, 5) : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen bg-slate-50/30 dark:bg-slate-950/30">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Blog chia sẻ Kiến thức"
          description="Hành trình từ System Engineer đến Cloud & DevOps. Chia sẻ kinh nghiệm thực chiến về hệ thống và công nghệ."
          centered
          breadcrumbs={[]}
        >
           {q && (
             <div className="mt-6 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kết quả tìm kiếm cho:</span>
                <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full shadow-lg shadow-primary/20">{q}</span>
                <button onClick={() => router.push('/')} className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors ml-2 uppercase tracking-widest hover:underline">Xóa lọc</button>
             </div>
           )}
        </PageHeader>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content (Posts) */}
          <div className="flex-grow lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl h-[400px] animate-pulse border border-slate-100 dark:border-slate-800 shadow-sm" />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <AnimateList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, idx) => (
                  <PostCard key={post.id} post={post} priority={idx < 6} />
                ))}
              </AnimateList>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy bài viết</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">Chúng tôi không tìm thấy nội dung nào phù hợp với từ khóa <b className="text-primary">"{q}"</b>. Hãy thử tìm kiếm với từ khóa khác hoặc khám phá qua danh mục.</p>
                <Button variant="outline" className="mt-8" onClick={() => router.push('/')}>Xem tất cả bài viết</Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/4 space-y-8">
            {/* Search Box */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Tìm nội dung hấp dẫn..."
                className="w-full pl-11 pr-11 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm group-hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/?q=${encodeURIComponent(searchTerm)}`);
                  }
                }}
              />
              <button
                onClick={() => router.push(`/?q=${encodeURIComponent(searchTerm)}`)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-all p-1"
                aria-label="Search"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                <LayoutGrid size={14} className="mr-2.5 text-primary" /> Khám phá danh mục
              </h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => router.push(`/?q=${encodeURIComponent(cat.name)}`)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-all group border border-transparent hover:border-primary/20",
                      q.toLowerCase() === cat.name.toLowerCase() 
                        ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    <span>{cat.name}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors",
                      q.toLowerCase() === cat.name.toLowerCase() 
                        ? "bg-white/20 text-white" 
                        : "bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/20"
                    )}>
                      {cat._count?.Post || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Series */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-primary transform translate-x-4 -translate-y-4">
                  <Bookmark size={80} />
               </div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                <Bookmark size={14} className="mr-2.5 text-primary" /> Series bài viết
              </h4>
              <div className="space-y-3 relative z-10">
                {recentSeries.length > 0 ? (
                  recentSeries.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => router.push(`/?q=${encodeURIComponent(s.name)}`)}
                      className="w-full group text-left p-4 bg-slate-50 dark:bg-slate-950/50 border border-transparent hover:border-primary/20 rounded-2xl transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={10} className="text-primary" />
                        <span className="text-[10px] text-primary uppercase font-bold tracking-tighter">Series Kiến thức</span>
                      </div>
                      <div className="text-[13px] font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{s.name}</div>
                    </button>
                  ))
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-xs text-slate-400 italic">Hệ thống đang cập nhật series...</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-40 text-center"><Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" /><p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Đang tải dữ liệu...</p></div>}>
      <BlogContent />
    </Suspense>
  );
}

