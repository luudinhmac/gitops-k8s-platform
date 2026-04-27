import { Inject, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUsersRepository, I_USERS_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { User, UserRole, CreateUserDto } from '@portfolio/types';
import { AdminAlertService } from '../../../admin-alert/admin-alert.service';

@Injectable()
export class CreateUserUseCase {
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

  async execute(data: CreateUserDto, currentUser?: User) {
    if (currentUser && !this.roleHierarchy[currentUser.role as string]) {
      throw new ForbiddenException('Bạn không có quyền tạo tài khoản.');
    }
    
    if (currentUser && currentUser.role !== UserRole.SUPERADMIN) {
      const targetLevel = this.roleHierarchy[data.role || 'user'] || 0;
      const currentLevel = this.roleHierarchy[currentUser.role as string] || 0;
      if (targetLevel >= currentLevel) {
        throw new ForbiddenException('Bạn không thể tạo tài khoản có quyền cao hơn hoặc bằng chính mình.');
      }
    }

    if (data.password && !this.validatePassword(data.password)) {
      throw new BadRequestException('Mật khẩu phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
    }

    const hash = await bcrypt.hash(data.password || 'defaultPassword123', 10);
    
    try {
      const user = await this.userRepository.create({
        ...data,
        fullname: data.fullname && data.fullname.trim() ? data.fullname : data.username,
        password: hash,
        role: data.role || UserRole.USER,
        profession: data.profession || 'Người dùng mới',
        is_active: true,
      });

      const { password: _, ...result } = user as any;

      this.adminAlertService.sendAlert({
        subject: `🆕 Người dùng mới đăng ký: ${user.username}`,
        text: `🆕 <b>Người dùng mới đăng ký</b>\n\n` +
              `• <b>Username:</b> ${user.username}\n` +
              `• <b>Họ tên:</b> ${user.fullname}\n` +
              `• <b>Email:</b> ${user.email || 'N/A'}\n` +
              `• <b>Ngày tham gia:</b> ${new Date().toLocaleString('vi-VN')}`,
      });

      return result;
    } catch (e: any) {
      if (e.message === 'User already exists' || e.code === 'P2002') {
        throw new BadRequestException('Tên đăng nhập hoặc email đã tồn tại');
      }
      throw e;
    }
  }
}
