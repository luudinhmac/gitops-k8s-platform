import { Inject, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUsersRepository, I_USERS_REPOSITORY } from '../domain/user.repository.interface';
import { User, UserRole } from '@portfolio/contracts';
import { AdminAlertService } from '../../admin-alert/admin-alert.service';
import { UserNotFoundException } from '../domain/user.errors';

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

  async execute(id: number, password: string, currentUser: User, ip?: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);

    const targetLevel = this.roleHierarchy[user.role as string] || 0;
    const currentLevel = this.roleHierarchy[currentUser.role as string] || 0;

    if (currentLevel <= targetLevel && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Bạn không có quyền reset mật khẩu của người này.');
    }

    if (!this.validatePassword(password)) {
      throw new BadRequestException('Mật khẩu mới phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
    }

    const hash = await bcrypt.hash(password, 10);
    await this.userRepository.update(id, { password: hash });

    this.adminAlertService.sendAlert({
      subject: `🔑 Reset mật khẩu: ${user.username}`,
      text: `🔑 <b>MẬT KHẨU ĐÃ ĐƯỢC RESET BỞI ADMIN</b>\n\n` +
            `• <b>Username:</b> ${user.username}\n` +
            `• <b>Admin thực hiện:</b> ${currentUser.username}\n` +
            `• <b>IP:</b> ${ip || 'unknown'}\n` +
            `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
    });

    return { success: true };
  }
}
