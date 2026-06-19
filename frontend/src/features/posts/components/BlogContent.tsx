'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, LayoutGrid, Bookmark, Sparkles, ChevronRight, X } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import AnimateList from '@/shared/components/ui/AnimateList';
import PostCard from '@/features/posts/components/PostCard';
import Button from '@/shared/components/ui/Button';
import Skeleton from '@/shared/components/ui/Skeleton';
import { cn } from '@/lib/utils';

// Modular Services
import { postService } from '@/features/posts/services/postService';
import { categoryService as catApi } from '@/features/categories/services/categoryService';
import { seriesService } from '@/features/series/services/seriesService';
import { settingService } from '@/features/settings/services/settingService';
import Pagination from '@/shared/components/ui/Pagination';
import { useAuth } from '@/context/AuthContext';
import OfflineMessage from '@/shared/components/common/OfflineMessage';

import { Post, User as Author } from '@/types';

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

export default function BlogContent() {
  const { isBackendOffline } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentSeries, setRecentSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get('page') || '1');
  const [meta, setMeta] = useState({ total: 0, limit: 12, page: 1 });
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState(q);
  const [displaySettings, setDisplaySettings] = useState<Record<string, string>>({});

  useEffect(() => {
    settingService.getPublicSettings()
      .then(data => setDisplaySettings(data))
      .catch(err => console.error('Failed to fetch public settings in BlogContent:', err));
  }, []);

  useEffect(() => {
    setSearchTerm(q);
  }, [q]);

  const fetchData = useCallback(async () => {
    if (isBackendOffline) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasError(false);
    try {
      const [postsData, catsData, seriesData] = await Promise.all([
        postService.getAll({ q, category, limit: 12, page }),
        catApi.getAll(),
        seriesService.getAll()
      ]);

      setPosts(postsData?.items || []);
      setMeta({
        total: postsData?.total || 0,
        limit: postsData?.limit || 12,
        page: postsData?.page || 1
      });
      setCategories(catsData);
      setRecentSeries(Array.isArray(seriesData) ? seriesData.slice(0, 5) : []);
      setHasError(false);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      if (error.isOffline || error.response?.status === 500) {
        setHasError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [q, category, page, isBackendOffline]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== q) {
        router.push(searchTerm ? `/?q=${encodeURIComponent(searchTerm)}` : '/');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, q, router]);

  const handleBannerClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (displaySettings.home_banner_link) {
      if (displaySettings.home_banner_link.startsWith('http://') || displaySettings.home_banner_link.startsWith('https://')) {
        window.open(displaySettings.home_banner_link, '_blank', 'noopener,noreferrer');
      } else {
        router.push(displaySettings.home_banner_link);
      }
    }
  };

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen bg-slate-50/30 dark:bg-slate-950/30">
      <div className="max-w-7xl mx-auto">
        {displaySettings.home_banner_enabled !== 'false' && (
          displaySettings.home_banner_image ? (
            (() => {
              let baseUrl = 'http://localhost:3001';
              try {
                baseUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').origin;
              } catch {
                baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace('/api/v1', '').replace('/v1', '').replace('/api', '');
              }
              const imageUrl = displaySettings.home_banner_image.startsWith('http://') || displaySettings.home_banner_image.startsWith('https://')
                ? displaySettings.home_banner_image
                : `${baseUrl}${displaySettings.home_banner_image}`;
              return (
                <div
                  onClick={displaySettings.home_banner_link ? handleBannerClick : undefined}
                  className={cn(
                    "relative rounded-[2.5rem] overflow-hidden mb-12 shadow-xl border border-slate-200 dark:border-slate-800 bg-cover bg-center min-h-[220px] md:min-h-[280px] flex items-center justify-center text-center p-8 transition-all duration-300 animate-in fade-in duration-500",
                    displaySettings.home_banner_link && "hover:scale-[1.01] hover:shadow-2xl active:scale-[0.99] cursor-pointer"
                  )}
                  style={{ backgroundImage: `url(${imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/75 backdrop-blur-[1px]" />
                  <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight">
                      {displaySettings.home_banner_title ?? 'Blog chia sẻ Kiến thức'}
                    </h1>
                    <p className="text-xs md:text-sm text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
                      {displaySettings.home_banner_subtitle ?? 'Chia sẻ kinh nghiệm thực chiến về hệ thống và công nghệ.'}
                    </p>
                  </div>
                </div>
              );
            })()
          ) : (
            <div 
              onClick={displaySettings.home_banner_link ? handleBannerClick : undefined}
              className={cn(
                "relative rounded-[2.5rem] overflow-hidden mb-12 border border-slate-100 dark:border-slate-900 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-950/40 dark:via-slate-900/40 dark:to-slate-950/40 min-h-[180px] md:min-h-[220px] flex items-center justify-center text-center p-8 transition-all duration-300 animate-in fade-in duration-500",
                displaySettings.home_banner_link && "hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] cursor-pointer"
              )}
            >
              <div className="max-w-3xl mx-auto space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {displaySettings.home_banner_title ?? 'Blog chia sẻ Kiến thức'}
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  {displaySettings.home_banner_subtitle ?? 'Chia sẻ kinh nghiệm thực chiến về hệ thống và công nghệ.'}
                </p>
              </div>
            </div>
          )
        )}

        {/* Filter results display below banner */}
        {(q || category) && (
          <div className="mb-8 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {category ? "Danh mục:" : "Kết quả tìm kiếm cho:"}
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-xs font-bold rounded-full border border-primary/20">
                {category || q}
              </span>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                router.push('/');
              }}
              className="text-xs font-bold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
            >
              <X size={14} />
              Xóa lọc
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-1">
          {/* Main Content (Posts) */}
          <div className="flex-grow lg:w-3/4">
            {(isBackendOffline || hasError) ? (
              <OfflineMessage onRetry={fetchData} />
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-[400px] rounded-2xl" />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                <AnimateList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                  {posts.map((post, idx) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      priority={idx < 6}
                      showAuthor={displaySettings.post_show_author !== 'false'}
                      showDate={displaySettings.post_show_created_at !== 'false'}
                      showViews={displaySettings.post_show_views !== 'false'}
                      showReadTime={displaySettings.post_show_read_time !== 'false'}
                    />
                  ))}
                </AnimateList>

                <Pagination
                  currentPage={meta.page}
                  totalPages={Math.ceil(meta.total / meta.limit)}
                  onPageChange={(p) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('page', p.toString());
                    router.push(`/?${params.toString()}`);
                  }}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Search size={40} />
                </div>
                {q ? (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy bài viết</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto px-4">
                      Chúng tôi không tìm thấy nội dung nào phù hợp với từ khóa <b className="text-primary">"{q}"</b>. Hãy thử tìm kiếm với từ khóa khác hoặc khám phá qua danh mục.
                    </p>
                    <Button variant="outline" className="mt-8" onClick={() => {
                      setSearchTerm('');
                      router.push('/');
                    }}>Xem tất cả bài viết</Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Chưa có bài viết nào</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto px-4">
                      Hiện tại chưa có bài viết nào được xuất bản trên blog. Vui lòng quay lại sau!
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/4 space-y-1">
            {/* Search Box */}
            <div className="relative group">
              <label htmlFor="home-search" className="sr-only">Tìm kiếm nội dung</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Search size={18} />
              </div>
              <input
                id="home-search"
                name="home-search"
                type="text"
                placeholder="Tìm nội dung hấp dẫn..."
                className="w-full pl-11 pr-11 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm group-hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-all p-1" aria-label="Search">
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
                    onClick={() => router.push(`/?category=${encodeURIComponent(cat.name)}`)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-all group border border-transparent hover:border-primary/20",
                      category.toLowerCase() === cat.name.toLowerCase()
                        ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary"
                        : "text-slate-600 dark:text-slate-400 hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    <span>{cat.name}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors",
                      category.toLowerCase() === cat.name.toLowerCase()
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

