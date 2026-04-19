import api from '../lib/axios';

export const settingsService = {
  async getPublicSettings() {
    try {
      const response = await api.get<Record<string, string>>('/settings/public');
      return response.data;
    } catch (err) {
      console.error('Failed to fetch public settings:', err);
      return {};
    }
  },

  async verifyPasscode(passcode: string) {
    const response = await api.post<{ success: boolean }>('/settings/verify-maintenance-passcode', { passcode });
    return response.data;
  }
};
