import { Injectable, InternalServerErrorException, Inject, forwardRef, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { TeamsService } from '../teams/teams.service';
import { MailService } from '../mail/mail.service';
import { AdminAlertService } from '../admin-alert/admin-alert.service';
import { EncryptionUtil } from '../../utils/encryption.util';
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
  private readonly logger = new Logger(SettingsService.name);

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

    if (SENSITIVE_KEYS.includes(key)) {
      return EncryptionUtil.decrypt(setting.value);
    }

    return setting.value;
  }

  async requestMaintenanceCode(ip: string = 'unknown') {
    const isMaintenance = await this.getSettingByKey('maintenance_global');
    if (isMaintenance !== 'true') {
      return { success: false, error: 'Chế độ bảo trì hiện đang TẮT. Không cần mã truy cập.' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);

    try {
      const prisma = this.prisma as any;
      await prisma.maintenanceCode.deleteMany({
        where: {
          OR: [
            { expires_at: { lt: new Date() } },
            { is_used: true }
          ]
        }
      });

      await prisma.maintenanceCode.create({
        data: {
          code,
          expires_at: expiry,
          is_used: false
        }
      });

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
    const prisma = this.prisma as any;
    const record = await prisma.maintenanceCode.findFirst({
      where: {
        code: passcode,
        is_used: false,
        expires_at: { gt: new Date() }
      },
      orderBy: { created_at: 'desc' }
    });

    if (record) {
      await prisma.maintenanceCode.update({
        where: { id: record.id },
        data: { is_used: true }
      });
      return true;
    }

    const savedPasscode = await this.getSettingByKey('maintenance_passcode');
    if (!savedPasscode) return false;
    return savedPasscode === passcode;
  }

  async getAllSettings() {
    const settings = await this.prisma.setting.findMany();

    const dbSettings = settings.reduce((acc, current) => {
      if (!acc[current.group]) acc[current.group] = {};
      let value = current.value;
      if (SENSITIVE_KEYS.includes(current.key)) {
        value = MASK_VALUE;
      }
      acc[current.group][current.key] = value;
      return acc;
    }, {} as Record<string, any>);

    const envSettings = {
      NODE_ENV: process.env.NODE_ENV || 'development',
      DATABASE_URL: process.env.DATABASE_URL ? '********' : 'Not setup',
      JWT_SECRET: process.env.JWT_SECRET ? '********' : 'Not setup',
      PORT: process.env.PORT || '3002',
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
    const sensitiveGroups = ['telegram', 'teams', 'mail'];
    const isUpdatingSensitive = items.some(item => item.group && sensitiveGroups.includes(item.group));

    if (isUpdatingSensitive && user?.role !== 'superadmin') {
      const { ForbiddenException } = require('@nestjs/common');
      throw new ForbiddenException('Chỉ Superadmin mới có quyền thay đổi cấu hình Cảnh báo Quản trị.');
    }

    try {
      // 1. Fetch current values to detect changes
      const currentSettings = await this.prisma.setting.findMany({
        where: { key: { in: items.map(i => i.key) } }
      });
      const currentMap = currentSettings.reduce((acc, s) => {
        acc[s.key] = s.value || '';
        return acc;
      }, {} as Record<string, string>);

      // 2. Identify actual changes
      const changedItems = items.filter(item => {
        if (item.value === MASK_VALUE) return false;

        const currentValue = currentMap[item.key];
        let newValue = item.value;

        // If sensitive, we need to compare with decrypted value
        if (SENSITIVE_KEYS.includes(item.key)) {
          const decryptedCurrent = currentValue ? EncryptionUtil.decrypt(currentValue) : null;
          return newValue !== decryptedCurrent;
        }

        return newValue !== currentValue;
      });

      if (changedItems.length === 0) {
        return { message: 'No changes detected' };
      }

      // 3. Prepare human-readable actions for notification
      const SETTING_NAMES: Record<string, string> = {
        site_title: 'Tên website',
        site_tagline: 'Mô tả ngắn',
        default_lang: 'Ngôn ngữ mặc định',
        timezone: 'Múi giờ',
        comments_enabled: 'Tính năng bình luận toàn trang',
        footer_copyright: 'Bản quyền footer',
        ads_enabled: 'Hiển thị quảng cáo',
        maintenance_global: 'Chế độ bảo trì hệ thống',
        maintenance_posts: 'Chế độ bảo trì bài viết',
        maintenance_comments: 'Chế độ bảo trì bình luận',
        maintenance_passcode: 'Mã bảo trì',
        telegram_bot_token: 'Token Bot Telegram',
        telegram_chat_id: 'ID Chat Telegram',
        teams_webhook_url: 'Webhook MS Teams',
        mail_user: 'Tài khoản Email',
        mail_pass: 'Mật khẩu Email',
        mail_host: 'Máy chủ Email',
        mail_port: 'Cổng Email',
        ga_id: 'Google Analytics ID',
        fb_pixel_id: 'Facebook Pixel ID',
      };

      const actions = changedItems.map(item => {
        const name = SETTING_NAMES[item.key] || item.key;
        if (SENSITIVE_KEYS.includes(item.key)) return `Cập nhật ${name} (Bảo mật)`;

        if (item.value === 'true') return `<b>Bật</b> ${name}`;
        if (item.value === 'false') return `<b>Tắt</b> ${name}`;

        // Truncate long text
        const displayValue = item.value.length > 50 ? item.value.substring(0, 50) + '...' : item.value;
        return `Thay đổi ${name} thành: "<i>${displayValue}</i>"`;
      }).join('\n• ');

      const queries = changedItems.map((item) => {
        let finalValue = item.value;
        if (SENSITIVE_KEYS.includes(item.key) && item.value && !EncryptionUtil.isEncrypted(item.value)) {
          let cleanValue = item.value.trim();
          if (item.key === 'telegram_bot_token') {
            if (cleanValue.toLowerCase().startsWith('bot')) {
              cleanValue = cleanValue.substring(3).trim();
            }
            cleanValue = cleanValue.replace(/[^0-9a-zA-Z:\-_]/g, '');
          }
          finalValue = EncryptionUtil.encrypt(cleanValue);
        }

        let effectiveGroup = item.group || 'general';
        if (item.key.startsWith('telegram_')) effectiveGroup = 'telegram';
        else if (item.key.startsWith('teams_')) effectiveGroup = 'teams';
        else if (item.key.startsWith('mail_')) effectiveGroup = 'mail';
        else if (item.key.startsWith('maintenance_')) effectiveGroup = 'maintenance';
        else if (item.key === 'ga_id' || item.key === 'fb_pixel_id' || item.key.includes('adsense') || item.key.includes('scripts')) {
          effectiveGroup = 'marketing';
        }

        return this.prisma.setting.upsert({
          where: { key: item.key },
          update: {
            value: finalValue,
            group: effectiveGroup,
            ...(item.is_public !== undefined && { is_public: item.is_public })
          },
          create: {
            key: item.key,
            value: finalValue,
            group: effectiveGroup,
            is_public: item.is_public !== undefined ? item.is_public : true,
          },
        });
      });

      await this.prisma.$transaction(queries);

      const username = user?.fullname || user?.username || 'Hệ thống';
      const userIp = ip || 'unknown';

      this.adminAlertService.sendAlert({
        subject: `⚙️ Cài đặt hệ thống đã đổi: ${username}`,
        text: `⚙️ <b>CÀI ĐẶT HỆ THỐNG ĐÃ CẬP NHẬT</b>\n\n` +
          `• ${actions}\n\n` +
          `• <b>IP:</b> <code>${userIp}</code>\n` +
          `• <b>User:</b> ${username}\n` +
          `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
      });

      return { message: 'Settings updated successfully', updatedCount: changedItems.length };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update settings');
    }
  }

  async flushCache() {
    return { message: 'Cache flushed successfully' };
  }

  async testTelegram(token: string, chatId: string) {
    try {
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
      if (webhookUrl === MASK_VALUE || !webhookUrl) {
        webhookUrl = (await this.getSettingByKey('teams_webhook_url')) || '';
      }

      if (!webhookUrl) {
        return { success: false, error: 'Thiếu cấu hình Webhook URL của MS Teams.' };
      }

      const msg = `🔔 <b>Thông báo MS Teams</b>\n\nCấu hình kết nối Webhook thành công! Đã có thể nhận cảnh báo từ ứng dụng.\n\n📅 <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`;
      return await this.teamsService.sendMessage(msg, webhookUrl);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async testEmail(config: { host: string; port: string; user: string; pass: string; to: string }) {
    const subject = '🔔 Thông báo Email';
    const text = 'Hệ thống đã kết nối thành công với máy chủ Email của bạn.';
    const html = `<h3>Thành công!</h3><p>${text}</p><p>📅 <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>`;

    if (config.user === MASK_VALUE || !config.user) {
      config.user = (await this.getSettingByKey('mail_user')) || '';
    }
    if (config.pass === MASK_VALUE || !config.pass) {
      config.pass = (await this.getSettingByKey('mail_pass')) || '';
    }

    if (!config.user || !config.pass) {
      return { success: false, error: 'Thiếu cấu hình tài khoản Email (User hoặc Pass).' };
    }

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
        ... (config.to && { to: config.to })
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
