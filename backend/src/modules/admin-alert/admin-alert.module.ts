import { Module, forwardRef } from '@nestjs/common';
import { AdminAlertService } from './admin-alert.service';
import { MonitoringService } from './monitoring.service';
import { TelegramModule } from '../telegram/telegram.module';
import { TeamsModule } from '../teams/teams.module';
import { MailModule } from '../mail/mail.module';
import { SettingsModule } from '../modules/settings/settings.module';

@Module({
  imports: [
    TelegramModule,
    TeamsModule,
    MailModule,
    forwardRef(() => SettingsModule),
  ],
  providers: [AdminAlertService, MonitoringService],
  exports: [AdminAlertService, MonitoringService],
})
export class AdminAlertModule {}
