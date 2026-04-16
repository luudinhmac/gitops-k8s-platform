import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Terminal, Eye, MessageSquare, Clock, ChevronRight, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';
import FormattedDate from './FormattedDate';
import Badge from './Badge';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    cover_image: string | null;
    series?: string | null;
    created_at: string;
    readTime?: number;
    views?: number;
    is_pinned?: boolean;
    Category?: {
      name: string;
      slug: string;
    } | null;
    User?: {
      fullname: string;
      username: string;
      avatar?: string | null;
    };
  };
  className?: string;
  priority?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, className, priority = false }) => {
  const categorySlug = post.Category?.slug || 'uncategorized';
  
  return (
    <Link 
      href={`/${categorySlug}/${post.slug}`} 
      className={cn("group flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover-lift shadow-sm hover:shadow-xl transition-all h-full relative", className)}
    >
      {/* Pinned Badge */}
      {post.is_pinned && (
        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-lg flex items-center gap-1 animate-in zoom-in-50 duration-500">
          <Bookmark size={8} className="fill-white" /> Cố định
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {post.cover_image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${post.cover_image}`}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
            <Terminal size={32} className="text-slate-300 dark:text-slate-700" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          <div className="flex items-center text-primary bg-primary/5 px-1 py-0.5 rounded border border-primary/5">
            <UserAvatar user={post.User} size="xs" className="mr-1.5 border-none" />
            {post.User?.fullname || post.User?.username || 'Ẩn danh'}
          </div>
          <FormattedDate date={post.created_at} showIcon iconSize={10} className="text-slate-400" />
          <div className="flex items-center">
            <Eye size={10} className="mr-1 text-primary" />
            {post.views || 0}
          </div>
          <div className="flex items-center">
            <MessageSquare size={10} className="mr-1 text-primary" />
            0
          </div>
        </div>

        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {post.title}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {post.Category && (
            <Badge type="category">{post.Category.name}</Badge>
          )}
          {post.series && (
            <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/5">
              Series: {post.series}
            </Badge>
          )}
        </div>

        {post.excerpt && (
          <p className="text-slate-500 dark:text-slate-400 text-[10.5px] line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock size={10} className="mr-1 text-primary" />
            {post.readTime || 5} min read
          </div>
          <div className="text-primary group-hover:translate-x-1 transition-transform">
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
