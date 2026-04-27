import { Inject, Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { IStorageService, STORAGE_SERVICE } from '../../../../infrastructure/storage/storage.interface';
import { AdminAlertService } from '../../../admin-alert/admin-alert.service';

@Injectable()
export class DeleteUserUseCase {
  private readonly roleHierarchy: Record<string, number> = {
    [UserRole.SUPERADMIN]: 100,
    [UserRole.ADMIN]: 50,
    [UserRole.EDITOR]: 20,
    [UserRole.USER]: 10,
  };

  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
    private readonly adminAlertService: AdminAlertService,
  ) {}

  private canModify(currentUser: User, targetUser: { role?: string | null }): boolean {
    const currentLevel = this.roleHierarchy[currentUser.role as string] || 0;
    const targetLevel = this.roleHierarchy[targetUser.role || 'user'] || 0;

    if (currentUser.role === UserRole.SUPERADMIN) return true;
    return currentLevel > targetLevel;
  }

  async execute(id: number, currentUser: User, ip?: string) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Chỉ Admin mới có thể xóa tài khoản.');
    }
    if (currentUser.id === id) throw new BadRequestException('Bạn không thể tự xóa tài khoản của mình.');

    const targetUser = await this.userRepository.findById(id);
    if (!targetUser) throw new NotFoundException('Người dùng không tồn tại');
    
    if (!this.canModify(currentUser, targetUser)) {
      throw new ForbiddenException('Bạn không có quyền xóa người dùng này.');
    }

    if (targetUser.avatar) await this.storageService.deleteFile(targetUser.avatar).catch(err => console.error('Delete avatar error:', err));

    await this.userRepository.delete(id);

    this.adminAlertService.sendAlert({
      subject: `🗑️ Người dùng bị xóa: ${targetUser.username}`,
      text: `🗑️ <b>NGƯỜI DÙNG BỊ XÓA</b>\n\n• <b>Hành động:</b> Xóa vĩnh viễn tài khoản ${targetUser.username}\n• <b>User:</b> ${currentUser.username}`,
    });

    return { success: true };
  }
}
