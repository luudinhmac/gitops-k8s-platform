import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsRepository } from './repositories/notification.repository';
import { I_NOTIFICATIONS_REPOSITORY } from './repositories/notification.repository.interface';

@Module({
  imports: [PrismaModule],
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
