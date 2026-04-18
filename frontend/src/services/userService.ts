import api from '@/lib/axios';
import { User } from '@/types/user';

export const userService = {
  // Get current user profile
  async getProfile() {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  // Get user by ID (public info)
  async getById(id: number | string) {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Update user profile
  async updateProfile(id: number, data: Partial<User>) {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  // Change password
  async changePassword(id: number, data: Record<string, unknown>) {
    const response = await api.patch(`/users/${id}/change-password`, data);
    return response.data;
  },

  // Admin: Get all users
  async getAll() {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  // Admin: Create user
  async create(data: Record<string, unknown>) {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  // Admin: Delete user
  async delete(id: number) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Admin: Toggle status (Active/Banned)
  async toggleStatus(id: number, isActive: boolean) {
    const response = await api.patch(`/users/${id}/status`, { is_active: !isActive });
    return response.data;
  },

  // Admin: Update role
  async updateRole(id: number, role: string) {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  // Admin: Update permissions
  async updatePermissions(id: number, data: { role?: string; is_active?: boolean; can_comment?: boolean; can_post?: boolean }) {
    const response = await api.patch(`/users/${id}/permissions`, data);
    return response.data;
  },

  // Admin: Reset password
  async resetPassword(id: number, data: Record<string, unknown>) {
    const response = await api.patch(`/users/${id}/reset-password`, data);
    return response.data;
  },

  // Upload avatar
  async uploadAvatar(formData: FormData) {
    const response = await api.post('/upload?type=avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
