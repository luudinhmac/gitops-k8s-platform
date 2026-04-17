"use client";

import { useState } from 'react';
import { postService } from '@/services/postService';

export const usePostActions = (onSuccess?: () => void) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const deletePost = async (id: number) => {
    setIsActionLoading(true);
    setActionError(null);
    try {
      await postService.delete(id);
      onSuccess?.();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Không thể xóa bài viết';
      setActionError(msg);
      throw new Error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const togglePublish = async (id: number) => {
    setIsActionLoading(true);
    try {
      const updated = await postService.togglePublish(id);
      onSuccess?.();
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Lỗi khi thay đổi trạng thái';
      setActionError(msg);
      throw new Error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const togglePin = async (id: number) => {
    setIsActionLoading(true);
    try {
      const updated = await postService.togglePin(id);
      onSuccess?.();
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Lỗi khi ghim bài viết';
      setActionError(msg);
      throw new Error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  return { 
    deletePost, 
    togglePublish, 
    togglePin, 
    isActionLoading, 
    actionError,
    setActionError
  };
};
