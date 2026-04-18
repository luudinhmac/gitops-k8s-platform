import PostEditor from '@/components/posts/PostEditor';
import Navbar from '@/components/layout/Navbar';
import { SidebarProvider } from '@/context/SidebarContext';

export default function WritePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="pt-2">
        <SidebarProvider>
          <PostEditor />
        </SidebarProvider>
      </div>
    </div>
  );
}
