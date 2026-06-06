import {
  Controller,
  Get,
  Put,
  Body,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { getClientIp } from '../../common/utils/ip';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  async getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  @Post('verify-maintenance-passcode')
  async verifyMaintenancePasscode(@Body('passcode') passcode: string) {
    const isValid =
      await this.settingsService.verifyMaintenancePasscode(passcode);
    return { success: isValid };
  }

  @Post('request-maintenance-code')
  async requestMaintenanceCode(@Req() req: any) {
    return this.settingsService.requestMaintenanceCode(getClientIp(req));
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('settings:manage')
  @Get('admin')
  async getAllSettings(@Req() req: any) {
    return this.settingsService.getAllSettings(req.user);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('settings:manage') // Only users with settings:manage permission can update settings
  @Put('admin')
  async updateSettings(
    @Req() req: any,
    @Body()
    data: {
      items: {
        key: string;
        value: string;
        group?: string;
        is_public?: boolean;
      }[];
    },
  ) {
    if (!data.items || !Array.isArray(data.items)) {
      return { message: 'Invalid data format' };
    }
    return this.settingsService.updateSettings(
      data.items,
      req.user,
      getClientIp(req),
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin')
  @Post('admin/test-telegram')
  async testTelegram(@Body() data: { token: string; chatId: string }) {
    return this.settingsService.testTelegram(data.token, data.chatId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin')
  @Post('admin/test-teams')
  async testTeams(@Body() data: { webhookUrl: string }) {
    return this.settingsService.testTeams(data.webhookUrl);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin')
  @Post('admin/test-email')
  async testEmail(
    @Body()
    data: {
      host: string;
      port: string;
      user: string;
      pass: string;
      to: string;
    },
  ) {
    return this.settingsService.testEmail(data);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('settings:manage')
  @Post('admin/flush-cache')
  async flushCache() {
    return this.settingsService.flushCache();
  }
}
