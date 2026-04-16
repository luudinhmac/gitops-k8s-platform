'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  FileText, Plus, Edit, Trash2, Eye,
  Loader2, Tag as TagIcon, MessageSquare, Heart,
  ChevronUp, ChevronDown, Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';

interface AdminPost {
  id: number;
  title: string;
  slug: string;
  views: number;
  likes: number;
  created_at: string;
  is_published: boolean;
  author_id: number;
  is_pinned?: boolean;
  Category?: { name: string, slug: string } | null;
  User?: { fullname: string } | null;
  Tag?: { name: string }[];
  _count?: {
    Comment: number;
    PostLike: number;
  };
}

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'interaction'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [postsRes, catsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/admin`, { credentials: 'include' }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { credentials: 'include' })
      ]);
      const postsData = await postsRes.json();
      const catsData = await catsRes.json();
      let filtered: AdminPost[] = Array.isArray(postsData) ? postsData : [];
      if (user?.role !== 'admin') {
        filtered = filtered.filter(p => p.author_id === user?.id);
      }
      setPosts(filtered);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, user?.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeletePost = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== deleteId));
        setIsDeleteModalOpen(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Không thể xóa bài viết');
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/toggle-publish`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (res.ok) {
        setPosts(posts.map(p => p.id === id ? { ...p, is_published: !currentStatus } : p));
      } else {
        alert('Lỗi khi thay đổi trạng thái bài viết');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.Category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.User?.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    let valA: number = 0;
    let valB: number = 0;

    if (sortBy === 'date') {
      valA = new Date(a.created_at).getTime();
      valB = new Date(b.created_at).getTime();
    } else if (sortBy === 'views') {
      valA = a.views || 0;
      valB = b.views || 0;
    } else if (sortBy === 'interaction') {
      valA = (a.views || 0) + (a._count?.Comment || 0) + (a.likes || 0);
      valB = (b.views || 0) + (b._count?.Comment || 0) + (b.likes || 0);
    }

    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader 
        title="Quản lý bài viết"
        subtitle="Xem, tạo và chỉnh sửa các bài viết trên Blog."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm bài viết..."
        primaryAction={{
          label: "Viết bài",
          icon: Plus,
          href: "/admin/posts/new"
        }}
      />

      <div className="space-y-4">
          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Tổng bài viết', count: posts.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Tổng lượt xem', count: posts.reduce((a, p) => a + (p.views || 0), 0), icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Danh mục', count: categories.length, icon: Layout, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { label: 'Thẻ', count: posts.reduce((a, p) => a + (p.Tag?.length || 0), 0), icon: TagIcon, color: 'text-pink-500', bg: 'bg-pink-500/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", stat.bg)}>
                  <stat.icon className={stat.color} size={16} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-none">{stat.count}</h3>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tight">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── Posts Table ── */}
          <AdminCard padding="p-0" title="Danh sách bài viết" icon={FileText}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bài viết</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Danh mục</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">
                      <div className="flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => {
                          if (sortBy === 'interaction') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          else { setSortBy('interaction'); setSortOrder('desc'); }
                        }}
                      >
                        <span>Thống kê</span>
                        {sortBy === 'interaction' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {sortedPosts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        Không tìm thấy bài viết nào.
                      </td>
                    </tr>
                  ) : sortedPosts.map((post) => (
                    <tr key={post.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {post.is_pinned && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded uppercase">Highlight</span>}
                              <Link 
                                href={`/${post.Category?.slug || 'uncategorized'}/${post.slug}`}
                                target="_blank"
                                className="group/title"
                              >
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[240px] md:max-w-md group-hover/title:text-primary transition-colors">
                                  {post.title}
                                </h4>
                              </Link>
                            </div>
                            <p className="text-[11px] text-slate-500 flex items-center">
                              <span className="font-medium text-slate-400">{post.Category?.name || 'Chưa phân loại'}</span>
                              <span className="mx-2 opacity-50">•</span>
                              <span>{post.User?.fullname || 'Ẩn danh'}</span>
                              <span className="mx-2 opacity-50">•</span>
                              <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden lg:table-cell">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold rounded-lg uppercase">
                          {post.Category?.name || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-slate-500 text-[10px] font-medium" title="Lượt xem">
                            <Eye size={12} className="mr-1 text-slate-400" />{post.views || 0}
                          </div>
                          <div className="flex items-center text-slate-500 text-[10px] font-medium" title="Bình luận">
                            <MessageSquare size={12} className="mr-1 text-slate-400" />{post._count?.Comment || 0}
                          </div>
                          <div className="flex items-center text-slate-500 text-[10px] font-medium" title="Yêu thích">
                            <Heart size={12} className="mr-1 text-slate-400" />{post.likes || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button onClick={() => togglePublish(post.id, post.is_published)} 
                          className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                            post.is_published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                          )}>
                          {post.is_published ? 'Đang bật' : 'Đang ẩn'}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1 transition-opacity">

                          <Link href={`/admin/posts/edit/${post.id}`} className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/5 rounded-lg transition-all">
                            <Edit size={14} />
                          </Link>
                          <button onClick={() => { setDeleteId(post.id); setIsDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeletePost}
          loading={isDeleting}
          title="Xóa bài viết"
          message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        />
    </>
  );
}
