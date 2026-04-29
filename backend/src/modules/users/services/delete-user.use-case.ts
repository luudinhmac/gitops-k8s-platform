import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IUsersRepository, I_USERS_REPOSITORY } from '../domain/user.repository.interface';
import { User, UserRole } from '@portfolio/contracts';
import { IStorageService, STORAGE_SERVICE } from '../../../infrastructure/storage/storage.interface';
import { AdminAlertService } from '../../admin-alert/admin-alert.service';
import { UserNotFoundException } from '../domain/user.errors';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
    private readonly adminAlertService: AdminAlertService,
  ) {}

  async execute(id: number, currentUser: User, ip?: string) {
    if (currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Chỉ Super Admin mới có quyền xóa tài khoản.');
    }

    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);

    if (user.role === UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không thể xóa tài khoản Super Admin.');
    }

    if (user.avatar) {
      await this.storageService.deleteFile(user.avatar).catch(() => {});
    }

    await this.userRepository.delete(id);

    this.adminAlertService.sendAlert({
      subject: `🛑 CẢNH BÁO: Tài khoản bị xóa - ${user.username}`,
      text: `🛑 <b>TÀI KHOẢN ĐÃ BỊ XÓA VĨNH VIỄN</b>\n\n` +
            `• <b>Username:</b> ${user.username}\n` +
            `• <b>Người thực hiện:</b> ${currentUser.username}\n` +
            `• <b>IP:</b> ${ip || 'unknown'}\n` +
            `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
    });

    return { success: true };
  }
}
