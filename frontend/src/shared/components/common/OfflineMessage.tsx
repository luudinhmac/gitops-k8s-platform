'use client';

import React from 'react';
import { ServerOff, RefreshCw } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

interface OfflineMessageProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export default function OfflineMessage({ 
  onRetry, 
  title = "Hệ thống đang bảo trì dữ liệu", 
  message = "Chúng tôi không thể kết nối tới máy chủ lúc này. Vui lòng quay lại sau hoặc thử làm mới trang." 
}: OfflineMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-8 text-red-500 shadow-inner">
        <ServerOff size={44} />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
        {title}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-10 leading-relaxed">
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {onRetry && (
          <Button onClick={onRetry} className="group min-w-[160px]">
            <RefreshCw size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Thử kết nối lại
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="min-w-[160px]"
        >
          Tải lại trang
        </Button>
      </div>
      
      <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 w-full max-w-xs mx-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Status: <span className="text-red-500">Server Offline</span>
        </p>
      </div>
    </div>
  );
}

