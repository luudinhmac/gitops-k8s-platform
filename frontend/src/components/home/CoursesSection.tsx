'use client';

import { Award, BookOpen, CheckCircle2, Star, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const certificates = [
  {
    title: 'DevOps & DevSecOps Specialist',
    issuer: 'Practical Kubernetes / Certification',
    date: '2024',
    icon: Award,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'DevOps on AWS / Business Cloud',
    issuer: 'Professional Certification',
    date: '2025',
    icon: Star,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    title: 'CCNA - Networking Specialist',
    issuer: 'VNPRO',
    date: '2017',
    icon: Target,
    color: 'text-red-500',
    bg: 'bg-red-500/10'
  }
];

const roadmap = [
  {
    title: 'Advanced Cloud Architecture',
    description: 'Nghiên cứu sâu về kiến trúc Multi-Cloud và Hybrid Cloud Security.',
    status: 'In Progress'
  },
  {
    title: 'SRE & Platform Engineering',
    description: 'Tự động hóa toàn diện quy trình vận hành với Terraform và GitOps.',
    status: 'Planned'
  }
];

export default function CoursesSection() {
  return (
    <section id="courses" className="py-24 px-4 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-1">
          {/* Left Column: Certificates */}
          <div className="flex-grow lg:w-2/3">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-1">
              Học vấn & <span className="text-primary italic">Chứng chỉ</span>
            </h2>
            <div className="mb-1 p-4 bg-primary/5 rounded-xl border border-primary/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
               <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1">Đại học Sư phạm Kỹ thuật TP.HCM</h3>
               <p className="text-primary font-bold mb-1">Kỹ sư Công nghệ Thông tin</p>
               <p className="text-xs md:text-sm text-slate-500">Giai đoạn: 2014 - 2019</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {certificates.map((cert, i) => (
                <div key={i} className="glass p-2 rounded-xl flex flex-col hover-lift group border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all">
                  <div className={cn("p-2 rounded-xl w-fit mb-2 transition-transform group-hover:scale-110", cert.bg)}>
                    <cert.icon className={cert.color} size={32} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm mb-4">{cert.issuer}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Năm: {cert.date}</span>
                    <CheckCircle2 size={16} className="text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Roadmap */}
          <div className="lg:w-1/3">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 sticky top-12">
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen size={24} className="text-primary" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Lộ trình học tập</h2>
              </div>

              <div className="space-y-1">
                {roadmap.map((item, i) => (
                  <div key={i} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:z-10 after:content-[''] after:absolute after:left-0.5 after:top-4 after:w-px after:h-full after:bg-slate-200 dark:after:bg-slate-800 last:after:hidden">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-bold uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-md">{item.status}</span>
                    </div>
                    <h4 className="text-md md:text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-10 py-4 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
                Kết nối học tập
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
