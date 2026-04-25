import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateNotificationDto } from '@portfolio/contracts';
import { INotificationsRepository, I_NOTIFICATIONS_REPOSITORY } from './repositories/notification.repository.interface';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(I_NOTIFICATIONS_REPOSITORY) private repository: INotificationsRepository,
  ) {}

  async create(data: CreateNotificationDto) {
    return this.repository.create(data);
  }

  async findAll(userId: number, unreadOnly: boolean = false) {
    // Current interface doesn't support unreadOnly filter in findAll yet, but I'll update it or filter here
    const notifications = await this.repository.findAll(userId);
    return unreadOnly ? notifications.filter(n => !n.is_read) : notifications;
  }

  async getUnreadCount(userId: number) {
    return this.repository.countUnread(userId);
  }

  async markAsRead(id: number, userId: number) {
    const notification = await this.repository.findById(id);
    if (!notification || notification.recipient_id !== userId) {
      throw new NotFoundException('Notification not found');
    }
    await this.repository.markAsRead(id);
    return { success: true };
  }

  async markAllAsRead(userId: number) {
    await this.repository.markAllAsRead(userId);
    return { success: true };
  }

  async remove(id: number, userId: number) {
    const notification = await this.repository.findById(id);
    if (!notification || notification.recipient_id !== userId) {
      throw new NotFoundException('Notification not found');
    }
    await this.repository.delete(id);
    return { success: true };
  }

  async removeAll(userId: number) {
    // repository doesn't have removeAll yet, but I could add it
    const notifications = await this.repository.findAll(userId);
    for (const n of notifications) {
      await this.repository.delete(n.id);
    }
    return { success: true };
  }
}
