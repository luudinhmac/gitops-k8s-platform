import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/interfaces/user.interface';
import { RegisterDto } from './dto/auth.dto';

interface PrismaError {
  code: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private loginAttempts = new Map<
    string,
    { count: number; lastAttempt: number }
  >();
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_TIME = 10 * 60 * 1000; // 10 minutes lock

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const attempt = this.loginAttempts.get(username);
    const now = Date.now();

    if (attempt && attempt.count >= this.MAX_ATTEMPTS) {
      if (now - attempt.lastAttempt < this.LOCK_TIME) {
        throw new UnauthorizedException(
          `Tài khoản tạm thời bị khóa do nhiều lần đăng nhập thất bại. Vui lòng thử lại sau ${Math.ceil((this.LOCK_TIME - (now - attempt.lastAttempt)) / 60000)} phút.`,
        );
      } else {
        // Reset after lock time
        this.loginAttempts.delete(username);
      }
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: username }],
      },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      if (!user.is_active) {
        throw new UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa.');
      }
      this.loginAttempts.delete(username); // Reset on success
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result as Partial<User>;
    }

    // Record failure
    const currentAttempt = this.loginAttempts.get(username) || {
      count: 0,
      lastAttempt: now,
    };
    this.loginAttempts.set(username, {
      count: currentAttempt.count + 1,
      lastAttempt: now,
    });

    return null;
  }

  async login(user: User) {
    const payload = { id: user.id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
        profession: user.profession,
        birthday: user.birthday,
        address: user.address,
      },
    };
  }

  async register(data: RegisterDto) {
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/.test(data.password)) {
      throw new BadRequestException(
        'Mật khẩu phải tối thiểu 8 ký tự, bao gồm cả chữ và số.',
      );
    }
    const hash = await bcrypt.hash(data.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          fullname: data.fullname || data.username,
          password: hash,
          role: UserRole.USER,
          phone: data.phone || null,
          birthday: data.birthday || null,
          profession: data.profession || 'Người dùng mới',
        },
      });
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
}
