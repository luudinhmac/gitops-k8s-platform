"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, MessageCircle, Reply, ShieldAlert, UserCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '@/features/notifications/services/notificationService';
import { Notification } from '@portfolio/contracts';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import UserAvatar from '@/features/users/components/UserAvatar';
import ConfirmationDialog from '@/shared/components/ui/ConfirmationDialog';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
      const countData = await notificationService.getUnreadCount();
      setUnreadCount(countData.count);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Simple polling every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      await notificationService.deleteAll();
      setNotifications([]);
      setUnreadCount(0);
      setShowConfirmDelete(false);
    } catch (err) {
      console.error('Error deleting all notifications:', err);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'COMMENT_ON_POST': return <MessageCircle size={14} className="text-blue-500" />;
      case 'REPLY_TO_COMMENT': return <Reply size={14} className="text-emerald-500" />;
      case 'POST_BLOCKED': return <ShieldAlert size={14} className="text-red-500" />;
      case 'USER_STATUS_CHANGE': 
      case 'USER_PERMISSION_CHANGE': return <UserCheck size={14} className="text-amber-500" />;
      default: return <Bell size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all relative group"
      >
        <Bell size={20} className={cn("transition-transform group-hover:scale-110", isOpen && "text-primary scale-110")} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff6b6b] px-1.5 text-[10px] font-black text-white border-2 border-white dark:border-slate-900 shadow-sm animate-in zoom-in duration-300">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Thông báo
                {unreadCount > 0 && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">{unreadCount} mới</span>}
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowConfirmDelete(true)}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                  title="Xóa tất cả"
                >
                  <Trash2 size={16} />
                </button>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-primary transition-all group"
                    title="Đã đọc hết"
                  >
                    <Check size={16} className="group-hover:scale-110 transition-transform" />
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scroll-thumb-slate-800">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4">
                    <Bell size={32} className="opacity-20" />
                  </div>
                  <p className="text-sm font-medium">Bạn chưa có thông báo nào</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={cn(
                        "p-4 flex gap-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 relative group/item",
                        !n.is_read && "bg-blue-50/30 dark:bg-primary/5"
                      )}
                    >
                      {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />}
                      
                      <div className="relative flex-shrink-0">
                        {n.Sender ? (
                          <UserAvatar user={n.Sender} size="md" className="rounded-lg shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {getIcon(n.type)}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 p-0.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                           <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded-full">
                              {getIcon(n.type)}
                           </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={cn("text-sm transition-colors", n.is_read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white font-bold")}>
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5 uppercase font-bold tracking-wider">
                            {new Date(n.created_at).toLocaleDateString('vi-VN', { 
                              day: '2-digit', 
                              month: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {n.content}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                           {!n.is_read && (
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                               className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                             >
                                Đã đọc
                             </button>
                           )}
                           <button 
                             onClick={(e) => { 
                               e.stopPropagation(); 
                               notificationService.delete(n.id).then(() => setNotifications(prev => prev.filter(item => item.id !== n.id)));
                             }}
                             className="text-[10px] font-bold text-red-500/70 hover:text-red-500 uppercase tracking-widest ml-auto"
                           >
                              Xóa
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/notifications');
                  }}
                  className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Xem tất cả thông báo
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal */}
      <ConfirmationDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteAll}
        title="Xóa tất cả thông báo"
        message="Bạn có chắc chắn muốn xóa toàn bộ thông báo không? Hành động này không thể hoàn tác."
        confirmLabel="Xác nhận xóa"
        cancelLabel="Hủy bỏ"
        variant="danger"
        isLoading={isDeletingAll}
      />
    </div>
  );
};

export default NotificationBell;

