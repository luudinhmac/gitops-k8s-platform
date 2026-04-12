import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username },
        ],
      },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async register(data: any) {
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/.test(data.password)) {
      throw new BadRequestException('Mật khẩu phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
    }
    const hash = await bcrypt.hash(data.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          fullname: data.fullname || data.username,
          password: hash,
          role: 'editor',
          profession: 'Người dùng mới',
        },
      });
      const { password, ...result } = user;
      return result;
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new BadRequestException('Tên đăng nhập hoặc email đã tồn tại');
      }
      throw e;
    }
  }
}
