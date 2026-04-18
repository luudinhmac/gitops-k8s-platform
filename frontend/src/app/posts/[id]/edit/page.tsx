'use client';

import { use } from 'react';
import PostEditor from '@/components/posts/PostEditor';
import Navbar from '@/components/layout/Navbar';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params);
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="pt-2">
        <PostEditor postId={parseInt(id)} />
      </div>
    </div>
  );
}
