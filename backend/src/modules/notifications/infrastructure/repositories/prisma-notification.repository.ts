import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { INotificationsRepository } from '../../domain/repositories/notification.repository.interface';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationMapper } from '../mappers/notification.mapper';
import { CreateNotificationDto } from '@portfolio/types';

@Injectable()
export class PrismaNotificationRepository implements INotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { recipient_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
    return notifications.map(n => NotificationMapper.toDomain(n) as NotificationEntity);
  }

  async findById(id: number): Promise<NotificationEntity | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    return NotificationMapper.toDomain(notification);
  }

  async create(data: CreateNotificationDto): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.create({
      data: data as any,
    });
    return NotificationMapper.toDomain(notification) as NotificationEntity;
  }

  async markAsRead(id: number): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });
    return NotificationMapper.toDomain(notification) as NotificationEntity;
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { recipient_id: userId, is_read: false },
      data: { is_read: true },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.notification.delete({ where: { id } });
  }

  async deleteAll(userId: number): Promise<void> {
    await this.prisma.notification.deleteMany({
      where: { recipient_id: userId }
    });
  }

  async countUnread(userId: number): Promise<number> {
    return this.prisma.notification.count({
      where: { recipient_id: userId, is_read: false },
    });
  }
}
