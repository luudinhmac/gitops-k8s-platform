import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User, UserRole, CreateUserDto, UpdateUserDto } from '@portfolio/contracts';
import { IStorageService, STORAGE_SERVICE } from '../../infrastructure/storage/storage.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { AdminAlertService } from '../admin-alert/admin-alert.service';
import { IUsersRepository, I_USERS_REPOSITORY } from './repositories/user.repository.interface';
import { UserEntity } from './domain/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(I_USERS_REPOSITORY) private repository: IUsersRepository,
    @Inject(STORAGE_SERVICE) private storageService: IStorageService,
    private notificationsService: NotificationsService,
    private adminAlertService: AdminAlertService,
  ) {}

  private validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
    return regex.test(password);
  }

  private readonly roleHierarchy: Record<string, number> = {
    [UserRole.SUPERADMIN]: 100,
    [UserRole.ADMIN]: 50,
    [UserRole.EDITOR]: 20,
    [UserRole.USER]: 10,
  };

  private canModify(currentUser: User, targetUser: { role?: string | null }): boolean {
    const currentLevel = this.roleHierarchy[currentUser.role as string] || 0;
    const targetLevel = this.roleHierarchy[targetUser.role || 'user'] || 0;
    if (currentUser.role === UserRole.SUPERADMIN) return true;
    return currentLevel > targetLevel;
  }

  async findAll(): Promise<Partial<User>[]> {
    return this.repository.findAll({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  async create(data: CreateUserDto, currentUser?: User) {
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
      const user = await this.repository.create({
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
    } catch (e) {
      if (e.message === 'User already exists') {
        throw new BadRequestException('Tên đăng nhập hoặc email đã tồn tại');
      }
      throw e;
    }
  }

  async update(id: number, currentUser: User, data: UpdateUserDto) {
    const targetUser = await this.repository.findById(id);
    if (!targetUser) throw new NotFoundException('Người dùng không tồn tại');

    if (!this.canModify(currentUser, targetUser) && currentUser.id !== id) {
      throw new ForbiddenException('Bạn không có quyền sửa thông tin của người dùng này.');
    }

    if (data.role) {
       const newRoleLevel = this.roleHierarchy[data.role] || 0;
       const currentLevel = this.roleHierarchy[currentUser.role as string] || 0;
       if (newRoleLevel >= currentLevel && currentUser.role !== UserRole.SUPERADMIN) {
          throw new ForbiddenException('Bạn không thể gán vai trò cao hơn hoặc bằng vai trò hiện tại của mình.');
       }
    }

    const updateData = { ...data };
    if (updateData.fullname !== undefined && (!updateData.fullname || !updateData.fullname.trim())) {
      updateData.fullname = targetUser.username;
    }

    if (updateData.avatar && targetUser.avatar && targetUser.avatar !== updateData.avatar) {
      await this.storageService.deleteFile(targetUser.avatar).catch(err => console.error('Delete avatar error:', err));
    }

    return this.repository.update(id, updateData);
  }

  async updatePermissions(
    id: number,
    currentUser: User,
    data: { 
      role?: UserRole | string; 
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

    const targetUser = await this.repository.findById(id);
    if (!targetUser) throw new NotFoundException('Người dùng không tồn tại');

    if (targetUser.role === UserRole.SUPERADMIN && data.role && data.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Không thể hạ cấp vai trò của tài khoản Superadmin tối cao.');
    }

    if (!this.canModify(currentUser, targetUser)) {
      throw new ForbiddenException('Bạn không có quyền thay đổi quyền hạn của người dùng này.');
    }

    const { reason, ...dbData } = data;

    const updatedUser = await this.repository.update(id, dbData);

    if (data.role && data.role !== targetUser.role) {
      const username = currentUser.username || 'Hệ thống';
      const userIp = ip || 'unknown';
      
      this.adminAlertService.sendAlert({
        subject: `🛡️ Thay đổi vai trò: ${targetUser.username}`,
        text: `🛡️ <b>THAY ĐỔI VAI TRÒ NGƯỜI DÙNG</b>\n\n` +
              `• <b>Hành động:</b> Đổi vai trò ${targetUser.username} (${targetUser.role} → ${data.role})\n` +
              `• <b>IP:</b> ${userIp}\n` +
              `• <b>User:</b> ${username}\n` +
              `• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
      });
    }

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
      // ... other notifications
    } catch (err) { console.error('Notification error:', err); }

    return updatedUser;
  }

  async updateRole(id: number, currentUser: User, role: string) {
    return this.updatePermissions(id, currentUser, { role });
  }

  async updateStatus(id: number, currentUser: User, isActive: boolean, ip?: string) {
    return this.updatePermissions(id, currentUser, { is_active: isActive }, ip);
  }


  async resetPassword(id: number, newPassword: string, currentUser: User, ip?: string) {
    const targetUser = await this.repository.findById(id);
    if (!targetUser) throw new NotFoundException('Người dùng không tồn tại');

    if (!this.canModify(currentUser, targetUser) && currentUser.id !== id) {
       throw new ForbiddenException('Bạn không có quyền đặt lại mật khẩu cho người dùng này.');
    }

    if (!this.validatePassword(newPassword)) {
      throw new BadRequestException('Mật khẩu mới phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
    }
    
    const hash = await bcrypt.hash(newPassword, 10);
    await this.repository.update(id, { password: hash });

    const username = currentUser.username || 'Hệ thống';
    const userIp = ip || 'unknown';
    
    this.adminAlertService.sendAlert({
      subject: `🔐 Reset mật khẩu: ${targetUser.username}`,
      text: `🔐 <b>RESET MẬT KHẨU NGƯỜI DÙNG</b>\n\n• <b>Hành động:</b> Đặt lại mật khẩu cho ${targetUser.username}\n• <b>IP:</b> ${userIp}\n• <b>User:</b> ${username}\n• <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`,
    });

    return { success: true, message: 'Đã đặt lại mật khẩu thành công.' };
  }

  async changePassword(id: number, oldPassword: string, newPassword: string, currentUser: User, ip?: string) {
    if (currentUser.id !== id) throw new ForbiddenException('Bạn chỉ có thể đổi mật khẩu của chính mình.');
    if (!this.validatePassword(newPassword)) throw new BadRequestException('Mật khẩu mới phải tối thiểu 8 ký tự.');
    
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const isValid = await bcrypt.compare(oldPassword, user.password as string);
    if (!isValid) throw new BadRequestException('Mật khẩu hiện tại không đúng.');

    const hash = await bcrypt.hash(newPassword, 10);
    await this.repository.update(id, { password: hash });

    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN) {
      this.adminAlertService.sendAlert({
        subject: `🔐 CẢNH BÁO: Admin đổi mật khẩu`,
        text: `🔐 <b>MẬT KHẨU QUẢN TRỊ VIÊN ĐÃ THAY ĐỔI</b>\n\n• <b>User:</b> ${currentUser.username}\n• <b>IP:</b> ${ip || 'unknown'}`,
      });
    }

    return { success: true, message: 'Đã đổi mật khẩu thành công.' };
  }

  async remove(id: number, currentUser: User, ip?: string) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Chỉ Admin mới có thể xóa tài khoản.');
    }
    if (currentUser.id === id) throw new BadRequestException('Bạn không thể tự xóa tài khoản của mình.');

    const targetUser = await this.repository.findById(id);
    if (!targetUser) throw new NotFoundException('Người dùng không tồn tại');
    
    if (!this.canModify(currentUser, targetUser)) {
      throw new ForbiddenException('Bạn không có quyền xóa người dùng này.');
    }

    if (targetUser.avatar) await this.storageService.deleteFile(targetUser.avatar).catch(err => console.error('Delete avatar error:', err));

    await this.repository.delete(id);

    this.adminAlertService.sendAlert({
      subject: `🗑️ Người dùng bị xóa: ${targetUser.username}`,
      text: `🗑️ <b>NGƯỜI DÙNG BỊ XÓA</b>\n\n• <b>Hành động:</b> Xóa vĩnh viễn tài khoản ${targetUser.username}\n• <b>User:</b> ${currentUser.username}`,
    });

    return { success: true };
  }
}
