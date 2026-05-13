'use client';

import { cn } from '@/lib/utils';

interface SeoScoreProps {
  score: number;
}

export default function SeoScore({ score }: SeoScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-red-500 stroke-red-500';
  };

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="40"
            className="fill-none stroke-slate-200 dark:stroke-slate-800 stroke-[8]"
          />
          <circle
            cx="64"
            cy="64"
            r="40"
            className={cn("fill-none stroke-[8] transition-all duration-1000 ease-out", getScoreColor())}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-black tracking-tighter", getScoreColor().split(' ')[0])}>
            {score}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Score</span>
        </div>
      </div>
      
      <div className="mt-4 px-6 text-center">
        <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">SEO Overall</p>
        <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">
          {score >= 80 ? 'Tuyệt vời! Bài viết đã được tối ưu hóa rất tốt.' : 
           score >= 50 ? 'Khá tốt, hãy cải thiện một vài điểm bên dưới.' : 
           'Cần cải thiện nhiều để tăng khả năng hiển thị.'}
        </p>
      </div>
    </div>
  );
}
