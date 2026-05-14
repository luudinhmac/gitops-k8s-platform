'use client';

import { Tag, Link as LinkIcon, Layers, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  categories: { id: number; name: string }[];
  seriesList: { id: number; name: string }[];
  formData: any;
  setFormData: (data: any) => void;
  userRole?: string;
}

export default function SettingsPanel({
  categories,
  seriesList,
  formData,
  setFormData,
  userRole
}: SettingsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <label htmlFor="pe-category" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Danh mục</label>
        <div className="relative">
          <select 
            id="pe-category" 
            name="pe-category" 
            value={formData.category_id} 
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            autoComplete="off"
          >
             <option value="">Chọn danh mục</option>
             {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Layers size={14} />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label htmlFor="pe-tags" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Thẻ (ngăn cách bởi dấu phẩy)</label>
        <div className="relative group">
          <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            id="pe-tags" 
            name="pe-tags" 
            type="text" 
            placeholder="tag1, tag2..." 
            value={formData.tags} 
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            autoComplete="off"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
          />
        </div>
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label htmlFor="pe-slug" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Đường dẫn (Slug)</label>
        <div className="relative group">
          <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            id="pe-slug"
            name="pe-slug"
            type="text" 
            placeholder="bai-viet-seo..." 
            value={formData.slug} 
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            autoComplete="off"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-mono" 
          />
        </div>
      </div>

      {/* Series */}
      <div className="space-y-2">
        <label htmlFor="pe-series" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Series bài viết</label>
        <div className="relative group">
          <Bookmark size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            id="pe-series"
            name="pe-series"
            list="pe-series-options"
            placeholder="Chọn hoặc nhập mới..."
            value={formData.series_name}
            onChange={(e) => setFormData({ ...formData, series_name: e.target.value })}
            autoComplete="off"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
          <datalist id="pe-series-options">
            {seriesList.map(s => ( <option key={s.id} value={s.name} /> ))}
          </datalist>
        </div>
      </div>

      {formData.series_name && (
        <div className="animate-in slide-in-from-top-2 duration-300 space-y-2">
           <label htmlFor="pe-series-order" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Thứ tự trong Series</label>
           <input 
             id="pe-series-order" 
             name="pe-series-order" 
             type="number" 
             placeholder="0" 
             value={formData.series_order} 
             onChange={(e) => setFormData({ ...formData, series_order: e.target.value })}
             autoComplete="off"
             className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
           />
        </div>
      )}

      {/* Pin Post */}
      {['admin', 'superadmin'].includes(userRole || '') && (
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
           <div className="flex flex-col">
             <label htmlFor="pe-pinned" className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest cursor-pointer">Ghim bài viết</label>
             <span className="text-[9px] text-slate-400 mt-0.5">Hiển thị nổi bật ở đầu trang</span>
           </div>
           <input 
             id="pe-pinned" 
             name="is_pinned" 
             type="checkbox" 
             className="w-5 h-5 accent-primary cursor-pointer rounded-lg" 
             checked={formData.is_pinned} 
             onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })} 
           />
        </div>
      )}
    </div>
  );
}
