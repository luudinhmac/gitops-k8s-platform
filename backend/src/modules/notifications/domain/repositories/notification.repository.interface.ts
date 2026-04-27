import { NotificationEntity } from '../entities/notification.entity';

export const I_NOTIFICATIONS_REPOSITORY = 'I_NOTIFICATIONS_REPOSITORY';

export interface INotificationsRepository {
  findAll(userId: number): Promise<NotificationEntity[]>;
  findById(id: number): Promise<NotificationEntity | null>;
  create(data: any): Promise<NotificationEntity>;
  markAsRead(id: number): Promise<NotificationEntity>;
  markAllAsRead(userId: number): Promise<void>;
  delete(id: number): Promise<void>;
  countUnread(userId: number): Promise<number>;
}
