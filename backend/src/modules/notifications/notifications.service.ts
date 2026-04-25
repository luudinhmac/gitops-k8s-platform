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
  }
}
