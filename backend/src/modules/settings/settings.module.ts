import { Module, forwardRef } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { TelegramModule } from '../../telegram/telegram.module';
import { MailModule } from '../../mail/mail.module';
import { TeamsModule } from '../../teams/teams.module';
import { AdminAlertModule } from '../../admin-alert/admin-alert.module';

@Module({
  imports: [
    PrismaModule, 
    forwardRef(() => AdminAlertModule),
    forwardRef(() => TelegramModule),
    forwardRef(() => MailModule),
    forwardRef(() => TeamsModule),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
