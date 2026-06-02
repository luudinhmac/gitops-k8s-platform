'use client';

import { useState } from 'react';
import { Sparkles, ArrowLeft, Mail, Shield, Terminal, Cpu, Network } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const topics = [
    {
      icon: <Cpu className="text-blue-500" size={22} />,
      title: "Docker & Kubernetes",
      desc: "Xây dựng, đóng gói và vận hành hệ thống container thực chiến ở quy mô lớn."
    },
    {
      icon: <Terminal className="text-emerald-500" size={22} />,
      title: "CI/CD Automation",
      desc: "Tự động hóa toàn bộ quy trình tích hợp và triển khai liên tục."
    },
    {
      icon: <Shield className="text-purple-500" size={22} />,
      title: "Linux & Cloud Security",
      desc: "Bảo mật hệ thống Linux, phòng thủ chủ động và cấu hình hardening hạ tầng."
    },
    {
      icon: <Network className="text-amber-500" size={22} />,
      title: "Infrastructure as Code",
      desc: "Quản lý và tự động hóa triển khai hạ tầng đám mây với Terraform & Ansible."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-500/5 dark:bg-blue-500/3 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto px-4 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-[0.25em] mb-8 border border-primary/20 animate-pulse">
          <Sparkles size={12} className="text-primary" />
          <span>COMING SOON</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          Nền tảng Học tập <br />
          <span className="text-primary italic">Đang được phát triển</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
          Hệ thống bài giảng và các lộ trình chuyên sâu về <span className="font-semibold text-slate-800 dark:text-slate-200">DevOps, Cloud & System Administration</span> đang được xây dựng hoàn thiện để sớm ra mắt.
        </p>

        {/* Newsletter Form */}
        <div className="max-w-md mx-auto mb-16 p-6 rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-100/50 dark:shadow-none">
          {subscribed ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
                <Sparkles size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-950 dark:text-white mb-1">Đăng ký thành công!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Chúng tôi sẽ gửi thông báo cho bạn ngay khi nền tảng được ra mắt.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 text-left flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span>Nhận thông báo khi ra mắt</span>
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all hover:shadow-lg hover:shadow-primary/20 shrink-0"
                >
                  Đăng ký nhận tin
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Grid of Preview Topics */}
        <div className="text-left mb-16">
          <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center mb-8">Nội dung sắp ra mắt</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {topics.map((topic, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {topic.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{topic.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{topic.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>
    </main>
  );
}
