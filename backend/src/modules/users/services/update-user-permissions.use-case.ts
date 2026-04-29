import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../domain/user.repository.interface';
import { User, UserRole } from '@portfolio/contracts';
import { NotificationsService } from '../../notifications/notifications.service';
import { AdminAlertService } from '../../admin-alert/admin-alert.service';
import { UserNotFoundException } from '../domain/user.errors';

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

  async execute(id: number, currentUser: User, data: any, ip?: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);

    const targetLevel = this.roleHierarchy[user.role as string] || 0;
    const currentLevel = this.roleHierarchy[currentUser.role as string] || 0;

    if (currentLevel <= targetLevel && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Bạn không có quyền thay đổi thông tin của người này.');
    }

    if (data.role) {
      const newRoleLevel = this.roleHierarchy[data.role] || 0;
      if (newRoleLevel >= currentLevel && currentUser.role !== UserRole.SUPERADMIN) {
        throw new ForbiddenException('Bạn không thể cấp quyền cao hơn hoặc bằng chính mình.');
      }
    }

    const updatedUser = await this.userRepository.update(id, data);

    // Notifications
    if (data.is_active === false) {
      this.adminAlertService.sendAlert({
        subject: `🚫 Tài khoản bị khóa: ${user.username}`,
        text: `🚫 <b>TÀI KHOẢN ĐÃ BỊ KHÓA</b>\n\n• <b>User:</b> ${user.username}\n• <b>Lý do:</b> ${data.reason || 'Vi phạm quy định'}\n• <b>Admin:</b> ${currentUser.username}\n• <b>IP:</b> ${ip || 'unknown'}`,
      });
    }

    if (data.role && data.role !== user.role) {
      await this.notificationsService.create({
        recipient_id: id,
        sender_id: currentUser.id,
        type: 'SYSTEM',
        title: 'Thay đổi quyền hạn',
        content: `Quyền hạn của bạn đã được thay đổi thành ${data.role}`,
      });
    }

    return updatedUser.toJSON();
  }
}
