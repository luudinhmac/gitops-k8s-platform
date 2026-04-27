import { Inject, Injectable } from '@nestjs/common';
import { INotificationsRepository, I_NOTIFICATIONS_REPOSITORY } from '../../domain/repositories/notification.repository.interface';
import { CreateNotificationDto, Notification } from '@portfolio/types';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject(I_NOTIFICATIONS_REPOSITORY)
    private readonly notificationRepository: INotificationsRepository,
  ) {}

  async execute(data: CreateNotificationDto): Promise<Notification> {
    return this.notificationRepository.create(data);
  }
}
