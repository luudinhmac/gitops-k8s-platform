'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Calendar, User as UserIcon, Clock, ChevronRight, Eye, Terminal, MessageSquare, Tag as TagIcon, Layout } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  series: string | null;
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

function BlogContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(q);

  useEffect(() => {
    setSearchTerm(q);
  }, [q]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
        ]);

        const postsData = await postsRes.json();
        const catsData = await catsRes.json();

        setPosts(postsData);
        setCategories(catsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group unique series
  const series = Array.from(new Set(posts.map(p => p.series).filter(Boolean))) as string[];

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-6">
            Blog & Kiến thức
          </h3>
          <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Chia sẻ kinh nghiệm về Linux, Cloud, Virtualization và hành trình làm nghề System Engineer.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content (Posts) */}
          <div className="flex-grow lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl h-[350px] animate-pulse border border-slate-100 dark:border-slate-800" />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${post.Category?.slug || 'uncategorized'}/${post.slug}`}
                    className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover-lift shadow-sm hover:shadow-xl transition-all h-full"
                  >
                    {/* Image Container */}
                    <div className="relative h-40 overflow-hidden">
                      {post.cover_image ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${post.cover_image}`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                          <Terminal size={32} className="text-slate-300 dark:text-slate-700" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow">
                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <div className="flex items-center text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                          <UserIcon size={10} className="mr-1" />
                          {post.User?.fullname || 'Ẩn danh'}
                        </div>
                        <div className="flex items-center">
                          <Calendar size={10} className="mr-1 text-primary" />
                          {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
                        </div>
                        <div className="flex items-center">
                          <Eye size={10} className="mr-1 text-primary" />
                          {post.views || 0}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare size={10} className="mr-1 text-primary" />
                          0
                        </div>
                      </div>

                      <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>

                      {/* Badges moved below title */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {post.Category && (
                          <span className="px-2 py-0.5 bg-primary/10 rounded-full text-[8px] font-bold uppercase tracking-wider text-primary">
                            {post.Category.name}
                          </span>
                        )}
                        {post.series && (
                          <span className="px-2 py-0.5 bg-indigo-500/10 rounded-full text-[8px] font-bold uppercase tracking-wider text-indigo-500">
                            Series: {post.series}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 text-[10.5px] line-clamp-2 mb-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex items-center gap-4 pt-3">
                        <div className="flex items-center text-[9px] font-bold text-slate-400 uppercase">
                          <Clock size={10} className="mr-1 text-primary" />
                          {post.readTime || 5} min
                        </div>
                        <div className="text-primary ml-auto group-hover:translate-x-1 transition-transform">
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                <Search size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy bài viết</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Hãy thử tìm kiếm với từ khóa khác.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/4 space-y-8">
            {/* Sidebar Search (Visible on Mobile or as redundant) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center">
                <Search size={14} className="mr-2 text-primary" /> Tìm kiếm
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập từ khóa..."
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/blog?q=${encodeURIComponent(searchTerm)}`);
                    }
                  }}
                />
                <button
                  onClick={() => router.push(`/blog?q=${encodeURIComponent(searchTerm)}`)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  <Search size={14} />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center">
                <Layout size={14} className="mr-2 text-primary" /> Danh mục
              </h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => router.push(`/blog?q=${encodeURIComponent(cat.name)}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:bg-primary/5 hover:text-primary transition-all group"
                  >
                    <span>{cat.name}</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded group-hover:bg-primary/20 transition-colors">
                      {cat._count?.Post || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Latest Series */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center">
                <TagIcon size={14} className="mr-2 text-primary" /> Series mới nhất
              </h4>
              <div className="space-y-2">
                {series.length > 0 ? (
                  series.slice(0, 5).map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/blog?q=${encodeURIComponent(s)}`)}
                      className="w-full text-left px-3 py-2.5 rounded-xl border border-slate-50 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <div className="text-[8px] text-primary uppercase font-bold mb-0.5">Series</div>
                      <div className="line-clamp-1">{s}</div>
                    </button>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 italic">Chưa có chuỗi bài viết nào.</p>
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
    <Suspense fallback={<div className="pt-40 text-center">Đang tải trang blog...</div>}>
      <BlogContent />
    </Suspense>
  );
}
