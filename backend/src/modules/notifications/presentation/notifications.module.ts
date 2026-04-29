import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from '../notifications.service'; // Keep service for internal injection
import { PrismaNotificationRepository } from '../infrastructure/repositories/prisma-notification.repository';
import { I_NOTIFICATIONS_REPOSITORY } from '../domain/repositories/notification.repository.interface';

// Use Cases
import { GetNotificationsUseCase } from '../application/use-cases/get-notifications.use-case';
import { CreateNotificationUseCase } from '../application/use-cases/create-notification.use-case';
import { GetUnreadCountUseCase } from '../application/use-cases/get-unread-count.use-case';
import { MarkAsReadUseCase } from '../application/use-cases/mark-as-read.use-case';
import { MarkAllAsReadUseCase } from '../application/use-cases/mark-all-as-read.use-case';
import { DeleteNotificationUseCase } from '../application/use-cases/delete-notification.use-case';
import { DeleteAllNotificationsUseCase } from '../application/use-cases/delete-all-notifications.use-case';

@Module({
  controllers: [NotificationsController],
  providers: [
    {
      provide: I_NOTIFICATIONS_REPOSITORY,
      useClass: PrismaNotificationRepository,
    },
    NotificationsService, // Keep for backward compatibility during transition
    GetNotificationsUseCase,
    CreateNotificationUseCase,
    GetUnreadCountUseCase,
    MarkAsReadUseCase,
    MarkAllAsReadUseCase,
    DeleteNotificationUseCase,
    DeleteAllNotificationsUseCase,
  ],
  exports: [I_NOTIFICATIONS_REPOSITORY, NotificationsService],
})
export class NotificationsModule {}
