import { Inject, Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUsersRepository, I_USERS_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { AdminAlertService } from '../../../admin-alert/admin-alert.service';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(I_USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,
    private readonly adminAlertService: AdminAlertService,
  ) {}

  private validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
    return regex.test(password);
  }

  async execute(id: number, oldPassword: string, newPassword: string, currentUser: User, ip?: string) {
    if (currentUser.id !== id) throw new ForbiddenException('Bạn chỉ có thể đổi mật khẩu của chính mình.');
    if (!this.validatePassword(newPassword)) throw new BadRequestException('Mật khẩu mới phải tối thiểu 8 ký tự.');
    
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const isValid = await bcrypt.compare(oldPassword, user.password as string);
    if (!isValid) throw new BadRequestException('Mật khẩu hiện tại không đúng.');

    const hash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, { password: hash });

    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN) {
      this.adminAlertService.sendAlert({
        subject: `🔐 CẢNH BÁO: Admin đổi mật khẩu`,
        text: `🔐 <b>MẬT KHẨU QUẢN TRỊ VIÊN ĐÃ THAY ĐỔI</b>\n\n• <b>User:</b> ${currentUser.username}\n• <b>IP:</b> ${ip || 'unknown'}`,
      });
    }

    return { success: true, message: 'Đã đổi mật khẩu thành công.' };
  }
}
