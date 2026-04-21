import { Injectable, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { TeamsService } from '../teams/teams.service';
import { MailService } from '../mail/mail.service';
import { AdminAlertService } from '../admin-alert/admin-alert.service';
import { EncryptionUtil } from '../utils/encryption.util';
import * as os from 'os';

const SENSITIVE_KEYS = [
  'telegram_bot_token',
  'telegram_chat_id',
  'teams_webhook_url',
  'mail_user',
  'mail_pass',
  'maintenance_passcode'
];

const MASK_VALUE = '********';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => TelegramService))
    private telegramService: TelegramService,
    @Inject(forwardRef(() => TeamsService))
    private teamsService: TeamsService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
    @Inject(forwardRef(() => AdminAlertService))
    private adminAlertService: AdminAlertService,
  ) { }

  async getPublicSettings() {
    const settings = await this.prisma.setting.findMany({
      where: { is_public: true },
    });

    return settings.reduce((acc, current) => {
      acc[current.key] = current.value;
      return acc;
    }, {});
  }

  async getSettingByKey(key: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });
    if (!setting) return null;

    // Decrypt if it's a sensitive key and is encrypted
    if (SENSITIVE_KEYS.includes(key)) {
      return EncryptionUtil.decrypt(setting.value);
    }

    return setting.value;
  }

  async requestMaintenanceCode(ip: string = 'unknown') {
    // 1. Verify maintenance mode is actually ON
    const isMaintenance = await this.getSettingByKey('maintenance_global');
    if (isMaintenance !== 'true') {
      return { success: false, error: 'Chế độ bảo trì hiện đang TẮT. Không cần mã truy cập.' };
    }

    // 2. Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10); // 10 minutes valid

    // 3. Save to database
    try {
      // Optional: Cleanup old expired codes to keep DB clean
      await this.prisma.maintenanceCode.deleteMany({
        where: { OR: [
          { expires_at: { lt: new Date() } },
          { is_used: true }
        ]}
      });

      await this.prisma.maintenanceCode.create({
        data: {
          code,
          expires_at: expiry,
          is_used: false
        }
      });

      // 4. Send Notification
      this.adminAlertService.sendAlert({
        subject: `🔐 MÃ TRUY CẬP BẢO TRÌ (Maintenance Code)`,
        text: `🔐 <b>YÊU CẦU TRUY CẬP HỆ THỐNG</b>\n\n` +
              `Hệ thống đang trong trạng thái bảo trì. Một yêu cầu truy cập đã được thực hiện:\n\n` +
              `• <b>Mã xác thực:</b> <code>${code}</code>\n` +
              `• <b>Hiệu lực:</b> 10 phút (đến ${expiry.toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })})\n` +
              `• <b>Địa chỉ IP:</b> ${ip}\n\n` +
              `<i>Vui lòng không chia sẻ mã này với bất kỳ ai.</i>`,
      });

      return { success: true, message: 'Mã truy cập đã được gửi qua các hệ thống thông báo.' };
    } catch (error) {
      this.logger.error('Failed to generate maintenance code', error);
      return { success: false, error: 'Không thể tạo mã xác thực vào lúc này.' };
    }
  }

  async verifyMaintenancePasscode(passcode: string) {
    // 1. Try verify as dynamic maintenance code first
    const record = await this.prisma.maintenanceCode.findFirst({
      where: {
        code: passcode,
        is_used: false,
        expires_at: { gt: new Date() }
      },
      orderBy: { created_at: 'desc' }
    });

    if (record) {
      // Mark as used immediately
      await this.prisma.maintenanceCode.update({
        where: { id: record.id },
        data: { is_used: true }
      });
      return true;
    }

    // 2. Fallback to static passcode (for emergency or as requested)
    const savedPasscode = await this.getSettingByKey('maintenance_passcode');
    if (!savedPasscode) return false;
    return savedPasscode === passcode;
  }

  async getAllSettings() {
    const settings = await this.prisma.setting.findMany();

    // Group DB Settings
    const dbSettings = settings.reduce((acc, current) => {
      if (!acc[current.group]) acc[current.group] = {};

      let value = current.value;
      if (SENSITIVE_KEYS.includes(current.key)) {
        value = MASK_VALUE;
      }

      acc[current.group][current.key] = value;
      return acc;
    }, {} as Record<string, any>);

    // Get ENV settings (Redacted for security)
    const envSettings = {
      NODE_ENV: process.env.NODE_ENV || 'development',
      DATABASE_URL: process.env.DATABASE_URL ? '********' : 'Not setup',
      JWT_SECRET: process.env.JWT_SECRET ? '********' : 'Not setup',
      PORT: process.env.PORT || '3001',
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    };

    const systemInfo = {
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
      totalMem: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      freeMem: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      nodeVersion: process.version,
    };

    return {
      dbConfig: dbSettings,
      envConfig: envSettings,
      systemInfo,
    };
  }

  async updateSettings(items: { key: string; value: string; group?: string; is_public?: boolean }[], user?: any, ip?: string) {
    // Check if any sensitive group is being updated
    const sensitiveGroups = ['telegram', 'teams', 'mail'];
    const isUpdatingSensitive = items.some(item => item.group && sensitiveGroups.includes(item.group));
    
    if (isUpdatingSensitive && user?.role !== 'superadmin') {
      const { ForbiddenException } = require('@nestjs/common');
      throw new ForbiddenException('Chỉ Superadmin mới có quyền thay đổi cấu hình Cảnh báo Quản trị.');
    }

    try {
      const queries = items.filter(item => item.value !== MASK_VALUE).map((item) => {
        let finalValue = item.value;

        // Encrypt if sensitive and NOT already encrypted
        if (SENSITIVE_KEYS.includes(item.key) && item.value && !EncryptionUtil.isEncrypted(item.value)) {
          let cleanValue = item.value.trim();
          
          if (item.key === 'telegram_bot_token') {
            if (cleanValue.toLowerCase().startsWith('bot')) {
              cleanValue = cleanValue.substring(3).trim();
            }
            cleanValue = cleanValue.replace(/[^0-9a-zA-Z:\-_]/g, '');
          } else if (item.key === 'teams_webhook_url') {
            cleanValue = cleanValue.trim();
          }
          
          finalValue = EncryptionUtil.encrypt(cleanValue);
        }

        return this.prisma.setting.upsert({
          where: { key: item.key },
          update: {
            value: finalValue,
            ...(item.group && { group: item.group }),
            ...(item.is_public !== undefined && { is_public: item.is_public })
          },
          create: {
            key: item.key,
            value: finalValue,
            group: item.group || 'general',
            is_public: item.is_public !== undefined ? item.is_public : true,
          },
        });
      });

      await this.prisma.$transaction(queries);

      // --- DETAILED AUDIT NOTIFICATION ---
      const changedKeys = items.map(i => i.key);
      const username = user?.username || 'Hệ thống';
      const userIp = ip || 'unknown';

      // Describe actions based on keys
      const actions = changedKeys.map(key => {
        if (key === 'maintenance_global') return 'Thay đổi trạng thái Bảo trì toàn cầu';
        if (key === 'maintenance_posts') return 'Thay đổi trạng thái Bảo trì bài viết';
        if (key === 'maintenance_comments') return 'Thay đổi trạng thái Bảo trì bình luận';
        if (key === 'maintenance_passcode') return 'Cập nhật mã bảo trì';
        return `Cập nhật cấu hình: ${key}`;
      }).join(', ');

      this.adminAlertService.sendAlert({
        subject: `⚙️ Cài đặt hệ thống đã đổi: ${username}`,
        text: `⚙️ <b>CÀI ĐẶT HỆ THỐNG ĐÃ CẬP NHẬT</b>\n\n` +
              `• <b>Hành động:</b> ${actions}\n` +
              `• <b>IP:</b> ${userIp}\n` +
              `• <b>User:</b> ${username}\n` +
              `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
      });

      return { message: 'Settings updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update settings');
    }
  }

  async flushCache() {
    // Implement cache flushing logic if needed later
    return { message: 'Cache flushed successfully' };
  }

  async testTelegram(token: string, chatId: string) {
    try {
      // Use stored values if mask or empty provided
      if (token === MASK_VALUE || !token) {
        token = (await this.getSettingByKey('telegram_bot_token')) || '';
      }
      if (chatId === MASK_VALUE || !chatId) {
        chatId = (await this.getSettingByKey('telegram_chat_id')) || '';
      }

      if (!token || !chatId) {
        return { success: false, error: 'Thiếu cấu hình Telegram (Token hoặc Chat ID).' };
      }

      const message = `🔔 <b>Test Thông báo Hệ thống</b>\n\nNội dung này xác nhận rằng Bot Telegram của bạn đã được cấu hình thành công trên Website.\n\n📅 <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`;
      return await this.telegramService.sendToTelegram(token, chatId, message);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async testTeams(webhookUrl: string) {
    try {
      // Use stored value if mask or empty provided
      if (webhookUrl === MASK_VALUE || !webhookUrl) {
        webhookUrl = (await this.getSettingByKey('teams_webhook_url')) || '';
      }

      if (!webhookUrl) {
        return { success: false, error: 'Thiếu cấu hình Webhook URL của MS Teams.' };
      }

      const msg = `🔔 <b>Thông báo thử nghiệm MS Teams</b>\n\nCấu hình kết nối Webhook thành công! Đã có thể nhận cảnh báo từ ứng dụng.\n\n📅 <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`;
      return await this.teamsService.sendMessage(msg, webhookUrl);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async testEmail(config: { host: string; port: string; user: string; pass: string; to: string }) {
    const subject = '🔔 Thông báo thử nghiệm Email';
    const text = 'Hệ thống đã kết nối thành công với máy chủ Email của bạn.';
    const html = `<h3>Thành công!</h3><p>${text}</p><p>📅 <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>`;

    // Use stored values if masks provided
    if (config.user === MASK_VALUE || !config.user) {
      config.user = (await this.getSettingByKey('mail_user')) || '';
    }
    if (config.pass === MASK_VALUE || !config.pass) {
      config.pass = (await this.getSettingByKey('mail_pass')) || '';
    }

    if (!config.user || !config.pass) {
      return { success: false, error: 'Thiếu cấu hình tài khoản Email (User hoặc Pass).' };
    }

    // We use nodemailer directly for testing to avoid forcing a save first
    const nodemailer = require('nodemailer');
    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: parseInt(config.port),
        secure: parseInt(config.port) === 465,
        auth: { user: config.user, pass: config.pass },
      });
      await transporter.sendMail({
        from: `"Hệ thống" <${config.user}>`,
        to: config.to,
        subject,
        text,
        html,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
