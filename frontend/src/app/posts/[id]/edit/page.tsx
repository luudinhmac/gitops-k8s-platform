import { use } from 'react';
import PostEditor from '@/features/posts/components/PostEditor';
import Navbar from '@/components/layout/Navbar';
import { SidebarProvider } from '@/context/SidebarContext';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params);
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="pt-20 md:pt-24">
        <SidebarProvider>
          <PostEditor postId={parseInt(id)} />
        </SidebarProvider>
      </div>
    </div>
  );
}
