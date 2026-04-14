'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);
  return (
    <div className="pt-40 text-center text-slate-500">
      Đang chuyển hướng đến trang chủ...
    </div>
  );
}
