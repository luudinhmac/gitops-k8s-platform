'use client';

import CoursesSection from '@/components/home/CoursesSection';
import { Sparkles, GraduationCap, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-primary/20">
          <GraduationCap size={14} />
          <span>Learning Platform</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
          Nâng tầm kỹ năng <br />
          <span className="text-primary italic">Hệ thống & DevOps</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Nơi chia sẻ kiến thức thực chiến, các bài Lab chuyên sâu và lộ trình phát triển dành cho kỹ sư vận hành hạ tầng hiện đại.
        </p>
      </div>

      {/* Reusing the existing CoursesSection but as the main content */}
      <CoursesSection />

      {/* Extra content for a dedicated page */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[2.5rem] glass border border-slate-200 dark:border-slate-800 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 italic tracking-tight">Tài liệu Chuyên môn</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  Truy cập kho tài liệu hướng dẫn về Linux Hardening, Kubernetes Security và Automation Scripting được biên soạn kỹ lưỡng.
                </p>
              </div>
              <button className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform">
                Xem kho tài liệu <ChevronRight size={20} className="ml-1" />
              </button>
            </div>

            <div className="p-10 rounded-[2.5rem] glass border border-slate-200 dark:border-slate-800 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                  <Sparkles size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 italic tracking-tight">Hệ thống Lab Sandbox</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  Trải nghiệm môi trường Lab ảo hóa an toàn để thực hành các kỹ thuật tấn công và phòng thủ hệ thống.
                </p>
              </div>
              <button className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform">
                Đăng ký sử dụng Lab <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
