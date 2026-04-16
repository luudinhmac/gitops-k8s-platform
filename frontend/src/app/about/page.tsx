'use client';

import Link from 'next/link';
import { ChevronRight, Terminal, Database, Sparkles, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import AboutSection from '@/components/home/AboutSection';
import ResumeTimeline from '@/components/home/ResumeTimeline';
import ProjectsSection from '@/components/home/ProjectsSection';
import CoursesSection from '@/components/home/CoursesSection';

const services = [
  {
    title: 'Phát triển Backend',
    desc: 'Xây dựng API bảo mật, hiệu năng cao với NestJS và PostgreSQL.',
    icon: Database,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'Làm chủ Frontend',
    desc: 'Tạo ra các giao diện người dùng sống động với Next.js và Tailwind CSS.',
    icon: Terminal,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    title: 'Hạ tầng Đám mây',
    desc: 'Quản lý hệ thống máy chủ và hạ tầng Docker ổn định cho dự án.',
    icon: Cloud,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10'
  }
];

export default function AboutPortfolioPage() {
  return (
    <div suppressHydrationWarning={true} className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-8 lg:pt-36 lg:pb-24 px-4 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div suppressHydrationWarning={true} className="max-w-7xl mx-auto">
          <div suppressHydrationWarning={true} className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Sẵn sàng cho những dự án mới</span>
            </div>

            <h1 className="text-xl md:text-2xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
              Xin chào, tôi là <br />
              <span className="text-primary drop-shadow-sm">LƯU ĐÌNH MÁC</span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 animate-slide-up delay-200">
              chuyên về Hạ tầng Đám mây & Tự động hóa. Tôi xây dựng, tối ưu hóa và duy trì các hệ thống hạ tầng sẵn sàng cao (High Availability) cho doanh nghiệp.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
              <Link href="/about#projects" className="group px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
                Xem các dự án
                <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/" className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                Đọc Blog của tôi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features Grid */}
      <section className="py-12 px-4 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={cn(
                  "p-6 rounded-xl glass hover-lift group animate-slide-up",
                  index === 0 ? "delay-100" : index === 1 ? "delay-200" : "delay-300"
                )}
              >
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", service.bg, service.color)}>
                  <service.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 italic italic--vibrant">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic--vibrant">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <AboutSection />
      </section>

      {/* Resume & Roadmap Section */}
      <section id="resume">
        <ResumeTimeline />
      </section>

      {/* Projects Section */}
      <section id="projects">
        <ProjectsSection />
      </section>

      {/* Courses Section */}
      <section id="courses">
        <CoursesSection />
      </section>

      {/* Stats/Call to Action */}
      <section className="py-16 px-4 relative overflow-hidden text-center">
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white">
            Bắt đầu hành trình <br /> <span className="text-primary">cùng nhau ngay hôm nay.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base mb-10 max-w-2xl mx-auto">
            Sẵn sàng để đưa ý tưởng của bạn thành hiện thực với giải pháp hạ tầng và phần mềm tối ưu.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
            Lên lịch tư vấn
            <Sparkles size={18} className="ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
}
