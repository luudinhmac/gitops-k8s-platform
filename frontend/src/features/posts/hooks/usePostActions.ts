import { useState } from 'react';
import { postService } from '../services/postService';

export const usePostActions = (onSuccess?: () => void) => {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const deletePost = async (id: number) => {
    setIsActionLoading(true);
    try {
      await postService.delete(id);
      onSuccess?.();
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  const togglePublish = async (id: number, reason?: string) => {
    setIsActionLoading(true);
    try {
      await postService.togglePublish(id, reason);
      onSuccess?.();
    } catch (error) {
      console.error('Toggle publish error:', error);
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  const togglePin = async (id: number) => {
    setIsActionLoading(true);
    try {
      await postService.togglePin(id);
      onSuccess?.();
    } catch (error) {
      console.error('Toggle pin error:', error);
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleLike = async (id: number) => {
    setIsActionLoading(true);
    try {
      await postService.toggleLike(id);
      onSuccess?.();
    } catch (error) {
      console.error('Toggle like error:', error);
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    deletePost,
    togglePublish,
    togglePin,
    toggleLike,
    isActionLoading,
  };
};
