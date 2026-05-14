'use client';

import { 
  Server, Shield, Database, Award, Rocket, FileCode, User as UserIcon, Cloud, 
  Cpu, Terminal, Activity, Layers, Globe, Settings, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AboutSection() {
  const stats = [
    { label: 'Năm kinh nghiệm', value: '7+', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Dự án triển khai', value: '50+', icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Chứng chỉ chuyên môn', value: '10+', icon: FileCode, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Uptime duy trì', value: '99.9%', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const skillGroups = [
    {
      category: "Infrastructure & Virtualization",
      icon: Layers,
      skills: ["VMware ESXi & vCenter", "OpenStack", "Proxmox", "KVM", "CEPH Storage", "Docker & Kubernetes"]
    },
    {
      category: "Operating Systems",
      icon: Terminal,
      skills: ["Linux (Ubuntu, CentOS, Debian)", "Oracle Linux", "Windows Server", "OpenVMS"]
    },
    {
      category: "Networking & Security",
      icon: Shield,
      skills: ["Firewalls (Sophos, Fortinet, pfSense)", "VPN & HA", "Wazuh Security Monitoring", "CVE Patching", "Web Security (Modsecurity)"]
    },
    {
      category: "Automation & DevOps",
      icon: Cpu,
      skills: ["Python & Bash Scripting", "Ansible & Terraform", "Git & GitLab CI/CD", "Jenkins", "Harbor & Rancher"]
    },
    {
      category: "Monitoring & Logging",
      icon: Activity,
      skills: ["Prometheus & Grafana", "Zabbix", "Nagios", "ELK Stack"]
    },
    {
      category: "Cloud & Web Servers",
      icon: Globe,
      skills: ["AWS (EC2, S3, VPC, IAM)", "Nginx & Apache", "HAProxy", "Nextcloud Private Cloud"]
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-white dark:bg-slate-950 overflow-hidden relative border-t border-slate-100 dark:border-slate-800">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 -z-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-20">
          <div className="lg:w-3/5">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6 animate-fade-in border border-primary/20 shadow-sm">
              <span className="relative flex h-2 w-2 mr-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Về tôi
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
              Kỹ sư Hệ thống & <br />
              <span className="text-primary italic font-display">Chuyên gia Tự động hóa</span>
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-3xl italic--vibrant font-medium">
              Tôi là <span className="font-bold text-slate-900 dark:text-white">Lưu Đình Mác</span>, một Kỹ sư Hệ thống với kinh nghiệm vận hành các hạ tầng công nghệ trọng yếu. 
              Tôi chuyên sâu về Linux, ảo hóa, và Cloud Native, luôn tập trung vào <span className="text-primary font-bold">Tính sẵn sàng cao (High Availability)</span> và <span className="text-primary font-bold">Tối ưu hóa vận hành</span> thông qua tự động hóa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#resume" className="px-7 py-3.5 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center group text-sm">
                Hành trình chuyên môn
                <Rocket size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/projects" className="px-7 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center text-sm">
                Dự án tiêu biểu
              </Link>
            </div>
          </div>
          
          <div className="lg:w-2/5 relative w-full max-w-sm lg:max-w-none mx-auto">
             <div className="relative z-10 rounded-[2rem] overflow-hidden border-[8px] border-white dark:border-slate-900 shadow-2xl group">
                <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-600/5 group-hover:opacity-60 transition-opacity" />
                  <UserIcon size={140} className="text-slate-300 dark:text-slate-700 relative z-10 transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Focus Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-3.5 glass rounded-xl border border-white/20 backdrop-blur-xl z-20 transform translate-y-3 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100 duration-500">
                    <p className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-0.5">Current Focus</p>
                    <p className="text-xs font-semibold text-primary">Kubernetes & DevOps Automation</p>
                  </div>
                </div>
             </div>
             {/* Decorative Elements */}
             <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -z-10" />
             <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>

        {/* Professional Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="glass p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary/20 transition-all text-center group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all group-hover:scale-110 shadow-inner", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{stat.value}</h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Skill Categorization */}
        <div className="mb-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Hệ sinh thái Kỹ năng</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Tập hợp các công nghệ và giải pháp tôi đã triển khai và vận hành thực tế.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {skillGroups.map((group, i) => (
              <div key={i} className="group p-6 md:p-8 glass rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <group.icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, si) => (
                    <span key={si} className="px-3 py-1.5 bg-slate-50/80 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 rounded-lg text-[11px] font-bold border border-slate-100 dark:border-slate-800 hover:text-primary transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Professional Commitment */}
        <div className="mt-16 p-8 md:p-10 rounded-[2rem] glass relative overflow-hidden border border-primary/10 group">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-6 transition-transform duration-700">
             <Settings size={140} />
           </div>
           <div className="relative z-10 max-w-3xl">
             <h4 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-5 italic tracking-tight leading-snug">
               &quot;Duy trì tính sẵn sàng cao không chỉ là mục tiêu kỹ thuật, mà là cam kết đối với sự ổn định của hệ thống.&quot;
             </h4>
             <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed italic--vibrant font-medium">
               Trong kỷ nguyên Cloud Native, việc không ngừng cập nhật các công nghệ như Kubernetes, Terraform và kiến trúc HA là chìa khóa để xây dựng các hệ thống hiện đại, bảo mật và hiệu quả.
             </p>
           </div>
        </div>
      </div>
    </section>
  );
}

