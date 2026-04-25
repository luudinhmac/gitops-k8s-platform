import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { INotificationsRepository } from './notification.repository.interface';
import { NotificationEntity } from '../domain/notification.entity';
import { CreateNotificationDto } from '@portfolio/contracts';

@Injectable()
export class NotificationsRepository implements INotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(recipientId: number): Promise<NotificationEntity[]> {
    return this.prisma.notification.findMany({
      where: { recipient_id: recipientId },
      orderBy: { created_at: 'desc' },
    }) as any;
  }

  async findById(id: number): Promise<NotificationEntity | null> {
    return this.prisma.notification.findUnique({ where: { id } }) as any;
  }

  async create(data: CreateNotificationDto): Promise<NotificationEntity> {
    return this.prisma.notification.create({
      data: {
        recipient_id: data.recipient_id,
        sender_id: data.sender_id,
        type: data.type,
        title: data.title,
        content: data.content,
        link: data.link,
      },
    }) as any;
  }

  async markAsRead(id: number): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });
  }

  async markAllAsRead(recipientId: number): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { recipient_id: recipientId, is_read: false },
      data: { is_read: true },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.notification.delete({ where: { id } });
  }

  async countUnread(recipientId: number): Promise<number> {
    return this.prisma.notification.count({
      where: { recipient_id: recipientId, is_read: false },
    });
  }
}
