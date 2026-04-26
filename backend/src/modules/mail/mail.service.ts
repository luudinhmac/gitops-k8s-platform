import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { SettingsService } from '../modules/settings/settings.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject(forwardRef(() => SettingsService))
    private settingsService: SettingsService,
  ) {}

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      const host = await this.settingsService.getSettingByKey('mail_host');
      const port = await this.settingsService.getSettingByKey('mail_port');
      const user = await this.settingsService.getSettingByKey('mail_user');
      const pass = await this.settingsService.getSettingByKey('mail_pass');
      const from = await this.settingsService.getSettingByKey('mail_from') || user;

      if (!host || !port || !user || !pass) {
        this.logger.warn('Mail configuration is incomplete');
        return { success: false, error: 'Incomplete configuration' };
      }

      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465,
        auth: { user, pass },
      });

      const info = await transporter.sendMail({
        from: `"Hệ thống Thông báo" <${from}>`,
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
