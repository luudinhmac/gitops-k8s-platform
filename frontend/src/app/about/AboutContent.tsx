'use client';

import Link from 'next/link';
import { ChevronRight, Terminal, Database, Sparkles, Cloud, Shield, Cpu, Activity, Download, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import AboutSection from '@/components/home/AboutSection';
import ResumeTimeline from '@/components/home/ResumeTimeline';
import ProjectsSection from '@/components/home/ProjectsSection';

const services = [
  {
    title: 'Cloud & Virtualization',
    desc: 'Thiết kế và vận hành hệ thống ảo hóa Proxmox, VMware và OpenStack sẵn sàng cao.',
    icon: Cloud,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'DevOps & Automation',
    desc: 'Tự động hóa hạ tầng với Ansible, Terraform và xây dựng pipeline CI/CD hiện đại.',
    icon: Cpu,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'Security & Hardening',
    desc: 'Triển khai giải pháp bảo mật, giám sát Wazuh và tối ưu hóa Firewall cho doanh nghiệp.',
    icon: Shield,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10'
  }
];

export default function AboutContent() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-24 px-4 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center relative z-10">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-800 mb-6 animate-fade-in group hover:border-primary/30 transition-all cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">Open for collaborations</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tighter leading-[1.1]">
              Professional <br />
              <span className="text-primary italic">Portfolio & CV</span>
            </h1>

            <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up delay-200 italic--vibrant font-medium">
              Khám phá hành trình kỹ thuật của <span className="text-slate-900 dark:text-white font-bold underline underline-offset-4 decoration-primary/30">Lưu Đình Mác</span> — từ vận hành NOC đến kiến trúc hạ tầng Cloud Native.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-slide-up delay-300">
              <Link href="#resume" className="group px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm">
                Hồ sơ năng lực
                <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-3">
                <a href="/Luu_Dinh_Mac_CV_EN.pdf" download className="p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-md group">
                   <Download size={18} className="group-hover:text-primary transition-colors" />
                </a>
                <Link href="#projects" className="px-6 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-md text-sm">
                  Dự án nổi bật
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4 bg-slate-50/80 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={cn(
                  "p-7 rounded-3xl glass hover-lift group animate-slide-up bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800/50",
                  index === 0 ? "delay-100" : index === 1 ? "delay-200" : "delay-300"
                )}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner", service.bg, service.color)}>
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 italic italic--vibrant tracking-tight">
                  {service.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section id="about" className="scroll-mt-16"><AboutSection /></section>
      <section id="resume" className="scroll-mt-16"><ResumeTimeline /></section>
      <section id="projects" className="scroll-mt-16"><ProjectsSection /></section>


      {/* Interactive CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-6 shadow-xl shadow-primary/30 animate-bounce">
            <Sparkles size={32} />
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-slate-900 dark:text-white tracking-tight">
            Bạn có dự án cần <br /> <span className="text-primary italic">giải pháp hạ tầng tối ưu?</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Tôi luôn sẵn sàng thảo luận về các kiến trúc High Availability, tự động hóa DevOps hoặc bảo mật hệ thống.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 text-sm">
              Liên hệ tư vấn
              <Activity size={18} className="ml-2" />
            </button>
            <Link href="mailto:luumac2801@gmail.com" className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-md text-sm">
              Gửi Email
              <Globe size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

