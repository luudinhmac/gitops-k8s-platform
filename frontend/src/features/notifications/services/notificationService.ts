import api from '@/lib/axios';
import { Notification } from '@portfolio/contracts';

export const notificationService = {
  async getAll(unreadOnly: boolean = false) {
    const response = await api.get<Notification[]>('/notifications', { params: { unreadOnly } });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get<{ count: number }>('/notifications/unread-count');
    return response.data;
  },

  async markAsRead(id: number) {
    const response = await api.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  async deleteAll() {
    const response = await api.delete('/notifications/all');
    return response.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

