import { NotificationEntity } from '../domain/notification.entity';
import { CreateNotificationDto } from '@portfolio/contracts';

export const I_NOTIFICATIONS_REPOSITORY = 'I_NOTIFICATIONS_REPOSITORY';

export interface INotificationsRepository {
  findAll(recipientId: number): Promise<NotificationEntity[]>;
  findById(id: number): Promise<NotificationEntity | null>;
  create(data: CreateNotificationDto): Promise<NotificationEntity>;
  markAsRead(id: number): Promise<void>;
  markAllAsRead(recipientId: number): Promise<void>;
  delete(id: number): Promise<void>;
  countUnread(recipientId: number): Promise<number>;
}
