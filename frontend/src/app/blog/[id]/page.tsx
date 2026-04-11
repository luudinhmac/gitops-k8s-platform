'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronLeft, Tag, Share2, MessageCircle, Send, User as UserIcon, Loader2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ author_name: '', author_email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateReadTime = (content: string) => {
    const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    const time = Math.ceil(words / 200);
    return time < 1 ? 1 : time;
  };

  const hasCountedView = useRef(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Chỉ đếm lượt xem 1 lần duy nhất, ngay cả trong React StrictMode
        const viewParam = !hasCountedView.current ? '?action=view' : '';
        if (!hasCountedView.current) {
          hasCountedView.current = true;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}${viewParam}`);
        const data = await response.json();
        setPost(data);
        
        // Fetch comments song song
        const commentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/post/${id}`);
        const commentsData = await commentsRes.json();
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 min-h-screen max-w-4xl mx-auto">
        <div className="h-10 w-48 bg-slate-100 dark:bg-slate-900 rounded-full animate-pulse mb-8" />
        <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] animate-pulse mb-12" />
        <div className="space-y-4">
          <div className="h-6 w-full bg-slate-100 dark:bg-slate-900 rounded animate-pulse" />
          <div className="h-6 w-3/4 bg-slate-100 dark:bg-slate-900 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-48 pb-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h2>
        <Link href="/blog" className="text-primary hover:underline">Quay lại trang blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <article className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-12 group"
        >
          <ChevronLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
          Tất cả bài viết
        </Link>

        {/* Post Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              {post.Category?.name || 'Kỹ thuật'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-sm text-slate-500">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold">
                {post.User?.fullname?.[0] || 'A'}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{post.User?.fullname || 'Administrator'}</p>
                <p className="text-xs text-slate-500">System Engineer & Blogger</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="p-2.5 glass rounded-full hover:text-primary transition-colors">
                <Share2 size={18} />
              </button>
              <button className="p-2.5 glass rounded-full hover:text-primary transition-colors">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image Replacement */}
        <div className="w-full h-[400px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-[2.5rem] mb-12 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800">
           <Tag size={80} className="text-primary/10 animate-pulse" />
        </div>

        {/* Post Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer info */}
        <footer className="mt-20 pt-12 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white mr-2 self-center">Tags:</span>
              {post.Tag?.length > 0 ? post.Tag.map((tag: any) => (
                <span key={tag.id} className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full text-xs font-medium hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer">
                  #{tag.name}
                </span>
              )) : (
                <span className="text-sm text-slate-400 italic">Không có thẻ</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-xs font-bold text-slate-500">
               <span className="flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 whitespace-nowrap">
                  <Eye size={14} className="mr-1.5" />
                  {post.views || 0} Lượt xem
               </span>
               <span className="flex items-center px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 whitespace-nowrap">
                  <Clock size={14} className="mr-1.5" />
                  {calculateReadTime(post.content || '')} phút đọc
               </span>
               <span className="flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 whitespace-nowrap">
                  <MessageCircle size={14} className="mr-1.5" />
                  {comments.length} Bình luận
               </span>
            </div>
          </div>

          {/* Comments Section */}
          <section className="mt-16 bg-white dark:bg-slate-900/50 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-10 flex items-center">
              <MessageCircle className="mr-3 text-primary" />
              Thảo luận ({comments.length})
            </h3>

            {/* Comment Form */}
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!commentForm.content.trim()) return;
                
                // Nếu đã đăng nhập, dùng thông tin user; nếu không thì dùng form
                const authorName = isAuthenticated && user ? user.fullname || user.username : commentForm.author_name;
                const authorEmail = isAuthenticated && user ? (user as any).email || '' : commentForm.author_email;
                
                if (!isAuthenticated && !authorName.trim()) return;
                
                setIsSubmitting(true);
                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      post_id: parseInt(id),
                      author_name: authorName,
                      author_email: authorEmail,
                      content: commentForm.content
                    })
                  });
                  if (res.ok) {
                    const newComment = await res.json();
                    setComments([newComment, ...comments]);
                    setCommentForm({ author_name: '', author_email: '', content: '' });
                  }
                } catch (err) { console.error(err); }
                finally { setIsSubmitting(false); }
              }}
              className="mb-16 space-y-6"
            >
              {/* Hiển thị thông tin người đang đăng nhập, hoặc form nhập liệu */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4 px-6 py-4 bg-primary/5 border border-primary/20 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(user.fullname || user.username)?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user.fullname || user.username}</p>
                    <p className="text-xs text-slate-400">Đang bình luận với tài khoản đã đăng nhập</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Tên của bạn*
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      value={commentForm.author_name}
                      onChange={(e) => setCommentForm({ ...commentForm, author_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Email (Không bắt buộc)
                    </label>
                    <input 
                      type="email" 
                      placeholder="email@example.com"
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                      value={commentForm.author_email}
                      onChange={(e) => setCommentForm({ ...commentForm, author_email: e.target.value })}
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Nội dung bình luận*
                </label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm resize-none"
                  value={commentForm.content}
                  onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Send size={18} className="mr-2" />}
                Gửi bình luận
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-10">
              {commentsLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full" />
                    <div className="flex-grow space-y-3">
                      <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                ))
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <UserIcon size={20} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">{comment.author_name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                  <MessageCircle size={32} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                  <p className="text-slate-500 font-medium whitespace-pre-wrap">
                     Chưa có thảo luận nào. Hãy là người {`\n`} đầu tiên chia sẻ ý kiến của bạn!
                  </p>
                </div>
              )}
            </div>
          </section>
        </footer>
      </article>
    </div>
  );
}
