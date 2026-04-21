import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import BlogContent from './BlogContent';

export const metadata: Metadata = {
  title: 'Blog chia sẻ Kiến thức | Lưu Đình Mác',
  description: 'Hành trình từ System Engineer đến Cloud & DevOps. Chia sẻ kinh nghiệm thực chiến về hệ thống, hạ tầng và công nghệ phần mềm.',
  openGraph: {
    title: 'Blog chia sẻ Kiến thức | Lưu Đình Mác',
    description: 'Hành trình từ System Engineer đến Cloud & DevOps. Chia sẻ kinh nghiệm thực chiến về hệ thống, hạ tầng và công nghệ phần mềm.',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-40 text-center">
        <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Đang tải dữ liệu...</p>
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}
