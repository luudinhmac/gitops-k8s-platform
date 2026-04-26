<<<<<<< HEAD
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateNotificationDto) {
    return this.prisma.notification.create({
      data,
    });
  }

  async findAll(userId: number, unreadOnly: boolean = false) {
    const where: any = { recipient_id: userId };
    if (unreadOnly) {
      where.is_read = false;
    }
    return this.prisma.notification.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 50,
      include: {
        Sender: {
          select: {
            id: true,
            fullname: true,
            avatar: true,
          },
        },
      },
    });
  }

  async getUnreadCount(userId: number) {
    return this.prisma.notification.count({
      where: {
        recipient_id: userId,
        is_read: false,
      },
    });
  }

  async markAsRead(id: number, userId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.recipient_id !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        recipient_id: userId,
        is_read: false,
      },
      data: { is_read: true },
    });
  }

  async removeAll(userId: number) {
    return this.prisma.notification.deleteMany({
      where: { recipient_id: userId },
    });
  }

  async remove(id: number, userId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.recipient_id !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.delete({
      where: { id },
    });
=======
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
>>>>>>> feature/arch-refactor
  }
}
