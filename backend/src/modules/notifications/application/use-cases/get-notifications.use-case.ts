import { Inject, Injectable } from '@nestjs/common';
import { INotificationsRepository, I_NOTIFICATIONS_REPOSITORY } from '../../domain/repositories/notification.repository.interface';
import { Notification } from '@portfolio/types';

@Injectable()
export class GetNotificationsUseCase {
  constructor(
    @Inject(I_NOTIFICATIONS_REPOSITORY)
    private readonly notificationRepository: INotificationsRepository,
  ) {}

  async execute(userId: number, unreadOnly: boolean = false): Promise<Notification[]> {
    const notifications = await this.notificationRepository.findAll(userId);
    return unreadOnly ? notifications.filter(n => !n.is_read) : notifications;
  }
}
