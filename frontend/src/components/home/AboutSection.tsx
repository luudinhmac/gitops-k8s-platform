'use client';

import { 
  Server, Shield, Database, Award, Rocket, FileCode, Coffee, User as UserIcon, Cloud
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AboutSection() {
  const stats = [
    { label: 'Năm kinh nghiệm', value: '4+', icon: Award, color: 'text-blue-500' },
    { label: 'Dự án đã triển khai', value: '20+', icon: Rocket, color: 'text-blue-500' },
    { label: 'Chứng chỉ chuyên môn', value: '15+', icon: FileCode, color: 'text-sky-500' },
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
    <section id="about" className="py-24 px-4 bg-white dark:bg-slate-950 overflow-hidden relative border-t border-slate-100 dark:border-slate-800">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-24">
          <div className="lg:w-1/2 lg:pr-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6 animate-fade-in shadow-sm">
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Về tôi
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              System Engineer <br />
              <span className="text-primary italic">& Automation Enthusiast</span>
            </h2>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Xin chào! Tôi là Lưu Đình Mác, một kỹ sư hệ thống với niềm đam mê sâu sắc trong việc xây dựng và tối ưu hóa hạ tầng công nghệ. 
              Với hơn 4 năm kinh nghiệm trong lĩnh vực DevOps và System Admin, tôi tập trung vào việc tạo ra các hệ thống có tính sẵn sàng cao, bảo mật và khả năng mở rộng linh hoạt.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#projects" className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all">
                Dự án của tôi
              </Link>
              <Link href="/" className="px-8 py-4 glass dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50 transition-all">
                Đọc Blog
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative w-full max-w-md lg:max-w-none mx-auto">
             <div className="relative z-10 rounded-xl overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl skew-y-0 hover:skew-y-1 transition-transform duration-500">
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-600/20" />
                  <UserIcon size={120} className="text-slate-300 dark:text-slate-700" />
                </div>
             </div>
             <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl -z-10" />
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse -z-10" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-24">
          {stats.map((stat, i) => (
            <div key={i} className="glass p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/30 transition-all text-center group">
              <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-slate-50 dark:bg-slate-900 transition-all group-hover:scale-110 shadow-sm", stat.color)}>
                <stat.icon size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">{stat.value}</h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Knowledge Area */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {technologies.map((tech, i) => (
            <div key={i} className="group p-6 md:p-8 glass rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <tech.icon size={20} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">{tech.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tech.skills.map((skill, si) => (
                  <span key={si} className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 rounded-xl text-xs md:text-sm font-medium border border-slate-100 dark:border-slate-800 group-hover:border-primary/10 transition-all">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-6 md:p-8 glass rounded-xl bg-gradient-to-br from-primary/5 to-blue-500/5 border border-primary/10">
           <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 italic">&quot;Duy trì tính sẵn sàng cao là ưu tiên hàng đầu.&quot;</h4>
           <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-4xl">
             &quot;Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh phúc.&quot; Tôi cam kết tối ưu hóa hạ tầng và tự động hóa quy trình để đạt được hiệu quả vận hành tối đa cho doanh nghiệp.
           </p>
        </div>
      </div>
    </section>
  );
}

