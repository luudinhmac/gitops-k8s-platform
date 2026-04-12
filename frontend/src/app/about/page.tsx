'use client';

import { 
  Server, Shield, Terminal, Zap, Code2, Layers, Cpu, Globe, Rocket, Github, Cloud, Database, 
  Workflow, CheckCircle2, ChevronRight, Award, FileCode, Coffee, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { label: 'Năm kinh nghiệm', value: '4+', icon: Award, color: 'text-blue-500' },
    { label: 'Dự án đã triển khai', value: '2d+', icon: Rocket, color: 'text-indigo-500' },
    { label: 'Chứng chỉ chuyên môn', value: '15+', icon: FileCode, color: 'text-purple-500' },
    { label: 'Tách trà mỗi năm', value: '1000+', icon: Coffee, color: 'text-amber-500' },
  ];

  const technologies = [
    {
      category: "Infrastructure & DevOps",
      icon: Server,
      skills: ["Linux (CentOS, Ubuntu)", "Docker & K8s", "Ansible", "CI/CD (GitLab, Jenkins)", "Nginx / Apache"]
    },
    {
      category: "Public Cloud",
      icon: Cloud,
      skills: ["AWS", "Google Cloud", "DigitalOcean", "Cloudflare"]
    },
    {
      category: "System Security",
      icon: Shield,
      skills: ["Hardening Linux", "WAF & Firewall", "SSL/TLS Optimization", "Security Auditing"]
    },
    {
      category: "Databases & Monitoring",
      icon: Database,
      skills: ["PostgreSQL", "MariaDB", "Redis", "Prometheus & Grafana", "Zabbix"]
    }
  ];

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <section className="mb-24">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="md:w-1/2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                <span className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                About Me
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                System Engineer <br />
                <span className="text-primary">& Automation Enthusiast</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                Xin chào! Tôi là Lưu Đình Mác, một kỹ sư hệ thống với niềm đam mê sâu sắc trong việc xây dựng và tối ưu hóa hạ tầng công nghệ. 
                Với hơn 4 năm kinh nghiệm trong lĩnh vực DevOps và System Admin, tôi tập trung vào việc tạo ra các hệ thống có tính sẵn sàng cao, bảo mật và khả năng mở rộng linh hoạt.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/projects" className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all">
                  Dự án của tôi
                </Link>
                <Link href="#contact" className="px-8 py-4 glass dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50 transition-all">
                  Liên hệ
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
               <div className="relative z-10 rounded-xl overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl">
                  <div className="aspect-square bg-slate-200 animate-pulse" />
                  {/* Thay thế bằng ảnh thật khi có */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-indigo-600/20 flex items-center justify-center">
                    <UserIcon size={120} className="text-primary/40" />
                  </div>
               </div>
               {/* Decorators */}
               <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-24 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/30 transition-all text-center group">
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-slate-50 dark:bg-slate-900 transition-all group-hover:scale-110 shadow-sm", stat.color)}>
                <stat.icon size={28} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Knowledge Area */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Lĩnh vực chuyên môn</h2>
            <p className="text-slate-500">Tôi không ngừng học hỏi và cập nhật những công nghệ tiên tiến nhất để mang lại giải pháp tối ưu cho hệ thống.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {technologies.map((tech, i) => (
              <div key={i} className="group p-8 glass rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <tech.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">{tech.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tech.skills.map((skill, si) => (
                    <span key={si} className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium border border-slate-100 dark:border-slate-800 group-hover:border-primary/10 transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 p-8 glass rounded-xl bg-gradient-to-br from-primary/5 to-indigo-500/5">
             <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 italic">&quot;Duy trì tính sẵn sàng cao là ưu tiên hàng đầu.&quot;</h4>
             <p className="text-slate-500 text-sm leading-relaxed">
               &quot;Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh phúc.&quot; Tôi cam kết tối ưu hóa hạ tầng và tự động hóa quy trình để đạt được hiệu quả vận hành tối đa cho doanh nghiệp.
             </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function UserIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
