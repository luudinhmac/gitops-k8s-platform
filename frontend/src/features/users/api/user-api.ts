import api from '@/lib/axios';
import { User, CreateUserDto, UpdateUserDto } from '@portfolio/types';

export const userApi = {
  getProfile: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (id: number, data: UpdateUserDto) => {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  changePassword: async (id: number, data: any) => {
    const response = await api.patch(`/users/${id}/change-password`, data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  create: async (data: CreateUserDto) => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  updatePermissions: async (id: number, data: { role?: string; is_active?: boolean; can_comment?: boolean; can_post?: boolean; reason?: string }) => {
    const response = await api.patch(`/users/${id}/permissions`, data);
    return response.data;
  },

  resetPassword: async (id: number, data: any) => {
    const response = await api.patch(`/users/${id}/reset-password`, data);
    return response.data;
  },

  uploadAvatar: async (formData: FormData) => {
    const response = await api.post('/upload?type=avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
