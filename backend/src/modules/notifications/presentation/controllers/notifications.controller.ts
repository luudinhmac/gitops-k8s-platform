import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Notification as NotificationEntity } from '@portfolio/contracts';

// Use Cases
import { GetNotificationsUseCase } from '../../application/use-cases/get-notifications.use-case';
import { GetUnreadCountUseCase } from '../../application/use-cases/get-unread-count.use-case';
import { MarkAsReadUseCase } from '../../application/use-cases/mark-as-read.use-case';
import { MarkAllAsReadUseCase } from '../../application/use-cases/mark-all-as-read.use-case';
import { DeleteNotificationUseCase } from '../../application/use-cases/delete-notification.use-case';
import { DeleteAllNotificationsUseCase } from '../../application/use-cases/delete-all-notifications.use-case';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly getUnreadCountUseCase: GetUnreadCountUseCase,
    private readonly markAsReadUseCase: MarkAsReadUseCase,
    private readonly markAllAsReadUseCase: MarkAllAsReadUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
    private readonly deleteAllNotificationsUseCase: DeleteAllNotificationsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiResponse({ status: 200, type: [NotificationEntity] })
  findAll(@Req() req: any, @Query('unreadOnly') unreadOnly?: string) {
    return this.getNotificationsUseCase.execute(req.user.id, unreadOnly === 'true');
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  async getUnreadCount(@Req() req: any) {
    const count = await this.getUnreadCountUseCase.execute(req.user.id);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.markAsReadUseCase.execute(+id, req.user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Req() req: any) {
    return this.markAllAsReadUseCase.execute(req.user.id);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all notifications' })
  removeAll(@Req() req: any) {
    return this.deleteAllNotificationsUseCase.execute(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.deleteNotificationUseCase.execute(+id, req.user.id);
  }

  // Add more endpoints as needed based on use cases...
}
