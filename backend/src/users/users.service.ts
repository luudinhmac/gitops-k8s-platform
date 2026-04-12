import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
    return regex.test(password);
  }

  private readonly publicSelect = {
    id: true, username: true, email: true, fullname: true,
    avatar: true, profession: true, role: true, phone: true,
    birthday: true, address: true, created_at: true, 
    // @ts-ignore
    is_active: true,
  };

  async findAll() {
    return this.prisma.user.findMany({ 
      orderBy: { created_at: 'desc' },
      select: this.publicSelect 
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.publicSelect,
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  async create(data: any, currentUser?: any) {
    // Chỉ admin mới được tạo người dùng
    if (currentUser && currentUser.role !== 'admin') {
      throw new ForbiddenException('Chỉ Admin mới có thể tạo tài khoản mới.');
    }
    if (!this.validatePassword(data.password)) {
      throw new BadRequestException('Mật khẩu phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
    }
    const hash = await bcrypt.hash(data.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          fullname: (data.fullname && data.fullname.trim()) ? data.fullname : data.username,
          password: hash,
          role: data.role || 'user',
          profession: data.profession || 'Người dùng mới',
          // @ts-ignore
          is_active: true,
        },
      });
      // Trả về không có password
      const { password, ...result } = user as any;
      return result;
    } catch (e) {
      if (e.code === 'P2002') {
        throw new BadRequestException('Tên đăng nhập hoặc email đã tồn tại');
      }
      throw e;
    }
  }

  async update(id: number, currentUser: any, data: any) {
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenException('Bạn không có quyền sửa thông tin này.');
    }
    // Chỉ admin mới được thay đổi role hoặc status
    if ((data.role || data.is_active !== undefined) && currentUser.role !== 'admin') {
      throw new ForbiddenException('Bạn không có quyền thay đổi vai trò hoặc trạng thái người dùng.');
    }
    // Không cho phép tự xóa password qua route này
    const { password, ...safeData } = data;
    // Tự động gán fullname = username nếu để trống
    const updateData = { ...safeData };
    if (updateData.fullname !== undefined && (!updateData.fullname || !updateData.fullname.trim())) {
      // Tìm lại username của user nếu không được gửi kèm trong updateData
      const targetUser = await this.prisma.user.findUnique({ where: { id } });
      updateData.fullname = targetUser?.username || 'user';
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: this.publicSelect,
    });
  }

  async updateRole(id: number, currentUser: any, role: string) {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Chỉ Admin mới có thể thay đổi vai trò.');
    }
    if (!['admin', 'editor', 'user'].includes(role)) {
      throw new BadRequestException('Vai trò không hợp lệ. Chỉ chấp nhận: admin, editor, user.');
    }
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: this.publicSelect,
    });
  }

  async updateStatus(id: number, currentUser: any, isActive: boolean) {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Chỉ Admin mới có thể thay đổi trạng thái.');
    }
    if (currentUser.id === id) {
      throw new BadRequestException('Bạn không thể tự vô hiệu hóa tài khoản của chính mình.');
    }
    return this.prisma.user.update({
      where: { id },
      data: { 
        // @ts-ignore
        is_active: isActive 
      },
      select: this.publicSelect,
    });
  }

  async resetPassword(id: number, newPassword: string, currentUser: any) {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Chỉ Admin mới có thể reset mật khẩu.');
    }
    if (!this.validatePassword(newPassword)) {
      throw new BadRequestException('Mật khẩu mới phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id }, data: { password: hash } });
    return { success: true, message: 'Đã đặt lại mật khẩu thành công.' };
  }

  async changePassword(id: number, oldPassword: string, newPassword: string, currentUser: any) {
    if (currentUser.id !== id) {
      throw new ForbiddenException('Bạn chỉ có thể đổi mật khẩu của chính mình.');
    }
    if (!this.validatePassword(newPassword)) {
      throw new BadRequestException('Mật khẩu mới phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) throw new BadRequestException('Mật khẩu hiện tại không đúng.');
    
    const hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id }, data: { password: hash } });
    return { success: true, message: 'Đã đổi mật khẩu thành công.' };
  }

  async remove(id: number, currentUser: any) {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Chỉ Admin mới có thể xóa tài khoản.');
    }
    if (currentUser.id === id) {
      throw new BadRequestException('Bạn không thể tự xóa tài khoản của mình.');
    }
    const adminCount = await this.prisma.user.count({ where: { role: 'admin' } });
    const targetUser = await this.prisma.user.findUnique({ where: { id } });

    if (!targetUser) throw new NotFoundException('Người dùng không tồn tại');
    if (targetUser.role === 'admin' && adminCount <= 1) {
      throw new BadRequestException('Không thể xóa admin cuối cùng của hệ thống');
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
