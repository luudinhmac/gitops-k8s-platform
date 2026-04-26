import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsRepository } from './repositories/notification.repository';
import { I_NOTIFICATIONS_REPOSITORY } from './repositories/notification.repository.interface';
import { SettingsModule } from '../settings/settings.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => SettingsModule),
    forwardRef(() => TelegramModule),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: I_NOTIFICATIONS_REPOSITORY,
      useClass: NotificationsRepository,
    },
  ],
  exports: [NotificationsService, I_NOTIFICATIONS_REPOSITORY],
})
export class NotificationsModule {}
