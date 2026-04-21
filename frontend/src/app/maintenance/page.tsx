'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Rocket, Github, Twitter, Mail, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

function MaintenanceContent() {
  const [clickCount, setClickCount] = useState(0);
  const [showBypass, setShowBypass] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const handleIconClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 >= 5) {
      setShowBypass(true);
      setClickCount(0);
    }
  };

  const checkMaintenanceStatus = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api';
      const response = await axios.get(`${apiUrl}/settings/public?t=${Date.now()}`);
      const isGlobalMaintenance = response.data.maintenance_global === 'true' || response.data.maintenance_global === true;
      
      // If maintenance mode is OFF, redirect back to home or the previous page
      if (!isGlobalMaintenance) {
        router.push(from);
      }
    } catch (err) {
      console.error('Failed to poll maintenance status', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    // Check status once on mount to handle manual visits when maintenance is already OFF
    checkMaintenanceStatus();
  }, [from, router]);

  const handleRequestCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api';
      const response = await axios.post(`${apiUrl}/settings/request-maintenance-code`);
      if (response.data.success) {
        setError('Mã đã được gửi! Vui lòng kiểm tra Telegram/Email/Teams.');
      } else {
        setError(response.data.error || 'Không thể yêu cầu mã. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi yêu cầu mã. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api';
      const response = await axios.post(`${apiUrl}/settings/verify-maintenance-passcode`, { passcode });
      if (response.data.success) {
        setSuccess(true);
        // Set bypass cookie for session (closes when browser closes) or short time
        // User requested: "sau khi admin logout ra thì phải quay về web bảo trì"
        document.cookie = `MAINTENANCE_BYPASS=${passcode}; path=/; samesite=lax`;
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        setError('Mã xác thực không đúng hoặc đã hết hạn.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi xác thực. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 selection:bg-primary/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Animated Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8 relative inline-block cursor-grab active:cursor-grabbing"
          onClick={handleIconClick}
        >
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
          <div className="relative bg-slate-900 border border-white/10 p-8 rounded-[40px] shadow-2xl">
            <ShieldAlert size={80} className="text-primary animate-bounce shadow-primary" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Website đang <span className="text-primary italic">Bảo Trì</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-lg mx-auto leading-relaxed">
            Chúng tôi đang nâng cấp hệ thống để mang lại trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau ít phút nhé! 
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6 mb-12">
            {[
              { icon: Github, label: 'Github', href: 'https://github.com/luudinhmac' },
              { icon: Twitter, label: 'Twitter', href: '#' },
              { icon: Mail, label: 'Contact', href: 'mailto:luumac2801@gmail.com' }
            ].map((social, i) => (
              <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-primary/50 transition-all group">
                <social.icon size={22} className="text-slate-400 group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>

          <div className="h-1 w-24 bg-primary/20 mx-auto rounded-full overflow-hidden relative">
             <motion.div 
               animate={{ x: [-100, 100] }}
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="absolute inset-0 bg-primary w-1/2 rounded-full"
             />
          </div>
        </motion.div>
      </div>

      {/* Bypass Modal */}
      <AnimatePresence>
        {showBypass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-950/60">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-white/10 p-8 rounded-[32px] max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              {success && (
                <div className="absolute inset-0 bg-primary flex flex-col items-center justify-center z-50 text-white animate-in fade-in duration-300">
                  <CheckCircle2 size={60} className="mb-4 animate-bounce" />
                  <span className="font-bold text-lg tracking-widest uppercase">Xác thực thành công</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Lock size={20} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-white text-lg tracking-tight">Admin Bypass</h3>
                </div>
                <button 
                  onClick={() => setShowBypass(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <Rocket size={20} />
                </button>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Nhập mã truy cập</label>
                  <input 
                    type="password" 
                    autoFocus
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-800"
                  />
                </div>

                {error && (
                  <div className={cn(
                    "p-3 border rounded-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-2",
                    error.includes('Mã đã được gửi') 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                      : "bg-red-500/10 border-red-500/20 text-red-500"
                  )}>
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                  onClick={handleRequestCode}
                  className="py-6 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                  isLoading={loading}
                >
                  Yêu cầu mã
                </Button>
                <Button 
                   type="submit" 
                   className="py-6 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                   isLoading={loading}
                >
                  Xác nhận
                </Button>
                </div>
              </form>

              <p className="mt-8 text-center text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                Truy cập chỉ dành cho quản trị viên tối cao
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Credits */}
      <footer className="fixed bottom-10 left-0 right-0 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Powered by Antigravity v2.0</span>
      </footer>
    </main>
  );
}

export default function MaintenancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-primary"><Loader2 className="animate-spin" size={40} /></div>}>
      <MaintenanceContent />
    </Suspense>
  );
}
