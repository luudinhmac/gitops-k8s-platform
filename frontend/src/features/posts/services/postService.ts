import api from '@/lib/axios';
import { Post } from '@portfolio/contracts';

export const postService = {
  // Get all posts (public)
  async getAll(options: { q?: string; limit?: number; page?: number; userId?: number; sort?: string } = {}) {
    const response = await api.get<{ data: Post[]; meta: any }>('/posts', { params: options });
    return response.data;
  },

  // Get admin posts (for management)
  async getAdminPosts(params: { q?: string; status?: string; sort?: string; page?: number; limit?: number } = {}) {
    const response = await api.get<{ data: Post[]; meta: any }>('/posts/admin', { params });
    return response.data;
  },

  // Get current user posts
  async getMyPosts(params: { q?: string; status?: string; sort?: string; page?: number; limit?: number } = {}) {
    const response = await api.get<{ data: Post[]; meta: any }>('/posts/my-posts', { params });
    return response.data;
  },

  // Get single post
  async getBySlug(slug: string) {
    const response = await api.get<Post>(`/posts/${slug}`);
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  async create(data: Partial<Post>) {
    const response = await api.post<Post>('/posts', data);
    return response.data;
  },

  // Delete post
  async delete(id: number) {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Toggle publish status
  async togglePublish(id: number, reason?: string) {
    const response = await api.post(`/posts/${id}/publish`, { reason });
    return response.data;
  },

  // Toggle pin status
  async togglePin(id: number) {
    const response = await api.post(`/posts/${id}/pin`);
    return response.data;
  },

  // Edit/Update post
  async update(id: number, data: Partial<Post>) {
    const response = await api.patch<Post>(`/posts/${id}`, data);
    return response.data;
  },

  // Like post
  async toggleLike(id: number) {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  // Get like status
  async getLikeStatus(id: number) {
    const response = await api.get(`/posts/${id}/like-status`);
    return response.data;
  },

  // Increment view
  async incrementView(id: number) {
    const response = await api.get(`/posts/${id}?action=view`);
    return response.data;
  }
};

