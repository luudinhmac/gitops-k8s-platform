import { Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(private settingsService: SettingsService) {}

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
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      this.logger.error(`Telegram API error: ${JSON.stringify(errorData)}`);
      return { success: false, error: errorData };
    }

    return { success: true };
  }
}
