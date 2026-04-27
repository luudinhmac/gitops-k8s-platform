import { Inject, Injectable } from '@nestjs/common';
import { INotificationsRepository, I_NOTIFICATIONS_REPOSITORY } from '../../domain/repositories/notification.repository.interface';

@Injectable()
export class GetUnreadCountUseCase {
  constructor(
    @Inject(I_NOTIFICATIONS_REPOSITORY)
    private readonly notificationRepository: INotificationsRepository,
  ) {}

  async execute(userId: number): Promise<number> {
    return this.notificationRepository.countUnread(userId);
  }
}
