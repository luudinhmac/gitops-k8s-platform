'use client';

import { Search, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import SeoScore from './SeoScore';
import SeoChecklist from './SeoChecklist';
import GooglePreview from './GooglePreview';
import { useSeoAnalyzer } from '../hooks/useSeoAnalyzer';

interface SeoPanelProps {
  formData: {
    title: string;
    slug: string;
    content: string;
    tags: string;
  };
  focusKeyword: string;
  setFocusKeyword: (val: string) => void;
  metaDescription: string;
  setMetaDescription: (val: string) => void;
}

export default function SeoPanel({
  formData,
  focusKeyword,
  setFocusKeyword,
  metaDescription,
  setMetaDescription
}: SeoPanelProps) {
  const analysis = useSeoAnalyzer({
    title: formData.title,
    slug: formData.slug,
    content: formData.content,
    focusKeyword,
    metaDescription
  });

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Score & Overview */}
      <SeoScore score={analysis.score} />

      {/* 2. Keyword Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
          <label htmlFor="pe-focus-keyword" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Từ khóa chính</label>
          <div className="group relative">
            <Info size={12} className="text-slate-300 cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 w-48 p-3 bg-slate-900 text-white text-[9px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
              Từ khóa chính là cụm từ bạn muốn bài viết này xếp hạng cao nhất trên Google.
            </div>
          </div>
        </div>
        <div className="relative group">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            id="pe-focus-keyword"
            type="text" 
            placeholder="Ví dụ: NestJS tutorial..." 
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
          />
        </div>
      </div>

      {/* 3. Meta Description Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
          <label htmlFor="pe-meta-desc" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Mô tả Meta</label>
          <span className={cn(
            "text-[9px] font-bold",
            metaDescription.length > 160 ? "text-red-500" : "text-slate-400"
          )}>
            {metaDescription.length}/160
          </span>
        </div>
        <textarea 
          id="pe-meta-desc"
          rows={3}
          placeholder="Viết mô tả ngắn gọn thu hút người dùng nhấp vào bài viết của bạn..." 
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] leading-relaxed outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-none" 
        />
      </div>

      {/* 4. Google Preview */}
      <GooglePreview 
        title={formData.title}
        slug={formData.slug}
        metaDescription={metaDescription}
      />

      {/* 5. Checklist */}
      <SeoChecklist checks={analysis.checks} />

      {/* 6. Readability Summary */}
      <div className="p-4 bg-slate-900 dark:bg-black rounded-3xl text-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Readability</h4>
          <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded-lg text-emerald-400">{analysis.readability.score}%</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-black">{analysis.readability.wordCount}</p>
            <p className="text-[8px] uppercase tracking-tighter text-slate-500 font-bold">Tổng số từ</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-black">{analysis.readability.readingTime} min</p>
            <p className="text-[8px] uppercase tracking-tighter text-slate-500 font-bold">Thời gian đọc</p>
          </div>
        </div>
      </div>
    </div>
  );
}
