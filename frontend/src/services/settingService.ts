import api from '@/lib/axios';

export interface SettingItem {
  key: string;
  value: string;
  group?: string;
  is_public?: boolean;
}

export interface SettingsConfig {
  dbConfig: Record<string, Record<string, string>>;
  envConfig: Record<string, string>;
  systemInfo: Record<string, string>;
}

export const settingService = {
  // Get public settings (for frontend website use)
  getPublicSettings: async () => {
    try {
      const response = await api.get('/settings/public');
      return response.data;
    } catch (error) {
      console.error('Error fetching public settings:', error);
      throw error;
    }
  },

  // Get all settings (for admin dashboard)
  getAllSettings: async (): Promise<SettingsConfig> => {
    try {
      // Add timestamp to bypass any browser or server caching
      const response = await api.get(`/settings/admin?t=${Date.now()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin settings:', error);
      throw error;
    }
  },

  // Update settings in batch
  updateSettings: async (items: SettingItem[]) => {
    try {
      const response = await api.put('/settings/admin', { items });
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Flush cache
  flushCache: async () => {
    try {
      const response = await api.post('/settings/admin/flush-cache');
      return response.data;
    } catch (error) {
      console.error('Error flushing cache:', error);
      throw error;
    }
  },

  // Test Telegram connection
  testTelegram: async (token: string, chatId: string) => {
    try {
      const response = await api.post('/settings/admin/test-telegram', { token, chatId });
      return response.data;
    } catch (error) {
      console.error('Error testing telegram connection:', error);
      throw error;
    }
  }
};
