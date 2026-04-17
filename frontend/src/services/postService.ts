import api from '@/lib/axios';
import { Post } from '@/types/post';

export const postService = {
  // Get all posts (public)
  async getAll(options: { q?: string; limit?: number } = {}) {
    const { q, limit } = options;
    const response = await api.get<Post[]>('/posts', { params: { q, limit } });
    return response.data;
  },

  // Get admin posts (for management)
  async getAdminPosts() {
    const response = await api.get<Post[]>('/posts/admin');
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

  async create(data: any) {
    const response = await api.post<Post>('/posts', data);
    return response.data;
  },

  // Delete post
  async delete(id: number) {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Toggle publish status
  async togglePublish(id: number) {
    const response = await api.patch(`/posts/${id}/publish`);
    return response.data;
  },

  // Toggle pin status
  async togglePin(id: number) {
    const response = await api.patch(`/posts/${id}/pin`);
    return response.data;
  },

  // Edit/Update post
  async update(id: number, data: any) {
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
