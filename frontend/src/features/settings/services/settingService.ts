import api from '@/lib/axios';
import axios from 'axios';

const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api';

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
      // Use raw axios to prevent interceptors from redirecting in loops during maintenance
      const response = await axios.get(`${getBaseUrl()}/settings/public?t=${Date.now()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public settings:', error);
      throw error;
    }
  },

  // Maintenance passcode APIs
  requestMaintenanceCode: async () => {
    const response = await axios.post(`${getBaseUrl()}/settings/request-maintenance-code`);
    return response.data;
  },

  verifyMaintenancePasscode: async (passcode: string) => {
    const response = await axios.post(`${getBaseUrl()}/settings/verify-maintenance-passcode`, { passcode });
    return response.data;
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
  },

  // Test MS Teams connection
  testTeams: async (webhookUrl: string) => {
    try {
      const response = await api.post('/settings/admin/test-teams', { webhookUrl });
      return response.data;
    } catch (error) {
      console.error('Error testing MS Teams connection:', error);
      throw error;
    }
  },

  // Test Email connection
  testEmail: async (config: { host: string; port: string; user: string; pass: string; to: string }) => {
    try {
      const response = await api.post('/settings/admin/test-email', config);
      return response.data;
    } catch (error) {
      console.error('Error testing Email connection:', error);
      throw error;
    }
  }
};

