import api from '@/lib/axios';

export const authService = {
  login: async (formData: Record<string, unknown>) => {
    const response = await api.post('/auth/login', formData);
    return response.data;
  },

  register: async (formData: Record<string, unknown>) => {
    const response = await api.post('/auth/register', formData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

