'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Layers, Calendar, Eye, ChevronRight, ArrowLeft } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  slug: string;
  created_at: string;
  views: number;
  readTime: number;
  Category: { name: string; slug: string } | null;
  User: { fullname: string; username: string };
  series_order: number;
}

interface Series {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  Post: Post[];
}

export default function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/series/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setSeries(data);
        }
      } catch (error) {
        console.error('Error fetching series:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-12 px-4 min-h-screen max-w-4xl mx-auto text-center">
        <div className="h-10 w-64 bg-slate-100 dark:bg-slate-800 animate-pulse mx-auto rounded-xl mb-4" />
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 animate-pulse mx-auto rounded-lg" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="pt-48 pb-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4 font-display">Series không tồn tại</h2>
        <Link href="/" className="text-primary hover:underline">Quay lại trang chính</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-8 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center space-x-4 mb-8 text-sm">
          <Link href="/" className="group flex items-center text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại Home
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Series</span>
        </nav>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 md:p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              <Layers size={14} />
              <span>Series bài viết</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
              {series.name}
            </h1>
            {series.description && (
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl">
                {series.description}
              </p>
            )}
            <div className="mt-8 flex items-center text-sm font-bold text-slate-400">
               <span className="text-primary">{series.Post?.length || 0}</span> bài viết trong series này
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {series.Post && series.Post.length > 0 ? (
            series.Post.map((post, index) => (
              <Link key={post.id} href={`/${post.Category?.slug || 'uncategorized'}/${post.slug}`} className="block group">
                <article className="glass p-5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-lg mr-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                       <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{post.Category?.name || 'Kỹ thuật'}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest space-x-4">
                       <span className="flex items-center"><Calendar size={12} className="mr-1.5" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                       <span className="flex items-center"><Eye size={12} className="mr-1.5" /> {post.views} lượt xem</span>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
               Chưa có bài viết nào trong series này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
