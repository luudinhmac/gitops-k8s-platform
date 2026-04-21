'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, Globe, Server, Shield, TrendingUp, Save, Loader2, Image as ImageIcon, 
  Trash2, AlertCircle, Check, Link as LinkIcon, Database, HardDrive, ShieldCheck, Lock, ShieldAlert, Key, Send,
  Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Button from '@/components/ui/Button';
import { settingService, SettingsConfig } from '@/services/settingService';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'system' | 'security' | 'marketing' | 'maintenance' | 'alerts'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Settings State mapped from API
  const [settings, setSettings] = useState<SettingsConfig | null>(null);
  
  // Local form states for editable tabs
  const [generalForm, setGeneralForm] = useState<Record<string, string>>({
    site_title: 'LƯU ĐÌNH MÁC | System Engineer',
    site_tagline: 'Portfolio giới thiệu các dự án và kỹ năng chuyên môn về System Engineering và Web Development.',
    default_lang: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    comments_enabled: 'true',
    footer_copyright: '© 2026 Lưu Đình Mác. All rights reserved.',
  });

  const [marketingForm, setMarketingForm] = useState<Record<string, string>>({
    ga_id: '',
    fb_pixel_id: '',
    header_scripts: '',
    footer_scripts: '',
    ads_enabled: 'false',
    adsense_snippet: '',
  });

  const [maintenanceForm, setMaintenanceForm] = useState<Record<string, string>>({
    maintenance_global: 'false',
    maintenance_posts: 'false',
    maintenance_comments: 'false',
    maintenance_passcode: '123456',
  });
  
  const [alertsForm, setAlertsForm] = useState<Record<string, string>>({
    telegram_enabled: 'false',
    telegram_bot_token: '',
    telegram_chat_id: '',
    teams_enabled: 'false',
    teams_webhook_url: '',
    mail_enabled: 'false',
    mail_host: '',
    mail_port: '587',
    mail_user: '',
    mail_pass: '',
    mail_from: '',
    mail_admin_recipient: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingService.getAllSettings();
      setSettings(data);
      
      if (data.dbConfig?.general) {
        setGeneralForm(prev => ({ ...prev, ...data.dbConfig.general }));
      }
      if (data.dbConfig?.marketing) {
        setMarketingForm(prev => ({ ...prev, ...data.dbConfig.marketing }));
      }
      if (data.dbConfig?.maintenance) {
        setMaintenanceForm(prev => ({ ...prev, ...data.dbConfig.maintenance }));
      }
      if (data.dbConfig?.telegram || data.dbConfig?.teams || data.dbConfig?.mail) {
        setAlertsForm(prev => ({ 
          ...prev, 
          ...data.dbConfig.telegram,
          ...data.dbConfig.teams,
          ...data.dbConfig.mail,
        }));
      }
    } catch (error) {
      console.error('Failed to parse settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGroup = async (group: 'general' | 'marketing' | 'maintenance' | 'alerts') => {
    setSaving(true);
    setStatusMsg(null);
    try {
      let targetForm: any;
      if (group === 'general') targetForm = generalForm;
      else if (group === 'marketing') targetForm = marketingForm;
      else if (group === 'alerts') targetForm = alertsForm;
      else targetForm = maintenanceForm;
      
      const items = Object.entries(targetForm).map(([key, value]) => {
        // Decide group based on prefix
        let effectiveGroup: string = group;
        if (group === 'alerts') {
          if (key.startsWith('telegram_')) effectiveGroup = 'telegram';
          else if (key.startsWith('teams_')) effectiveGroup = 'teams';
          else if (key.startsWith('mail_')) effectiveGroup = 'mail';
        }
        
        return {
          key,
          value: String(value),
          group: effectiveGroup,
        };
      });
      
      await settingService.updateSettings(items);
      setStatusMsg({ type: 'success', text: 'Đã lưu cấu hình thành công!' });
      setTimeout(() => setStatusMsg(null), 4000);
      fetchSettings();
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Có lỗi xảy ra khi lưu cấu hình.' });
    } finally {
      setSaving(false);
    }
  };

  const handleFlushCache = async () => {
    try {
      await settingService.flushCache();
      setStatusMsg({ type: 'success', text: 'Đã xóa bộ nhớ đệm (Cache) thành công!' });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi xóa bộ nhớ đệm.' });
    }
  };

  const handleTestTelegram = async () => {
    if (!alertsForm.telegram_bot_token || !alertsForm.telegram_chat_id) {
       setStatusMsg({ type: 'error', text: 'Vui lòng nhập Token và Chat ID trước khi test.' });
       return;
    }
    setTesting(true);
    setStatusMsg(null);
    try {
       const result = await settingService.testTelegram(alertsForm.telegram_bot_token, alertsForm.telegram_chat_id);
       if (result.success) {
         setStatusMsg({ type: 'success', text: 'Đã gửi tin nhắn test thành công! Hãy kiểm tra Telegram.' });
       } else {
         setStatusMsg({ type: 'error', text: `Lỗi: ${result.error?.description || 'Không thể gửi tin'}` });
       }
    } catch (error) {
       setStatusMsg({ type: 'error', text: 'Lỗi kết nối tới Telegram API.' });
    } finally {
       setTesting(false);
    }
  };

  const handleTestTeams = async () => {
    if (!alertsForm.teams_webhook_url) {
       setStatusMsg({ type: 'error', text: 'Vui lòng nhập Webhook URL trước khi test.' });
       return;
    }
    setTesting(true);
    setStatusMsg(null);
    try {
       const result = await settingService.testTeams(alertsForm.teams_webhook_url);
       if (result.success) {
         setStatusMsg({ type: 'success', text: 'Đã gửi tin nhắn test thành công! Hãy kiểm tra MS Teams.' });
       } else {
         setStatusMsg({ type: 'error', text: `Lỗi: ${result.error || 'Không thể gửi tin'}` });
       }
    } catch (error) {
       setStatusMsg({ type: 'error', text: 'Lỗi kết nối tới MS Teams Webhook.' });
    } finally {
       setTesting(false);
    }
  };

  const handleTestEmail = async () => {
    const { mail_host, mail_port, mail_user, mail_pass, mail_admin_recipient } = alertsForm;
    if (!mail_host || !mail_port || !mail_user || !mail_pass || !mail_admin_recipient) {
       setStatusMsg({ type: 'error', text: 'Vui lòng nhập đầy đủ cấu hình Email và người nhận trước khi test.' });
       return;
    }
    setTesting(true);
    setStatusMsg(null);
    try {
       const result = await settingService.testEmail({
         host: mail_host,
         port: mail_port,
         user: mail_user,
         pass: mail_pass,
         to: mail_admin_recipient
       });
       if (result.success) {
         setStatusMsg({ type: 'success', text: 'Đã gửi Email test thành công! Hãy kiểm tra hộp thư của bạn.' });
       } else {
         setStatusMsg({ type: 'error', text: `Lỗi: ${result.error || 'Không thể gửi Email'}` });
       }
    } catch (error) {
       setStatusMsg({ type: 'error', text: 'Lỗi kết nối tới máy chủ Email.' });
    } finally {
       setTesting(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Cấu hình Website', icon: Globe },
    { id: 'maintenance', label: 'Bảo trì hệ thống', icon: ShieldAlert },
    { id: 'system', label: 'Hệ thống (System)', icon: Server },
    { id: 'security', label: 'Bảo mật & Users', icon: Shield },
    { id: 'marketing', label: 'Marketing & SEO', icon: TrendingUp },
    { id: 'alerts', label: 'Cảnh báo Admin', icon: Send },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader 
        title="Tính năng Cài đặt (Settings)"
        subtitle="Quản lý toàn bộ cấu hình lõi, SEO, và biến môi trường của hệ thống"
      />

      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-0">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 last:mb-0",
                  activeTab === tab.id 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <tab.icon size={18} className="mr-3 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 max-w-4xl">
          {statusMsg && (
            <div className={cn(
              "mb-6 p-4 rounded-2xl flex items-center shadow-sm text-sm font-bold border animate-in slide-in-from-top-2",
              statusMsg.type === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
            )}>
              {statusMsg.type === 'success' ? <Check size={18} className="mr-2" /> : <AlertCircle size={18} className="mr-2" />}
              {statusMsg.text}
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-300">
            {/* TAB: GENERAL */}
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Giao diện & Nội dung</h2>
                  <p className="text-sm text-slate-500 mb-6">Thay đổi diện mạo, tên trang web và các chuỗi hiển thị công khai.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tên Website (Site Title)</label>
                    <input type="text" value={generalForm.site_title || ''} onChange={e => setGeneralForm({...generalForm, site_title: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mô tả ngắn (Tagline/Meta)</label>
                    <textarea value={generalForm.site_tagline || ''} onChange={e => setGeneralForm({...generalForm, site_tagline: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all min-h-[80px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ngôn ngữ mặc định</label>
                    <select value={generalForm.default_lang || 'vi'} onChange={e => setGeneralForm({...generalForm, default_lang: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Múi giờ (Timezone)</label>
                    <select value={generalForm.timezone || 'Asia/Ho_Chi_Minh'} onChange={e => setGeneralForm({...generalForm, timezone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                      <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div className="space-y-2 col-span-1 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={generalForm.comments_enabled === 'true'} onChange={e => setGeneralForm({...generalForm, comments_enabled: e.target.checked ? 'true' : 'false'})} className="rounded text-primary focus:ring-primary h-5 w-5 border-slate-300" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Bật bình luận toàn trang</p>
                        <p className="text-[10px] text-slate-400">Cho phép người dùng tương tác</p>
                      </div>
                    </label>
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2 mt-4">
                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bản quyền Footer (Copyright)</label>
                     <input type="text" value={generalForm.footer_copyright || ''} onChange={e => setGeneralForm({...generalForm, footer_copyright: e.target.value})} placeholder="© 2026 Lưu Đình Mác..."
                       className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                  <Button onClick={() => handleSaveGroup('general')} isLoading={saving} size="lg">
                    <Save size={18} className="mr-2" /> Lưu cấu hình
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: SYSTEM */}
            {activeTab === 'system' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Hệ thống & DevOps</h2>
                    <p className="text-sm text-slate-500">Cấu hình lấy từ `.env` (Chỉ đọc để bảo mật).</p>
                  </div>
                  <Button variant="outline" onClick={handleFlushCache} className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100" size="sm">
                    <Trash2 size={16} className="mr-2" /> Xóa bộ nhớ đệm (Flush Cache)
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Env Section */}
                  <div className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-2xl space-y-4">
                    <div className="flex items-center text-primary mb-2">
                       <LinkIcon size={18} className="mr-2" />
                       <h3 className="font-bold">Biến môi trường (.env)</h3>
                    </div>
                    {settings?.envConfig && Object.entries(settings.envConfig).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm border-b border-slate-200/50 dark:border-slate-800/50 pb-2 last:border-0 last:pb-0">
                        <span className="font-medium font-mono text-slate-500 text-[11px]">{key}</span>
                        <span className={cn("font-bold", value === '********' ? 'text-amber-500' : 'text-slate-900 dark:text-white')}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* System Info Section */}
                  <div className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-2xl space-y-4">
                    <div className="flex items-center text-sky-500 mb-2">
                       <HardDrive size={18} className="mr-2" />
                       <h3 className="font-bold">Thông tin Máy chủ</h3>
                    </div>
                    {settings?.systemInfo && Object.entries(settings.systemInfo).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm border-b border-slate-200/50 dark:border-slate-800/50 pb-2 last:border-0 last:pb-0">
                        <span className="font-medium text-slate-500 capitalize text-xs">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300 flex items-start mt-6">
                  <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5" />
                  <p><strong>Lưu ý bảo mật:</strong> Để thay đổi Database, Redis hay cấu hình Môi trường, bạn cần đăng nhập trực tiếp (SSH) vào máy chủ và sửa đổi tệp tin <code>.env</code> ở thư mục gốc backend và khởi động lại dịch vụ (PM2/Docker).</p>
                </div>
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Bảo mật & Người dùng</h2>
                  <p className="text-sm text-slate-500">Các quy tắc giới hạn và phân quyền hệ thống.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Security Setting ReadOnly (from env) */}
                  <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-xl flex items-center justify-center shrink-0">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Hệ thống phân quyền</h3>
                      <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">Website hiện sử dụng cơ chế RBAC (Admin, Editor, User) được cấu hình sâu trong Database.</p>
                      <Link href="/admin/users">
                        <Button variant="outline" size="sm">Quản lý người dùng</Button>
                      </Link>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                       <Lock size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Giới hạn truy cập</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed"><strong className="text-slate-700 dark:text-slate-300">Rate Limit:</strong> 100 requests / 15 phút<br/><strong className="text-slate-700 dark:text-slate-300">JWT Expire:</strong> 7 Ngày</p>
                      <p className="text-[10px] text-slate-400 mt-2 italic">(Chỉ thay đổi được qua biến môi trường do chính sách bảo mật máy chủ)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MARKETING */}
            {activeTab === 'marketing' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Tiếp thị & Đo lường SEO</h2>
                  <p className="text-sm text-slate-500">Mã theo dõi, tập lệnh tùy chỉnh phục vụ tăng trưởng.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Google Analytics ID (GA4)</label>
                    <input type="text" value={marketingForm.ga_id || ''} onChange={e => setMarketingForm({...marketingForm, ga_id: e.target.value})} placeholder="G-XXXXXXXXXX"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Facebook Pixel ID</label>
                    <input type="text" value={marketingForm.fb_pixel_id || ''} onChange={e => setMarketingForm({...marketingForm, fb_pixel_id: e.target.value})} placeholder="10293848576..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-mono" />
                  </div>
                  
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Head Scripts (Chèn trước {'</head>'})</label>
                    <textarea value={marketingForm.header_scripts || ''} onChange={e => setMarketingForm({...marketingForm, header_scripts: e.target.value})} placeholder="<!-- Nhúng các script custom vào đây -->"
                      className="w-full px-4 py-3 bg-[#0d1117] text-[#c9d1d9] border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none transition-all min-h-[120px] font-mono leading-relaxed" />
                    <p className="text-[10px] text-slate-400">Không chèn tag {'<script>'} nếu tích hợp dạng ID. Chỉ dùng khi nhúng mã tùy chỉnh độc lập.</p>
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Footer Scripts (Chèn trước {'</body>'})</label>
                    <textarea value={marketingForm.footer_scripts || ''} onChange={e => setMarketingForm({...marketingForm, footer_scripts: e.target.value})} placeholder="<!-- Chatbot, Popups, etc. -->"
                      className="w-full px-4 py-3 bg-[#0d1117] text-[#c9d1d9] border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none transition-all min-h-[120px] font-mono leading-relaxed" />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                  <Button onClick={() => handleSaveGroup('marketing')} isLoading={saving} size="lg">
                    <Save size={18} className="mr-2" /> Lưu cấu hình
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: MAINTENANCE */}
            {activeTab === 'maintenance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight flex items-center gap-2">
                    <ShieldAlert className="text-primary" />
                    Bảo trì hệ thống
                  </h2>
                  <p className="text-sm text-slate-500">Kiểm soát trạng thái hoạt động của các phân vùng trên website.</p>
                </div>

                <div className="space-y-6">
                   {/* Global Maintenance */}
                   <div className={cn(
                     "p-6 rounded-[2rem] border transition-all duration-300",
                     maintenanceForm.maintenance_global === 'true' 
                        ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30" 
                        : "bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800"
                   )}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                           <div className={cn("p-3 rounded-2xl", maintenanceForm.maintenance_global === 'true' ? "bg-red-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500")}>
                             <Server size={24} />
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-900 dark:text-white">Bảo trì toàn bộ (Global)</h3>
                              <p className="text-xs text-slate-500">Chuyển hướng tất cả khách viếng thăm về trang bảo trì.</p>
                           </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={maintenanceForm.maintenance_global === 'true'} onChange={e => setMaintenanceForm({...maintenanceForm, maintenance_global: e.target.checked ? 'true' : 'false'})} />
                          <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                      {maintenanceForm.maintenance_global === 'true' && (
                        <div className="mt-4 p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-red-100 dark:border-red-500/10 text-[11px] text-red-600 font-bold flex items-center gap-2">
                          <AlertCircle size={14} /> Hệ thống đang trong trạng thái LOCK DOWN. Chỉ Admin có passcode mới có thể truy cập qua cửa bí mật.
                        </div>
                      )}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Post Maintenance */}
                      <div className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                                <TrendingUp size={20} />
                              </div>
                              <h4 className="font-bold text-sm dark:text-white">Bảo trì Viết bài</h4>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer scale-75">
                            <input type="checkbox" className="sr-only peer" checked={maintenanceForm.maintenance_posts === 'true'} onChange={e => setMaintenanceForm({...maintenanceForm, maintenance_posts: e.target.checked ? 'true' : 'false'})} />
                            <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                          </label>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">Chặn tính năng đăng và chỉnh sửa bài viết.</p>
                      </div>

                      {/* Comment Maintenance */}
                      <div className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                                <Globe size={20} />
                              </div>
                              <h4 className="font-bold text-sm dark:text-white">Bảo trì Bình luận</h4>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer scale-75">
                            <input type="checkbox" className="sr-only peer" checked={maintenanceForm.maintenance_comments === 'true'} onChange={e => setMaintenanceForm({...maintenanceForm, maintenance_comments: e.target.checked ? 'true' : 'false'})} />
                            <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">Dừng tiếp nhận bình luận mới từ người dùng.</p>
                      </div>
                   </div>

                   {/* Passcode Config */}
                   <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Key size={80} className="text-white" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                           Mã truy cập vượt rào (Bypass Passcode)
                        </h3>
                        <p className="text-slate-400 text-xs mb-6 max-w-md">
                          Mã này dùng để đăng nhập vào trang quản trị thông qua "Cửa bí mật" khi hệ thống đang ở chế độ bảo trì toàn bộ.
                        </p>
                        <div className="flex items-center gap-4 relative group">
                           <input 
                             type={showSecrets['maintenance_passcode'] ? 'text' : 'password'} 
                             value={maintenanceForm.maintenance_passcode || ''} 
                             onChange={e => setMaintenanceForm({...maintenanceForm, maintenance_passcode: e.target.value})}
                             placeholder="VD: 123456"
                             className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xl font-mono tracking-widest focus:ring-2 focus:ring-primary outline-none transition-all w-full max-w-[240px] pr-12"
                           />
                           <button 
                             type="button"
                             onClick={() => toggleSecret('maintenance_passcode')}
                             className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                           >
                             {showSecrets['maintenance_passcode'] ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                           <div className="hidden sm:block text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                             Nhấn giữ icon ShieldAlert <br/> trên trang bảo trì 5 lần để nhập mã.
                           </div>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                  <Button onClick={() => handleSaveGroup('maintenance')} isLoading={saving} size="lg" className="rounded-2xl px-12">
                    <Save size={18} className="mr-2" /> Lưu cấu hình bảo trì
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: ALERTS (Unified) */}
            {activeTab === 'alerts' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Send className="text-primary" size={24} />
                    </div>
                    Cấu hình Cảnh báo Quản trị
                  </h2>
                  <p className="text-sm text-slate-500">Tùy chọn nhận thông báo tức thời qua các kênh khác nhau khi hệ thống có sự kiện mới.</p>
                </div>

                {!isSuperAdmin && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-start gap-4 text-amber-700 dark:text-amber-400">
                    <ShieldAlert className="shrink-0 mt-0.5" size={20} />
                    <div className="text-sm">
                      <p className="font-bold mb-1">Quyền hạn hạn chế</p>
                      <p>Chỉ <b>Superadmin (Master)</b> mới có quyền thay đổi các cấu hình cảnh báo, Webhook và máy chủ Email để đảm bảo an ninh hệ thống.</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-10">
                  {/* CHANNEL: TELEGRAM */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-xl transition-colors",
                          alertsForm.telegram_enabled === 'true' ? "bg-sky-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        )}>
                          <Send size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Telegram Channel</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={alertsForm.telegram_enabled === 'true'} 
                          disabled={!isSuperAdmin}
                          onChange={e => setAlertsForm({...alertsForm, telegram_enabled: e.target.checked ? 'true' : 'false'})} 
                        />
                        <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-500"></div>
                      </label>
                    </div>

                    <div className={cn(
                      "grid grid-cols-1 md:grid-cols-2 gap-5 transition-opacity duration-300",
                      alertsForm.telegram_enabled === 'false' && "opacity-50 pointer-events-none"
                    )}>
                      <div className="space-y-2 relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bot Token</label>
                        <div className="relative">
                          <input 
                            type={showSecrets['telegram_bot_token'] ? 'text' : 'password'} 
                            value={alertsForm.telegram_bot_token || ''} 
                            disabled={!isSuperAdmin}
                            onChange={e => setAlertsForm({...alertsForm, telegram_bot_token: e.target.value})} 
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-mono pr-12 disabled:opacity-70 disabled:cursor-not-allowed" 
                          />
                          <button 
                            type="button"
                            onClick={() => toggleSecret('telegram_bot_token')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          >
                            {showSecrets['telegram_bot_token'] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Chat ID</label>
                        <input 
                          type="text" 
                          value={alertsForm.telegram_chat_id || ''} 
                          disabled={!isSuperAdmin}
                          onChange={e => setAlertsForm({...alertsForm, telegram_chat_id: e.target.value})} 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-mono disabled:opacity-70 disabled:cursor-not-allowed" 
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 flex justify-start">
                        <Button variant="ghost" size="sm" onClick={handleTestTelegram} isLoading={testing} disabled={!isSuperAdmin} className="text-sky-600 hover:bg-sky-50">
                          <Send size={14} className="mr-2" /> Gửi tin thử tới Telegram
                        </Button>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* CHANNEL: MS TEAMS */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-xl transition-colors",
                          alertsForm.teams_enabled === 'true' ? "bg-indigo-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        )}>
                          <LinkIcon size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Microsoft Teams</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={alertsForm.teams_enabled === 'true'} 
                          disabled={!isSuperAdmin}
                          onChange={e => setAlertsForm({...alertsForm, teams_enabled: e.target.checked ? 'true' : 'false'})} 
                        />
                        <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>

                    <div className={cn(
                      "space-y-4 transition-opacity duration-300",
                      alertsForm.teams_enabled === 'false' && "opacity-50 pointer-events-none"
                    )}>
                      <div className="space-y-2 relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Incoming Webhook URL</label>
                        <div className="relative">
                          <input 
                            type={showSecrets['teams_webhook_url'] ? 'text' : 'password'} 
                            value={alertsForm.teams_webhook_url || ''} 
                            disabled={!isSuperAdmin}
                            onChange={e => setAlertsForm({...alertsForm, teams_webhook_url: e.target.value})} 
                            placeholder="https://outlook.office.com/webhook/..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-mono pr-12 disabled:opacity-70 disabled:cursor-not-allowed" 
                          />
                          <button 
                            type="button"
                            onClick={() => toggleSecret('teams_webhook_url')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          >
                            {showSecrets['teams_webhook_url'] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleTestTeams} isLoading={testing} disabled={!isSuperAdmin} className="text-indigo-600 hover:bg-indigo-50">
                        <LinkIcon size={14} className="mr-2" /> Gửi tin thử tới MS Teams
                      </Button>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* CHANNEL: EMAIL */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-xl transition-colors",
                          alertsForm.mail_enabled === 'true' ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        )}>
                          <Globe size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email Notifications</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={alertsForm.mail_enabled === 'true'} 
                          disabled={!isSuperAdmin}
                          onChange={e => setAlertsForm({...alertsForm, mail_enabled: e.target.checked ? 'true' : 'false'})} 
                        />
                        <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className={cn(
                      "grid grid-cols-1 md:grid-cols-2 gap-5 transition-opacity duration-300",
                      alertsForm.mail_enabled === 'false' && "opacity-50 pointer-events-none"
                    )}>
                      <div className="space-y-4 md:col-span-2">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10 text-xs text-emerald-700">
                          Sử dụng thư viện <b>Nodemailer</b> phía Backend để kết nối với máy chủ SMTP của bạn.
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SMTP Host</label>
                        <input type="text" value={alertsForm.mail_host || ''} disabled={!isSuperAdmin} onChange={e => setAlertsForm({...alertsForm, mail_host: e.target.value})} placeholder="smtp.gmail.com"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SMTP Port</label>
                        <input type="text" value={alertsForm.mail_port || ''} disabled={!isSuperAdmin} onChange={e => setAlertsForm({...alertsForm, mail_port: e.target.value})} placeholder="587 hoặc 465"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed" />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SMTP User</label>
                        <input type="text" value={alertsForm.mail_user || ''} disabled={!isSuperAdmin} onChange={e => setAlertsForm({...alertsForm, mail_user: e.target.value})} placeholder="your-email@gmail.com"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed" />
                      </div>

                      <div className="space-y-2 relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SMTP Password</label>
                        <div className="relative">
                          <input 
                            type={showSecrets['mail_pass'] ? 'text' : 'password'} 
                            value={alertsForm.mail_pass || ''} 
                            disabled={!isSuperAdmin}
                            onChange={e => setAlertsForm({...alertsForm, mail_pass: e.target.value})} 
                            placeholder="App Password"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary pr-12 disabled:opacity-70 disabled:cursor-not-allowed" 
                          />
                          <button 
                            type="button"
                            onClick={() => toggleSecret('mail_pass')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          >
                            {showSecrets['mail_pass'] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Nhận Cảnh Báo (Admin Recipient)</label>
                        <input type="email" value={alertsForm.mail_admin_recipient || ''} disabled={!isSuperAdmin} onChange={e => setAlertsForm({...alertsForm, mail_admin_recipient: e.target.value})} placeholder="admin@domain.com"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary font-bold disabled:opacity-70 disabled:cursor-not-allowed" />
                      </div>

                      <div className="md:col-span-2 flex justify-start">
                        <Button variant="ghost" size="sm" onClick={handleTestEmail} isLoading={testing} disabled={!isSuperAdmin} className="text-emerald-600 hover:bg-emerald-50">
                          <Globe size={14} className="mr-2" /> Gửi mail thử nghiệm
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 flex justify-end">
                   <Button onClick={() => handleSaveGroup('alerts')} isLoading={saving} disabled={testing || !isSuperAdmin} size="lg" className="rounded-2xl px-16 h-14 text-base shadow-xl shadow-primary/20">
                     <Save size={20} className="mr-2" /> {isSuperAdmin ? 'Lưu toàn bộ cấu hình Cảnh báo' : 'Vui lòng sử dụng quyền Superadmin'}
                   </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
