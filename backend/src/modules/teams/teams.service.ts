import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    @Inject(forwardRef(() => SettingsService))
    private settingsService: SettingsService,
  ) {}

  async sendMessage(text: string, webhookUrlOverride?: string) {
    try {
      const enabled = await this.settingsService.getSettingByKey('teams_enabled');
      if (enabled !== 'true' && !webhookUrlOverride) return { success: true, skipped: true };

      const webhookUrl = (webhookUrlOverride || await this.settingsService.getSettingByKey('teams_webhook_url'))?.trim();

      if (!webhookUrl) {
        this.logger.warn('Teams notification enabled but webhook URL is missing');
        return { success: false, error: 'Webhook URL missing' };
      }

      try {
        new URL(webhookUrl);
      } catch (err) {
        this.logger.error(`Invalid Teams Webhook URL: ${webhookUrl}`);
        return { success: false, error: 'Invalid Webhook URL format' };
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'message',
          attachments: [
            {
              contentType: 'application/vnd.microsoft.card.adaptive',
              content: {
                type: 'AdaptiveCard',
                body: [
                  {
                    type: 'TextBlock',
                    size: 'Medium',
                    weight: 'Bolder',
                    text: '🔔 Thông báo Thử nghiệm',
                  },
                  {
                    type: 'TextBlock',
                    text: text,
                    wrap: true,
                  },
                ],
                $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                version: '1.4',
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        this.logger.error(`Teams Webhook error (Status ${response.status}): ${errorText}`);
        return { success: false, error: errorText };
      }

      return { success: true };
    } catch (error: any) {
      this.logger.error(`Failed to send MS Teams message (Connection Error): ${error.message}`);
      return { success: false, error: `Connection Error: ${error.message}` };
    }
  }
}
