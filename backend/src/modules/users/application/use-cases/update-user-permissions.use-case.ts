import { Inject, Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { NotificationsService } from '../../../notifications/notifications.service';
import { AdminAlertService } from '../../../admin-alert/admin-alert.service';

@Injectable()
export class UpdateUserPermissionsUseCase {
  private readonly roleHierarchy: Record<string, number> = {
    [UserRole.SUPERADMIN]: 100,
    [UserRole.ADMIN]: 50,
    [UserRole.EDITOR]: 20,
    [UserRole.USER]: 10,
  };

  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    private readonly notificationsService: NotificationsService,
    private readonly adminAlertService: AdminAlertService,
  ) {}

  private canModify(currentUser: User, targetUser: { role?: string | null }): boolean {
    const currentLevel = this.roleHierarchy[currentUser.role as string] || 0;
    const targetLevel = this.roleHierarchy[targetUser.role || 'user'] || 0;

    if (currentUser.role === UserRole.SUPERADMIN) return true;
    return currentLevel > targetLevel;
  }

  async execute(
    id: number,
    currentUser: User,
    data: { 
      role?: string; 
      is_active?: boolean; 
      can_comment?: boolean; 
      can_post?: boolean;
      reason?: string; 
    },
    ip?: string,
  ) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Chỉ Admin mới có thể thay đổi quyền hạn.');
    }
    
    if (currentUser.id === id && data.is_active === false) {
      throw new BadRequestException('Bạn không thể tự vô hiệu hóa tài khoản của chính mình.');
    }

    const targetUser = await this.userRepository.findById(id);
    if (!targetUser) throw new NotFoundException('Người dùng không tồn tại');

    if (targetUser.role === UserRole.SUPERADMIN && data.role && data.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không thể hạ cấp vai trò của tài khoản Superadmin tối cao.');
    }

    if (!this.canModify(currentUser, targetUser)) {
      throw new ForbiddenException('Bạn không có quyền thay đổi quyền hạn của người dùng này.');
    }

    const { reason, ...dbData } = data;
    const updatedUser = await this.userRepository.update(id, dbData);

    if (data.role && data.role !== targetUser.role) {
      this.adminAlertService.sendAlert({
        subject: `🛡️ Thay đổi vai trò: ${targetUser.username}`,
        text: `🛡️ <b>THAY ĐỔI VAI TRÒ NGƯỜI DÙNG</b>\n\n` +
              `• <b>Hành động:</b> Đổi vai trò ${targetUser.username} (${targetUser.role} → ${data.role})\n` +
              `• <b>IP:</b> ${ip || 'unknown'}\n` +
              `• <b>User:</b> ${currentUser.username}\n` +
              `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
      });
    }

    // Notifications logic
    try {
      const reasonText = reason ? ` Lý do: ${reason}` : '';
      if (data.is_active === false) {
        await this.notificationsService.create({
          recipient_id: id, sender_id: currentUser.id, type: 'USER_STATUS_CHANGE',
          title: 'Tài khoản bị khóa', content: `Tài khoản của bạn đã bị quản trị viên tạm khóa.${reasonText}`,
        });
      } else if (data.is_active === true) {
        await this.notificationsService.create({
          recipient_id: id, sender_id: currentUser.id, type: 'USER_STATUS_CHANGE',
          title: 'Tài khoản đã mở', content: 'Tài khoản của bạn đã được kích hoạt trở lại.',
        });
      }
      
      if (data.can_comment === false) {
        await this.notificationsService.create({
          recipient_id: id, sender_id: currentUser.id, type: 'USER_PERMISSION_CHANGE',
          title: 'Hạn chế bình luận', content: `Bạn đã bị quản trị viên chặn quyền bình luận.${reasonText}`,
        });
      } else if (data.can_comment === true) {
        await this.notificationsService.create({
          recipient_id: id, sender_id: currentUser.id, type: 'USER_PERMISSION_CHANGE',
          title: 'Đã mở khóa bình luận', content: 'Bạn đã có thể bình luận trở lại.',
        });
      }

      if (data.can_post === false) {
        await this.notificationsService.create({
          recipient_id: id, sender_id: currentUser.id, type: 'USER_PERMISSION_CHANGE',
          title: 'Hạn chế đăng bài', content: `Bạn đã bị quản trị viên chặn quyền đăng bài viết.${reasonText}`,
        });
      } else if (data.can_post === true) {
        await this.notificationsService.create({
          recipient_id: id, sender_id: currentUser.id, type: 'USER_PERMISSION_CHANGE',
          title: 'Đã mở khóa đăng bài', content: 'Bạn đã có thể đăng bài viết trở lại.',
        });
      }
    } catch (err) { console.error('Notification error:', err); }

    return updatedUser;
  }
}
