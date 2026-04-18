'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user?: {
    avatar?: string | null;
    fullname?: string | null;
    username?: string | null;
  } | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function UserAvatar({ user, size = 'sm', className }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initial = (user?.fullname || user?.username)?.[0]?.toUpperCase() || '?';
  
  // Use a stable color based on the username string
  const getBackgroundColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
      'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const colorClass = getBackgroundColor(user?.username || 'user');

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center font-bold overflow-hidden border border-slate-200/50 dark:border-slate-800/50 flex-shrink-0",
      sizeClasses[size],
      !user?.avatar || imageError ? colorClass : "bg-slate-100 dark:bg-slate-800",
      className
    )}>
      {user?.avatar && !imageError ? (
        <Image 
          src={user.avatar} 
          alt={user.fullname || user.username || 'Avatar'} 
          width={64}
          height={64}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
