'use client';

import { Eye, EyeOff, Calendar, Globe, Lock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Badge from '@/shared/components/common/Badge';

interface PublishPanelProps {
  isPublished: boolean;
  setIsPublished: (val: boolean) => void;
  createdAt?: string;
  updatedAt?: string;
}

export default function PublishPanel({
  isPublished,
  setIsPublished,
  createdAt,
  updatedAt
}: PublishPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label htmlFor="pe-publish-status" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Trạng thái & Hiển thị</label>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-xl",
                isPublished ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              )}>
                {isPublished ? <Globe size={16} /> : <Lock size={16} />}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">Hiển thị công khai</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{isPublished ? 'Mọi người đều có thể xem' : 'Chỉ mình bạn thấy bài này'}</p>
              </div>
            </div>
            <input 
              id="pe-publish-status"
              name="is_published"
              type="checkbox" 
              checked={isPublished} 
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 accent-primary cursor-pointer rounded-lg"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 space-y-2.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 flex items-center"><Calendar size={12} className="mr-1.5" /> Ngày tạo</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {createdAt ? new Date(createdAt).toLocaleDateString('vi-VN') : 'Hiện tại'}
              </span>
            </div>
            {updatedAt && (
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400 flex items-center"><ShieldCheck size={12} className="mr-1.5" /> Cập nhật cuối</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {new Date(updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30 rounded-2xl">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 text-blue-500">
            <Eye size={14} />
          </div>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed">
            <strong>Gợi ý:</strong> Bạn nên kiểm tra kỹ điểm SEO và nội dung trước khi chuyển sang trạng thái <b>Xuất bản</b>. Bài viết ở chế độ <b>Bản nháp</b> sẽ không hiển thị trên trang chủ và RSS.
          </p>
        </div>
      </div>
    </div>
  );
}
