import api from '../lib/axios';

export const seriesService = {
  getAll: async () => {
    const response = await api.get('/series');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/series/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/series/${slug}`);
    return response.data;
  },

  create: async (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const response = await api.post('/series', { name, slug });
    return response.data;
  },

  update: async (id: number, name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const response = await api.patch(`/series/${id}`, { name, slug });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/series/${id}`);
    return response.data;
  }
};
