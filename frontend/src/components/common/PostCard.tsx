import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Terminal, Eye, MessageSquare, Clock, ChevronRight, Bookmark, Sparkles } from 'lucide-react';
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
      className={cn(
        "group flex flex-col bg-transparent rounded-3xl overflow-hidden transition-all duration-500 h-full relative", 
        className
      )}
    >
      {/* Pinned Badge */}
      {post.is_pinned && (
        <div className="absolute top-4 left-4 z-10 bg-amber-500/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 animate-in zoom-in-50 duration-500 border border-white/20">
          <Sparkles size={10} className="fill-white" /> CỐ ĐỊNH
        </div>
      )}

      {/* Image Container - Premium Look */}
      <div className="relative h-56 overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
        {post.cover_image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${post.cover_image}`}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center">
            <Terminal size={40} className="text-slate-200 dark:text-slate-800 opacity-50" />
          </div>
        )}
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content - No box, just clean typography */}
      <div className="pt-6 pb-2 px-1 flex flex-col flex-grow">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
            {post.User?.fullname || post.User?.username || 'GHOST AUTHOR'}
          </div>
          <FormattedDate date={post.created_at} className="opacity-80" />
        </div>

        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight decoration-primary/30 decoration-2 group-hover:underline underline-offset-4">
          {post.title}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.Category && (
            <Badge type="category" size="xs">{post.Category.name}</Badge>
          )}
          {post.series && (
            <Badge size="xs" className="bg-indigo-500/10 text-indigo-600 border-indigo-100 dark:border-indigo-900/50">
              {post.series}
            </Badge>
          )}
        </div>

        {post.excerpt && (
          <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-6 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
            {post.excerpt}
          </p>
        )}

        {/* Footer Stats */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-5">
            <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Eye size={12} className="mr-1.5 text-primary" />
              {post.views || 0}
            </div>
            <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Clock size={12} className="mr-1.5" />
              {post.readTime || 5} min
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;

