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

export default function CoursesPage() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Certificates */}
          <div className="flex-grow lg:w-2/3">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
              Học vấn & <span className="text-primary">Chứng chỉ</span>
            </h1>
            <div className="mb-12 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Đại học Sư phạm Kỹ thuật TP.HCM</h3>
               <p className="text-primary font-medium mb-2">Kỹ sư Công nghệ Thông tin</p>
               <p className="text-sm text-slate-500">Giai đoạn: 2014 - 2019</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certificates.map((cert, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] flex flex-col hover-lift group">
                  <div className={cn("p-4 rounded-2xl w-fit mb-6", cert.bg)}>
                    <cert.icon className={cert.color} size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">{cert.issuer}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Năm: {cert.date}</span>
                    <CheckCircle2 size={16} className="text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Roadmap */}
          <div className="lg:w-1/3">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3 mb-8">
                <BookOpen size={24} className="text-primary" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Lộ trình học tập</h2>
              </div>

              <div className="space-y-8">
                {roadmap.map((item, i) => (
                  <div key={i} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:z-10 after:content-[''] after:absolute after:left-0.5 after:top-4 after:w-px after:h-full after:bg-slate-200 dark:after:bg-slate-800 last:after:hidden">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-bold uppercase text-primary tracking-widest">{item.status}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-10 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                Kết nối học tập
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
