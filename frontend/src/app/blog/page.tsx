'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, ChevronRight, Search, Tag, Eye, MessageCircle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BlogListPage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const calculateReadTime = (content: string) => {
    const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    const time = Math.ceil(words / 200);
    return time < 1 ? 1 : time;
  };

  const handleLike = async (postId: number) => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để lưu bài viết vào yêu thích.');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      
      setPosts(currentPosts => currentPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: data.liked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 1) - 1)
          }
        }
        return p;
      }));
      
      setLikedPosts(prev => {
        const next = new Set(prev);
        if (data.liked) next.add(postId);
        else next.delete(postId);
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, { cache: 'no-store' }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { cache: 'no-store' })
        ]);
        
        const postsData = await postsRes.json();
        const catsData = await catsRes.json();
        
        setPosts(Array.isArray(postsData) ? postsData : []);
        setCategories(Array.isArray(catsData) ? catsData : []);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? post.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
              Blog & Kiến thức
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Nơi chia sẻ những kinh nghiệm thực tế, các bài hướng dẫn kỹ thuật và góc nhìn về công nghệ.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold transition-all",
                selectedCategory === null 
                  ? "bg-primary text-white shadow-lg shadow-primary/30" 
                  : "bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              )}
            >
              Tất cả bài viết
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-bold transition-all",
                  selectedCategory === cat.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/30" 
                    : "bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-[2rem] p-6 h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article 
                key={post.id} 
                className="group glass rounded-[2.5rem] overflow-hidden hover-lift flex flex-col h-full"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary">
                      {post.Category?.name || 'Chưa phân loại'}
                    </span>
                  </div>
                  {/* Placeholder for images if not exists */}
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/20 flex items-center justify-center">
                    <Tag size={48} className="text-primary/20" />
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center space-x-4 mb-4 text-xs font-bold text-slate-500">
                    <span className="flex items-center px-2 py-1 rounded-md text-blue-500 bg-blue-500/10">
                      <Eye size={14} className="mr-1.5" />
                      {post.views || 0}
                    </span>
                    <span className="flex items-center px-2 py-1 rounded-md text-emerald-500 bg-emerald-500/10">
                      <MessageCircle size={14} className="mr-1.5" />
                      {post._count?.Comment || 0}
                    </span>
                    <button 
                      onClick={(e) => { e.preventDefault(); handleLike(post.id); }}
                      className={cn(
                        "flex items-center px-2 py-1 rounded-md transition-colors",
                        likedPosts.has(post.id) ? "text-pink-500 bg-pink-500/10" : "text-pink-400 bg-pink-400/5 hover:bg-pink-400/10"
                      )}
                    >
                      <Heart size={14} className={cn("mr-1.5", likedPosts.has(post.id) ? "fill-current" : "")} />
                      {post.likes || 0}
                    </button>
                    <span className="flex items-center ml-auto">
                      <Clock size={14} className="mr-1.5" />
                      {calculateReadTime(post.content || '')} phút đọc
                    </span>
                  </div>

                  <Link href={`/blog/${post.id}`}>
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 text-slate-900 dark:text-white hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">
                    {post.content?.replace(/<[^>]*>/g, '') || 'Nhấp vào tiêu đề để bắt đầu đọc nội dung chi tiết của bài viết...'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy bài viết</h3>
            <p className="text-slate-500">Hãy thử tìm kiếm với từ khóa khác.</p>
          </div>
        )}
      </div>
    </div>
  );
}
