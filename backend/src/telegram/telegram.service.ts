import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { SettingsService } from '../modules/settings/settings.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    @Inject(forwardRef(() => SettingsService))
    private settingsService: SettingsService
  ) {}

  async sendSystemNotification(message: string) {
    try {
      const enabled = await this.settingsService.getSettingByKey('telegram_enabled');
      if (enabled !== 'true') return;

      const token = await this.settingsService.getSettingByKey('telegram_bot_token');
      const chatId = await this.settingsService.getSettingByKey('telegram_chat_id');

      if (!token || !chatId) {
        this.logger.warn('Telegram notifications enabled but token or chat_id is missing');
        return;
      }

      await this.sendToTelegram(token, chatId, message);
    } catch (error: any) {
      this.logger.error(`Failed to send Telegram system notification: ${error.message}`);
    }
  }

  async sendToTelegram(token: string, chatId: string, text: string) {
    try {
      // 1. Aggressive Sanitization: Only keep [0-9], [a-z], [A-Z], "-", "_", and ":"
      let cleanToken = (token || '').trim();
      
      // Remove double 'bot' prefix if exists
      if (cleanToken.toLowerCase().startsWith('bot')) {
        cleanToken = cleanToken.substring(3).trim();
      }
      
      // Keep only valid characters for a Telegram token
      cleanToken = cleanToken.replace(/[^0-9a-zA-Z:\-_]/g, '');

      const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;
      
      // Log masked URL for diagnostics
      const maskedToken = cleanToken.length > 10 ? `${cleanToken.substring(0, 4)}...${cleanToken.substring(cleanToken.length - 4)}` : '***';
      this.logger.debug(`Calling Telegram: https://api.telegram.org/bot${maskedToken}/sendMessage`);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId?.trim().replace(/[^0-9\-]/g, ''), // Chat IDs are numeric or negative numeric
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.logger.error(`Telegram API error (Status ${response.status}): ${JSON.stringify(errorData)}`);
        return { success: false, error: errorData.description || `Status ${response.status}` };
      }

      return { success: true };
    } catch (error: any) {
      this.logger.error(`Telegram connection error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
