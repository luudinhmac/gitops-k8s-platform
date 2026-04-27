import api from '@/lib/axios';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@portfolio/types';

export const categoryApi = {
  getAll: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryDto) => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCategoryDto) => {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};
