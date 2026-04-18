'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, Globe, Server, Shield, TrendingUp, Save, Loader2, Image as ImageIcon, 
  Trash2, AlertCircle, Check, Link as LinkIcon, Database, HardDrive, ShieldCheck, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Button from '@/components/ui/Button';
import { settingService, SettingsConfig } from '@/services/settingService';
import Link from 'next/link';

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'system' | 'security' | 'marketing'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings State mapped from API
  const [settings, setSettings] = useState<SettingsConfig | null>(null);
  
  // Local form states for editable tabs
  const [generalForm, setGeneralForm] = useState<Record<string, string>>({
    site_title: '',
    site_tagline: '',
    default_lang: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    comments_enabled: 'true',
    footer_copyright: '',
  });

  const [marketingForm, setMarketingForm] = useState<Record<string, string>>({
    ga_id: '',
    fb_pixel_id: '',
    header_scripts: '',
    footer_scripts: '',
    ads_enabled: 'false',
    adsense_snippet: '',
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
    } catch (error) {
      console.error('Failed to parse settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGroup = async (group: 'general' | 'marketing') => {
    setSaving(true);
    setStatusMsg(null);
    try {
      const targetForm = group === 'general' ? generalForm : marketingForm;
      const items = Object.entries(targetForm).map(([key, value]) => ({
        key,
        value,
        group,
      }));
      
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

  const tabs = [
    { id: 'general', label: 'Cấu hình Website', icon: Globe },
    { id: 'system', label: 'Hệ thống (System)', icon: Server },
    { id: 'security', label: 'Bảo mật & Users', icon: Shield },
    { id: 'marketing', label: 'Marketing & SEO', icon: TrendingUp },
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
          </div>
        </div>
      </div>
    </>
  );
}
