import api from '@/lib/axios';

export const commentService = {
  getByPost: async (postId: number) => {
    const response = await api.get(`/comments?post_id=${postId}`);
    return response.data;
  },

  create: async (data: { 
    content: string; 
    post_id: number; 
    parent_id?: number | null;
    user_id?: number | null;
    author_name?: string;
    author_email?: string | null;
  }) => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  update: async (id: number, content: string) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  updateStatus: async (id: number, status: 'approved' | 'rejected') => {
    const response = await api.patch(`/comments/${id}`, { status });
    return response.data;
  }
};

