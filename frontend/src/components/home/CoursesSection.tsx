'use client';

import { Award, BookOpen, CheckCircle2, Sparkles, GraduationCap, Laptop, Users, ArrowRight, Lock, PlayCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const upcomingCourses = [
  {
    title: 'Kubernetes for SREs',
    level: 'Advanced',
    duration: '24h Content',
    students: 'Upcoming',
    image: '/lms-preview.png'
  },
  {
    title: 'Terraform & Infrastructure as Code',
    level: 'Intermediate',
    duration: '12h Content',
    students: 'Planned',
    image: '/lms-preview.png'
  }
];

const features = [
  {
    title: 'Lab Hạ tầng Thực tế',
    desc: 'Hệ thống bài Lab thực chiến trên Proxmox, K8s và VMware.',
    icon: Laptop,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'Lộ trình DevOps & SRE',
    desc: 'Từ Zero đến SRE với lộ trình bài bản về Automation.',
    icon: GraduationCap,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  }
];

export default function CoursesSection() {
  return (
    <section id="courses" className="py-24 px-4 bg-slate-50/50 dark:bg-slate-900/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-primary/20">
            <Sparkles size={12} className="animate-pulse" />
            <span>Chức năng đang phát triển</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
            Nền tảng <span className="text-primary italic">Học thuật & Lab</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Một hệ sinh thái đào tạo kỹ thuật chuyên sâu, nơi bạn không chỉ học lý thuyết mà còn được thực hành trực tiếp trên các hạ tầng Lab chuẩn doanh nghiệp.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: Platform Preview */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden aspect-video">
                <Image 
                  src="/lms-preview.png" 
                  alt="LMS Platform Preview" 
                  fill 
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-8">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Preview</div>
                    <p className="text-white font-bold text-lg md:text-xl">DevOps Learning Hub v1.0</p>
                  </div>
                  <p className="text-slate-300 text-sm max-w-md">Giao diện học tập trực quan với tích hợp Terminal Lab và hệ thống theo dõi tiến độ thời gian thực.</p>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md">
                     <PlayCircle size={40} />
                   </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary/20 transition-all group">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", feature.bg, feature.color)}>
                    <feature.icon size={22} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Upcoming Courses & Waitlist */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <BookOpen size={20} className="text-primary mr-2" />
              Khóa học dự kiến
            </h3>

            <div className="space-y-4">
              {upcomingCourses.map((course, i) => (
                <div key={i} className="glass p-4 rounded-2xl border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                       <Image src={course.image} alt={course.title} fill className="object-cover" />
                       <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                         <Lock size={16} className="text-white/70" />
                       </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{course.title}</h4>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-500">
                        <span className="flex items-center"><Clock size={10} className="mr-1" /> {course.duration}</span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-primary font-bold uppercase">{course.level}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 rounded-[2rem] bg-primary text-white shadow-2xl shadow-primary/30 relative overflow-hidden group mt-8">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                 <Sparkles size={100} />
               </div>
               <h4 className="text-xl font-bold mb-3">Tham gia Waitlist</h4>
               <p className="text-white/80 text-sm mb-6 leading-relaxed">Đăng ký để nhận thông báo sớm nhất khi nền tảng ra mắt và nhận ưu đãi đặc biệt cho 100 học viên đầu tiên.</p>
               <div className="flex space-x-2">
                 <input 
                   id="waitlist-email"
                   name="waitlist-email"
                   type="email" 
                   placeholder="Email của bạn" 
                   className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-white/50 outline-none focus:bg-white/20 transition-all"
                 />
                 <button className="bg-white text-primary p-3 rounded-xl hover:bg-slate-100 transition-colors">
                   <ArrowRight size={20} />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

