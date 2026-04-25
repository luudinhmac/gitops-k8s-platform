import api from '@/lib/axios';

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  create: async (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const response = await api.post('/categories', { name, slug });
    return response.data;
  },

  update: async (id: number, name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const response = await api.patch(`/categories/${id}`, { name, slug });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

