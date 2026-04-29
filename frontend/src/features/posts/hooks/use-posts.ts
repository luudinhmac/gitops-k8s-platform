import { useState, useCallback } from 'react';
import { postApi } from '../api/post-api';
import { Post, PostSortOption } from '@/types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (params?: {
    q?: string;
    userId?: number;
    sort?: PostSortOption;
    page?: number;
    limit?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await postApi.getPosts(params);
      if (response.success && response.data) {
        setPosts(response.data);
        setTotal(response.meta.total);
      } else {
        setError(response.message || 'Failed to fetch posts');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    posts,
    total,
    isLoading,
    error,
    fetchPosts,
  };
};
