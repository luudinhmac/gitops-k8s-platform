'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function OldPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`);
        if (response.ok) {
          const post = await response.json();
          const categorySlug = post.Category?.slug || 'uncategorized';
          const postSlug = post.slug;
          router.replace(`/${categorySlug}/${postSlug}`);
        } else {
          router.replace('/blog');
        }
      } catch (error) {
        console.error('Redirect error:', error);
        router.replace('/blog');
      }
    };
    fetchAndRedirect();
  }, [id, router]);

  return (
    <div className="pt-40 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Đang chuyển hướng...</h2>
      <p className="text-slate-500 text-sm">Chúng tôi đang đưa bạn đến Link bài viết chuẩn SEO mới.</p>
    </div>
  );
}
