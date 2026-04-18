'use client';

import PostEditor from '@/components/posts/PostEditor';
import Navbar from '@/components/layout/Navbar';

export default function WritePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="pt-2">
        <PostEditor />
      </div>
    </div>
  );
}
