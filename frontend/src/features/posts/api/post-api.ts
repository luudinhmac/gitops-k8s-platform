import api from '../../../lib/axios';
import { Post, ApiResponse, PaginatedResponse, PostSortOption } from '../../../types';

export const postApi = {
  getPosts: async (params?: {
    q?: string;
    userId?: number;
    sort?: PostSortOption;
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await api.get<PaginatedResponse<Post>>('/posts', { params });
    return response.data;
  },

  getAdminPosts: async (params?: {
    q?: string;
    status?: string;
    sort?: PostSortOption;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<PaginatedResponse<Post>>('/posts/admin', { params });
    return response.data;
  },

  getPost: async (idOrSlug: string | number, action?: 'view') => {
    const response = await api.get<Post>(`/posts/${idOrSlug}`, {
      params: { action }
    });
    return response.data;
  },

  createPost: async (data: any) => {
    const response = await api.post<Post>('/posts', data);
    return response.data;
  },

  updatePost: async (id: number, data: any) => {
    const response = await api.patch<Post>(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: number) => {
    const response = await api.delete<{ success: boolean }>(`/posts/${id}`);
    return response.data;
  },

  togglePin: async (id: number) => {
    const response = await api.post<Post>(`/posts/${id}/pin`);
    return response.data;
  },

  togglePublish: async (id: number, reason?: string) => {
    const response = await api.post<Post>(`/posts/${id}/publish`, { reason });
    return response.data;
  },

  toggleLike: async (id: number) => {
    const response = await api.post<{ liked: boolean }>(`/posts/${id}/like`);
    return response.data;
  },
};
