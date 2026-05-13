'use client';

interface GooglePreviewProps {
  title: string;
  slug: string;
  metaDescription: string;
}

export default function GooglePreview({ title, slug, metaDescription }: GooglePreviewProps) {
  const displayTitle = title || 'Tiêu đề bài viết của bạn sẽ hiển thị ở đây';
  const displaySlug = slug || 'duong-dan-bai-viet';
  const displayDesc = metaDescription || 'Vui lòng nhập mô tả meta để xem trước cách bài viết hiển thị trên kết quả tìm kiếm của Google...';

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Google Search Preview</h4>
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-[10px] text-slate-400">G</div>
          <div className="flex flex-col text-[10px]">
            <span className="text-slate-900 dark:text-slate-200 leading-none">luumac.io.vn</span>
            <span className="text-slate-400 mt-0.5 leading-none">https://luumac.io.vn › blog › {displaySlug}</span>
          </div>
        </div>
        <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer transition-colors line-clamp-1 mb-1">
          {displayTitle}
        </h3>
        <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-normal">
          {displayDesc}
        </p>
      </div>
    </div>
  );
}
