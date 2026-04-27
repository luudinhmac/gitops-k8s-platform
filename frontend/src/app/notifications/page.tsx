"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, MessageCircle, Reply, ShieldAlert, UserCheck, ChevronLeft, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '@/features/notifications/services/notificationService';
import { Notification } from '@portfolio/types';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import UserAvatar from '@/features/users/components/UserAvatar';
import Button from '@/shared/components/ui/Button';
import ConfirmationDialog from '@/shared/components/ui/ConfirmationDialog';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const router = useRouter();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAll(filter === 'unread');
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      await notificationService.deleteAll();
      setNotifications([]);
      setIsDeleteAllOpen(false);
    } catch (err) {
      console.error('Error deleting all notifications:', err);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'COMMENT_ON_POST': return <MessageCircle size={18} className="text-blue-500" />;
      case 'REPLY_TO_COMMENT': return <Reply size={18} className="text-emerald-500" />;
      case 'POST_BLOCKED': return <ShieldAlert size={18} className="text-red-500" />;
      case 'USER_STATUS_CHANGE': 
      case 'USER_PERMISSION_CHANGE': return <UserCheck size={18} className="text-amber-500" />;
      default: return <Bell size={18} className="text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-white dark:hover:bg-slate-900 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              Thông báo
              <span className="text-sm font-normal text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
                {notifications.length}
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  Đọc hết
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => setIsDeleteAllOpen(true)}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  Xóa hết
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-px">
          <button 
            onClick={() => setFilter('all')}
            className={cn(
              "pb-3 px-1 text-sm font-bold transition-all relative",
              filter === 'all' ? "text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            Tất cả
            {filter === 'all' && <motion.div layoutId="filterLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={cn(
              "pb-3 px-1 text-sm font-bold transition-all relative",
              filter === 'unread' ? "text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            Chưa đọc
            {filter === 'unread' && <motion.div layoutId="filterLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Đang tải thông báo...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-full mb-6">
                <Bell size={48} className="opacity-20" />
              </div>
              <p className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Không có thông báo nào</p>
              <p className="text-sm">Bạn tuyệt vời lắm! Tất cả mọi thứ đều ổn.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={cn(
                    "p-6 flex gap-4 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 relative group",
                    !n.is_read && "bg-primary/5 border-l-4 border-l-primary"
                  )}
                >
                  <div className="relative flex-shrink-0">
                    {n.Sender ? (
                      <UserAvatar user={n.Sender} size="lg" className="rounded-xl shadow-md border-2 border-white dark:border-slate-800" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
                        {getIcon(n.type)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 p-1 rounded-full shadow-lg border border-slate-100 dark:border-slate-800">
                       <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-full">
                          {getIcon(n.type)}
                       </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className={cn("text-base transition-colors leading-tight", n.is_read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white font-extrabold")}>
                        {n.title}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(n.created_at).toLocaleDateString('vi-VN', { 
                            day: '2-digit', 
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <p className={cn("text-sm leading-relaxed mb-4", n.is_read ? "text-slate-500 dark:text-slate-400" : "text-slate-600 dark:text-slate-300 font-medium")}>
                      {n.content}
                    </p>
                    
                    <div className="flex items-center gap-4">
                       {!n.is_read && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                           className="text-xs font-black text-primary hover:underline uppercase tracking-tighter"
                         >
                            Đánh dấu đã đọc
                         </button>
                       )}
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                         className="text-xs font-black text-red-500 hover:underline uppercase tracking-tighter flex items-center gap-1.5 ml-auto"
                       >
                          <Trash2 size={14} /> Xóa
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog 
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={handleDeleteAll}
        isLoading={isDeletingAll}
        title="Xóa tất cả thông báo"
        message="Bạn có chắc chắn muốn xóa vĩnh viễn tất cả các thông báo hiện có? Hành động này không thể hoàn tác."
        confirmLabel="Xác nhận xóa hết"
      />
    </div>
  );
}

