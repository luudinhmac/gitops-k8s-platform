import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Prisma } from '@prisma/client';
import { FileService } from '../upload/file.service';

interface PrismaError {
  code: string;
}

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private notificationsService: NotificationsService,
  ) {}

  private validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
    return regex.test(password);
  }

  private readonly publicSelect = {
    id: true,
    username: true,
    email: true,
    fullname: true,
    avatar: true,
    profession: true,
    role: true,
    phone: true,
    birthday: true,
    address: true,
    created_at: true,
    is_active: true,
    can_comment: true,
    can_post: true,
  };

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      select: this.publicSelect,
    });
    return users as unknown as Partial<User>[];
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.publicSelect,
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user as unknown as Partial<User>;
  }

  async create(data: CreateUserDto, currentUser?: User) {
    if (currentUser && currentUser.role !== (UserRole.ADMIN as string)) {
      throw new ForbiddenException('Chỉ Admin mới có thể tạo tài khoản mới.');
    }
    if (data.password && !this.validatePassword(data.password)) {
      throw new BadRequestException(
        'Mật khẩu phải tối thiểu 8 ký tự, bao gồm cả chữ và số.',
      );
    }
    const hash = await bcrypt.hash(data.password || 'defaultPassword123', 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          username: data.username,
          fullname:
            data.fullname && data.fullname.trim()
              ? data.fullname
              : data.username,
          password: hash,
          role: data.role || UserRole.USER,
          profession: data.profession || 'Người dùng mới',
          is_active: true,
        },
      });
      // Return without password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    } catch (e) {
      const err = e as PrismaError;
      if (err.code === 'P2002') {
        throw new BadRequestException('Tên đăng nhập hoặc email đã tồn tại');
      }
      throw e;
    }
  }

  async update(id: number, currentUser: User, data: UpdateUserDto) {
    if (
      currentUser.role !== (UserRole.ADMIN as string) &&
      currentUser.id !== id
    ) {
      throw new ForbiddenException('Bạn không có quyền sửa thông tin này.');
    }

    if (
      (data.role || data.is_active !== undefined) &&
      currentUser.role !== (UserRole.ADMIN as string)
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền thay đổi vai trò hoặc trạng thái người dùng.',
      );
    }

    // Create a copy to remove unwanted fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...updateData } = data as Record<string, any>;

    if (
      updateData.fullname !== undefined &&
      (!updateData.fullname || !(updateData.fullname as string).trim())
    ) {
      const targetUser = await this.prisma.user.findUnique({ where: { id } });

      updateData.fullname = targetUser?.username || 'user';
    }

    // Cleanup old avatar if it's being updated
    if (updateData.avatar) {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (user?.avatar && user.avatar !== updateData.avatar) {
        await this.fileService.deleteFile(user.avatar);
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData as Prisma.UserUpdateInput,
      select: this.publicSelect,
    });
  }

  async updateRole(id: number, currentUser: User, role: string) {
    if (currentUser.role !== (UserRole.ADMIN as string)) {
      throw new ForbiddenException('Chỉ Admin mới có thể thay đổi vai trò.');
    }
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException(
        'Vai trò không hợp lệ. Chỉ chấp nhận: admin, editor, user.',
      );
    }
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: this.publicSelect,
    });
  }

  async updateStatus(id: number, currentUser: User, isActive: boolean) {
    if (currentUser.role !== (UserRole.ADMIN as string)) {
      throw new ForbiddenException('Chỉ Admin mới có thể thay đổi trạng thái.');
    }
    if (currentUser.id === id) {
      throw new BadRequestException(
        'Bạn không thể tự vô hiệu hóa tài khoản của chính mình.',
      );
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        is_active: isActive,
      },
      select: this.publicSelect,
    });
  }

  async updatePermissions(
    id: number,
    currentUser: User,
    data: { 
      role?: string; 
      is_active?: boolean; 
      can_comment?: boolean; 
      can_post?: boolean;
      reason?: string; 
    },
  ) {
    if (currentUser.role !== (UserRole.ADMIN as string)) {
      throw new ForbiddenException('Chỉ Admin mới có thể thay đổi quyền hạn.');
    }
    
    if (currentUser.id === id && data.is_active === false) {
      throw new BadRequestException('Bạn không thể tự vô hiệu hóa tài khoản của chính mình.');
    }

    if (data.role && !Object.values(UserRole).includes(data.role as UserRole)) {
      throw new BadRequestException('Vai trò không hợp lệ.');
    }

    const { reason, ...dbData } = data;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dbData.role !== undefined && { role: dbData.role }),
        ...(dbData.is_active !== undefined && { is_active: dbData.is_active }),
        ...(dbData.can_comment !== undefined && { can_comment: dbData.can_comment }),
        ...(dbData.can_post !== undefined && { can_post: dbData.can_post }),
      },
      select: this.publicSelect,
    });

    // --- TRIGGER NOTIFICATIONS ---
    try {
      const reasonText = reason ? ` Lý do: ${reason}` : '';
      
      if (data.is_active === false) {
        await this.notificationsService.create({
          recipient_id: id,
          sender_id: currentUser.id,
          type: 'USER_STATUS_CHANGE',
          title: 'Tài khoản bị khóa',
          content: `Tài khoản của bạn đã bị quản trị viên tạm khóa.${reasonText}`,
        });
      } else if (data.is_active === true) {
        await this.notificationsService.create({
          recipient_id: id,
          sender_id: currentUser.id,
          type: 'USER_STATUS_CHANGE',
          title: 'Tài khoản đã mở',
          content: 'Tài khoản của bạn đã được kích hoạt trở lại.',
        });
      }

      if (data.can_comment === false) {
        await this.notificationsService.create({
          recipient_id: id,
          sender_id: currentUser.id,
          type: 'USER_PERMISSION_CHANGE',
          title: 'Hạn chế bình luận',
          content: `Bạn đã bị quản trị viên chặn quyền bình luận.${reasonText}`,
        });
      } else if (data.can_comment === true) {
        await this.notificationsService.create({
          recipient_id: id,
          sender_id: currentUser.id,
          type: 'USER_PERMISSION_CHANGE',
          title: 'Đã mở khóa bình luận',
          content: 'Bạn đã có thể bình luận trở lại.',
        });
      }

      if (data.can_post === false) {
        await this.notificationsService.create({
          recipient_id: id,
          sender_id: currentUser.id,
          type: 'USER_PERMISSION_CHANGE',
          title: 'Hạn chế đăng bài',
          content: `Bạn đã bị quản trị viên chặn quyền đăng bài viết.${reasonText}`,
        });
      } else if (data.can_post === true) {
        await this.notificationsService.create({
          recipient_id: id,
          sender_id: currentUser.id,
          type: 'USER_PERMISSION_CHANGE',
          title: 'Đã mở khóa đăng bài',
          content: 'Bạn đã có thể đăng bài viết trở lại.',
        });
      }
    } catch (err) {
      console.error('Failed to trigger user notification:', err);
    }

    return updatedUser;
  }

  async resetPassword(id: number, newPassword: string, currentUser: User) {
    if (currentUser.role !== (UserRole.ADMIN as string)) {
      throw new ForbiddenException('Chỉ Admin mới có thể reset mật khẩu.');
    }
    if (!this.validatePassword(newPassword)) {
      throw new BadRequestException(
        'Mật khẩu mới phải tối thiểu 8 ký tự, bao gồm cả chữ và số.',
      );
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id }, data: { password: hash } });
    return { success: true, message: 'Đã đặt lại mật khẩu thành công.' };
  }

  async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
    currentUser: User,
  ) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(
        'Bạn chỉ có thể đổi mật khẩu của chính mình.',
      );
    }
    if (!this.validatePassword(newPassword)) {
      throw new BadRequestException(
        'Mật khẩu mới phải tối thiểu 8 ký tự, bao gồm cả chữ và số.',
      );
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid)
      throw new BadRequestException('Mật khẩu hiện tại không đúng.');

    const hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id }, data: { password: hash } });
    return { success: true, message: 'Đã đổi mật khẩu thành công.' };
  }

  async remove(id: number, currentUser: User) {
    if (currentUser.role !== (UserRole.ADMIN as string)) {
      throw new ForbiddenException('Chỉ Admin mới có thể xóa tài khoản.');
    }
    if (currentUser.id === id) {
      throw new BadRequestException('Bạn không thể tự xóa tài khoản của mình.');
    }
    const adminCount = await this.prisma.user.count({
      where: { role: UserRole.ADMIN },
    });
    const targetUser = await this.prisma.user.findUnique({ where: { id } });

    if (!targetUser) throw new NotFoundException('Người dùng không tồn tại');
    if (
      (targetUser.role as string) === (UserRole.ADMIN as string) &&
      adminCount <= 1
    ) {
      throw new BadRequestException(
        'Không thể xóa admin cuối cùng của hệ thống',
      );
    }

    // Deleted user avatar if exists
    if (targetUser.avatar) {
      await this.fileService.deleteFile(targetUser.avatar);
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
