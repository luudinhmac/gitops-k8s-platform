import { Inject, Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUsersRepository, I_USERS_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { AdminAlertService } from '../../../admin-alert/admin-alert.service';

@Injectable()
export class ResetPasswordUseCase {
  private readonly roleHierarchy: Record<string, number> = {
    [UserRole.SUPERADMIN]: 100,
    [UserRole.ADMIN]: 50,
    [UserRole.EDITOR]: 20,
    [UserRole.USER]: 10,
  };

  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    private readonly adminAlertService: AdminAlertService,
  ) {}

  private validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
    return regex.test(password);
  }

  private canModify(currentUser: User, targetUser: { role?: string | null }): boolean {
    const currentLevel = this.roleHierarchy[currentUser.role as string] || 0;
    const targetLevel = this.roleHierarchy[targetUser.role || 'user'] || 0;

    if (currentUser.role === UserRole.SUPERADMIN) return true;
    return currentLevel > targetLevel;
  }

  async execute(id: number, newPassword: string, currentUser: User, ip?: string) {
    const targetUser = await this.userRepository.findById(id);
    if (!targetUser) throw new NotFoundException('Người dùng không tồn tại');

    if (!this.canModify(currentUser, targetUser) && currentUser.id !== id) {
       throw new ForbiddenException('Bạn không có quyền đặt lại mật khẩu cho người dùng này.');
    }

    if (!this.validatePassword(newPassword)) {
      throw new BadRequestException('Mật khẩu mới phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
    }
    
    const hash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, { password: hash });

    this.adminAlertService.sendAlert({
      subject: `🔐 Reset mật khẩu: ${targetUser.username}`,
      text: `🔐 <b>RESET MẬT KHẨU NGƯỜI DÙNG</b>\n\n• <b>Hành động:</b> Đặt lại mật khẩu cho ${targetUser.username}\n• <b>IP:</b> ${ip || 'unknown'}\n• <b>User:</b> ${currentUser.username}\n• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
    });

    return { success: true, message: 'Đã đặt lại mật khẩu thành công.' };
  }
}
