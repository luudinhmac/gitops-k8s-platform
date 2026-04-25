import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';
import { TeamsService } from '../teams/teams.service';
import { MailService } from '../mail/mail.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class AdminAlertService {
  private readonly logger = new Logger(AdminAlertService.name);

  constructor(
    private telegramService: TelegramService,
    private teamsService: TeamsService,
    private mailService: MailService,
    @Inject(forwardRef(() => SettingsService))
    private settingsService: SettingsService,
  ) {}

  async sendAlert(options: { 
    subject: string; 
    text: string; 
    html?: string; 
  }) {
    const { subject, text, html } = options;
    const results: any = {};

    try {
      results.telegram = await this.telegramService.sendSystemNotification(text);
      const teamsText = text.replace(/<b>/g, '**').replace(/<\/b>/g, '**');
      results.teams = await this.teamsService.sendMessage(teamsText);

      const mailEnabled = await this.settingsService.getSettingByKey('mail_enabled');
      if (mailEnabled === 'true') {
        const adminRecipient = await this.settingsService.getSettingByKey('mail_admin_recipient');
        if (adminRecipient) {
          results.email = await this.mailService.sendMail(adminRecipient, subject, text, html || text);
        } else {
          this.logger.warn('Email alerts enabled but mail_admin_recipient is missing');
        }
      }
      return results;
    } catch (error: any) {
      this.logger.error(`Error in AdminAlertService dispatcher: ${error.message}`);
      return { error: error.message };
    }
  }
}
