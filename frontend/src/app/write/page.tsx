import PostEditor from '@/features/posts/components/PostEditor';
import { SidebarProvider } from '@/context/SidebarContext';

export default function WritePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="pt-20 md:pt-24">
        <SidebarProvider>
          <PostEditor />
        </SidebarProvider>
      </div>
    </div>
  );
}

