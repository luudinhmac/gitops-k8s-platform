import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INotificationsRepository, I_NOTIFICATIONS_REPOSITORY } from '../../domain/repositories/notification.repository.interface';

@Injectable()
export class MarkAsReadUseCase {
  constructor(
    @Inject(I_NOTIFICATIONS_REPOSITORY)
    private readonly notificationRepository: INotificationsRepository,
  ) {}

  async execute(id: number, userId: number): Promise<void> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification || notification.recipient_id !== userId) {
      throw new NotFoundException('Notification not found');
    }
    await this.notificationRepository.markAsRead(id);
  }
}
