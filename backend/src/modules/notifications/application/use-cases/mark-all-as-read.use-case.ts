import { Inject, Injectable } from '@nestjs/common';
import { INotificationsRepository, I_NOTIFICATIONS_REPOSITORY } from '../../domain/repositories/notification.repository.interface';

@Injectable()
export class MarkAllAsReadUseCase {
  constructor(
    @Inject(I_NOTIFICATIONS_REPOSITORY)
    private readonly notificationRepository: INotificationsRepository,
  ) {}

  async execute(userId: number): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }
}
