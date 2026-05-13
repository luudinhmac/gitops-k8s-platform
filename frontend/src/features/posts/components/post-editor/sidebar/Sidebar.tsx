'use client';

import { useState } from 'react';
import { Settings, Search, Send, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  settingsContent: React.ReactNode;
  seoContent: React.ReactNode;
  publishContent: React.ReactNode;
}

type TabId = 'settings' | 'seo' | 'publish';

export default function Sidebar({
  settingsContent,
  seoContent,
  publishContent
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>('settings');

  const tabs = [
    { id: 'settings', label: 'Cài đặt', icon: Settings },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'publish', label: 'Xuất bản', icon: Send },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 p-1.5 bg-slate-50/50 dark:bg-slate-950/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            className={cn(
              "flex-1 flex items-center justify-center py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all",
              activeTab === tab.id
                ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            <tab.icon size={14} className={cn("mr-2", activeTab === tab.id ? "text-primary" : "text-slate-400")} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
        <div className={cn("animate-in fade-in slide-in-from-right-4 duration-300", activeTab !== 'settings' && "hidden")}>
          {settingsContent}
        </div>
        <div className={cn("animate-in fade-in slide-in-from-right-4 duration-300", activeTab !== 'seo' && "hidden")}>
          {seoContent}
        </div>
        <div className={cn("animate-in fade-in slide-in-from-right-4 duration-300", activeTab !== 'publish' && "hidden")}>
          {publishContent}
        </div>
      </div>
    </div>
  );
}
