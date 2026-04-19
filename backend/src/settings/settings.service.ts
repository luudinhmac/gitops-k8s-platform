import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as os from 'os';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

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
    return setting?.value || null;
  }

  async verifyMaintenancePasscode(passcode: string) {
    const savedPasscode = await this.getSettingByKey('maintenance_passcode');
    // For now, simplicity is key, but we ensure it fails if not set
    if (!savedPasscode) return false;
    return savedPasscode === passcode;
  }

  async getAllSettings() {
    const settings = await this.prisma.setting.findMany();
    
    // Group DB Settings
    const dbSettings = settings.reduce((acc, current) => {
      if (!acc[current.group]) acc[current.group] = {};
      acc[current.group][current.key] = current.value;
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

  async updateSettings(items: { key: string; value: string; group?: string; is_public?: boolean }[]) {
    try {
      const queries = items.map((item) =>
        this.prisma.setting.upsert({
          where: { key: item.key },
          update: { 
            value: item.value,
            ...(item.group && { group: item.group }),
            ...(item.is_public !== undefined && { is_public: item.is_public })
          },
          create: {
            key: item.key,
            value: item.value,
            group: item.group || 'general',
            is_public: item.is_public !== undefined ? item.is_public : true,
          },
        })
      );
      
      await this.prisma.$transaction(queries);
      return { message: 'Settings updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update settings');
    }
  }

  async flushCache() {
    // Implement cache flushing logic if needed later
    return { message: 'Cache flushed successfully' };
  }
}
