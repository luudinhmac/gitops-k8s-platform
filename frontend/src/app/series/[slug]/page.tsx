'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { Layers, Calendar, Eye, ChevronRight, ArrowLeft, Loader2, Sparkles, BookOpen, Clock } from 'lucide-react';
import AnimateList from '@/components/ui/AnimateList';
import Button from '@/components/ui/Button';
import IconBadge from '@/components/ui/IconBadge';
import Badge from '@/components/common/Badge';
import FormattedDate from '@/components/common/FormattedDate';

// Modular Services
import { seriesService } from '@/services/seriesService';

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

  const fetchData = useCallback(async () => {
    try {
      const data = await seriesService.getBySlug(slug);
      setSeries(data);
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="pt-40 pb-12 px-4 min-h-screen text-center bg-slate-50/30 dark:bg-slate-950/30">
        <Loader2 size={40} className="animate-spin text-primary mx-auto mb-6" />
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 animate-pulse mx-auto rounded-2xl mb-4" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 animate-pulse mx-auto rounded-lg" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="pt-48 pb-12 px-4 text-center bg-slate-50/30 dark:bg-slate-950/30 min-h-screen">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
           <Layers size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-4 font-display text-slate-900 dark:text-white">Series không tồn tại</h2>
        <p className="text-slate-500 mb-8">Nội dung này có thể đã bị gỡ bỏ hoặc không khả dụng.</p>
        <Button href="/" variant="primary">Quay lại trang chính</Button>
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
          <span className="text-slate-400 font-bold uppercase tracking-widest">SERIES KIẾN THỨC</span>
        </nav>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-primary/10 text-primary rounded-2xl text-[10px] font-bold uppercase tracking-widest mb-8 border border-primary/10 shadow-sm">
              <Sparkles size={14} />
              <span>Series bài viết chuyên sâu</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {series.name}
            </h1>
            
            {series.description && (
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                {series.description}
              </p>
            )}
            
            <div className="mt-10 flex flex-wrap items-center justify-center md:justify-start gap-6 border-t border-slate-50 dark:border-slate-800/50 pt-8">
               <div className="flex items-center text-sm font-bold text-slate-500 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <BookOpen size={18} />
                  </div>
                  <span className="text-primary mr-1.5">{series.Post?.length || 0}</span> bài viết chuyên môn
               </div>
               
               <div className="flex items-center text-sm font-bold text-slate-500 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                    <Eye size={18} />
                  </div>
                  <span className="text-amber-500 mr-1.5">{series.Post?.reduce((acc, p) => acc + (p.views || 0), 0)}</span> tổng lượt xem
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 ml-1">Lộ trình học tập ({series.Post?.length || 0} bài)</h2>
          <AnimateList className="space-y-5">
            {series.Post && series.Post.length > 0 ? (
              series.Post.map((post, index) => (
                <Link key={post.id} href={`/${post.Category?.slug || 'uncategorized'}/${post.slug}`} className="block group">
                  <article className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/5 flex items-center group-hover:-translate-y-1 duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400 font-bold text-xl mr-6 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6 shadow-inner border border-white dark:border-slate-800">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                         <Badge type="category" size="xs">{post.Category?.name || 'Kỹ thuật'}</Badge>
                         {index === 0 && <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase">Bắt đầy tại đây</span>}
                      </div>
                      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap items-center mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-6">
                         <FormattedDate date={post.created_at} showIcon iconSize={12} className="text-slate-400" />
                         <span className="flex items-center"><Eye size={12} className="mr-2 text-primary" /> {post.views} lượt xem</span>
                         <span className="flex items-center"><Clock size={12} className="mr-2" /> {post.readTime || 5} PHÚT ĐỌC</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-primary transition-all transform group-hover:translate-x-2">
                      <ChevronRight size={24} className="text-slate-300 group-hover:text-white transition-all" />
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800 text-slate-400">
                 <div className="mb-4 opacity-20"><BookOpen size={48} className="mx-auto" /></div>
                 <p className="font-bold text-xs uppercase tracking-widest">Chưa có bài viết nào</p>
                 <p className="text-[10px] mt-2">Series này hiện đang được hoàn thiện nội dung.</p>
              </div>
            )}
          </AnimateList>
        </div>
      </div>
    </div>
  );
}

