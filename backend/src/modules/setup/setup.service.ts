import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

@Injectable()
export class SetupService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus() {
    // Check if any user with role 'superadmin' exists
    const superadmin = await this.prisma.user.findFirst({
      where: { role: 'superadmin' },
    });

    // Check if the 'system_initialized' setting exists
    const initializedSetting = await this.prisma.setting.findUnique({
      where: { key: 'system_initialized' },
    });

    const isInitialized = !!superadmin || (initializedSetting?.value === 'true');

    // Get DB info directly from .env file for real-time updates
    let dbUrl = process.env.DATABASE_URL || '';
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
      if (match) {
        dbUrl = match[1];
      }
    }

    let dbConfig = {
      host: 'localhost',
      port: '5432',
      user: 'postgres',
      dbName: 'portfolio_db'
    };

    if (dbUrl) {
      try {
        const url = new URL(dbUrl);
        dbConfig = {
          user: url.username,
          host: url.hostname,
          port: url.port || '5432',
          dbName: url.pathname.substring(1).split('?')[0]
        };
      } catch (e) {
        console.error('[Setup] Failed to parse DATABASE_URL:', e.message);
      }
    }

    return {
      isInitialized,
      database: {
        ...dbConfig,
        status: 'connected',
      },
    };
  }

  async initialize(data: any) {
    const status = await this.getStatus();
    if (status.isInitialized) {
      throw new ForbiddenException('System is already initialized');
    }

    const { superuser, siteTitle, dbName } = data;

    // Verify DB name matches
    if (dbName && status.database.dbName !== dbName) {
      throw new ForbiddenException(`Database name mismatch. System is connected to "${status.database.dbName}" but you provided "${dbName}".`);
    }

    // 1. Create Superuser
    const hashedPassword = await bcrypt.hash(superuser.password, 10);
    await this.prisma.user.create({
      data: {
        username: superuser.username,
        email: superuser.email,
        password: hashedPassword,
        role: 'superadmin',
        fullname: 'System Administrator',
        is_active: true,
        profession: 'Superadmin',
      },
    });

    // 2. Seed default settings
    const defaultSettings = [
      { key: 'site_title', value: siteTitle || 'My Portfolio', group: 'general', is_public: true },
      { key: 'system_initialized', value: 'true', group: 'system', is_public: false },
      { key: 'maintenance_global', value: 'false', group: 'maintenance', is_public: true },
      { key: 'maintenance_posts', value: 'false', group: 'maintenance', is_public: true },
      { key: 'maintenance_comments', value: 'false', group: 'maintenance', is_public: true },
      { key: 'stats_total_visits', value: '0', group: 'stats', is_public: true },
    ];

    for (const setting of defaultSettings) {
      await this.prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
    }

    return { message: 'System initialized successfully' };
  }

  async testConnection(config: any) {
    const { host, port, user, password, dbName } = config;
    console.log(`[Setup] Testing connection to ${host}:${port}/${dbName} for user ${user}`);
    
    const client = new Client({
      host,
      port: parseInt(port),
      user,
      password,
      database: dbName,
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      await client.query('SELECT 1');
      console.log(`[Setup] Connection test successful for ${dbName}`);
      return { success: true, message: 'Connection successful' };
    } catch (err: any) {
      console.error(`[Setup] Connection test failed: ${err.message}`);
      return { success: false, message: err.message };
    } finally {
      await client.end();
    }
  }

  async saveDbConfig(config: any) {
    const { host, port, user, password, dbName } = config;
    const url = `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${dbName}`;

    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const dbUrlLine = `DATABASE_URL="${url}"`;
    
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(/DATABASE_URL=.*/, dbUrlLine);
    } else {
      envContent += `\n${dbUrlLine}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    
    // Force Prisma to reconnect with new URL immediately
    try {
      await (this.prisma as any).reconnect(url);
    } catch (err) {
      console.error('[Setup] Failed to force Prisma reconnect:', err);
    }

    return { success: true, message: 'Configuration saved. System synchronized.' };
  }
}
