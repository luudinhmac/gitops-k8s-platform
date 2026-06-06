'use client';

import { Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { uploadService } from '@/shared/services/uploadService';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CoverImagePanelProps {
  coverImage: string;
  setCoverImage: (url: string) => void;
  onMessage: (data: { title: string; message: string; variant: 'error' }) => void;
}

export default function CoverImagePanel({
  coverImage,
  setCoverImage,
  onMessage
}: CoverImagePanelProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadService.uploadImage(file, 'post');
      setCoverImage(data.url);
    } catch (err: any) {
      onMessage({
        title: 'Lỗi tải ảnh',
        message: err.response?.data?.message || 'Không thể tải ảnh lên vào lúc này. Vui lòng kiểm tra lại định dạng hoặc kích thước ảnh.',
        variant: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setCoverImage('');
  };

  return (
    <div className="space-y-4">
      <label htmlFor="pe-cover-upload-sidebar" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ảnh bìa bài viết</label>

      <div className={cn(
        "relative aspect-video bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed transition-all overflow-hidden group",
        coverImage ? "border-transparent shadow-lg" : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
      )}>
        {coverImage ? (
          (() => {
            let baseUrl = 'http://localhost:3001';
            try {
              baseUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').origin;
            } catch {
              baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace('/api/v1', '').replace('/v1', '').replace('/api', '');
            }
            const imageUrl = `${baseUrl}${coverImage}`;
            return (
              <>
                <img
                  src={imageUrl}
                  alt="Post Cover"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label htmlFor="pe-cover-upload-sidebar" className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-[10px] font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-all">
                    Thay đổi
                  </label>
                  <button
                    onClick={removeImage}
                    className="p-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl text-red-100 hover:bg-red-500/40 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            );
          })()
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4">
            {uploading ? (
              <Loader2 size={24} className="animate-spin text-primary" />
            ) : (
              <>
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon size={24} className="text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">Chọn ảnh bìa</span>
                <p className="text-[9px] text-slate-400 mt-2 text-center">Định dạng JPG, PNG, WebP<br />Kích thước tối ưu 1200x630</p>
              </>
            )}
          </div>
        )}

        <input
          id="pe-cover-upload-sidebar"
          name="cover_image_file"
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileUpload}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
