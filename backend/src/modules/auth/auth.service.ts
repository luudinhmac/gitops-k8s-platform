import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole, RegisterDto } from '@portfolio/contracts';
import { MonitoringService } from '../admin-alert/monitoring.service';
import { IUsersRepository, I_USERS_REPOSITORY } from '../users/repositories/user.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(I_USERS_REPOSITORY) private userRepository: IUsersRepository,
    private jwtService: JwtService,
    private monitoringService: MonitoringService,
  ) {}

  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_TIME = 10 * 60 * 1000;

  async validateUser(username: string, pass: string): Promise<Partial<User> | null> {
    this.monitoringService.trackLoginAttempt();
    const attempt = this.loginAttempts.get(username);
    const now = Date.now();

    if (attempt && attempt.count >= this.MAX_ATTEMPTS) {
      if (now - attempt.lastAttempt < this.LOCK_TIME) {
        throw new UnauthorizedException(`Tài khoản tạm thời bị khóa. Thử lại sau ${Math.ceil((this.LOCK_TIME - (now - attempt.lastAttempt)) / 60000)} phút.`);
      } else {
        this.loginAttempts.delete(username);
      }
    }

    const user = await this.userRepository.findByUsername(username) || await this.userRepository.findByEmail(username);

    if (user && (await bcrypt.compare(pass, user.password as string))) {
      if (!user.is_active) {
        throw new UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa.');
      }
      this.loginAttempts.delete(username);
      const { password: _, ...result } = user;
      return result as Partial<User>;
    }

    const currentAttempt = this.loginAttempts.get(username) || { count: 0, lastAttempt: now };
    this.loginAttempts.set(username, { count: currentAttempt.count + 1, lastAttempt: now });

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
      throw new BadRequestException('Mật khẩu phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
    }
    const hash = await bcrypt.hash(data.password, 10);
    try {
      // Check if email already exists manually since DB permissions might prevent unique constraint
      if (data.email) {
        const existingEmail = await this.userRepository.findByEmail(data.email);
        if (existingEmail) {
          throw new BadRequestException('Email này đã được sử dụng bởi một tài khoản khác.');
        }
      }

      // Check if username already exists
      const existingUser = await this.userRepository.findByUsername(data.username);
      if (existingUser) {
        throw new BadRequestException('Tên đăng nhập đã tồn tại.');
      }

      // Destructure to remove confirmPassword and other possible DTO-only fields
      const { confirmPassword, ...registerData } = data as any;
      
      const user = await this.userRepository.create({
        ...registerData,
        fullname: data.fullname || data.username,
        password: hash,
        role: UserRole.USER,
        profession: data.profession || 'Người dùng mới',
        is_active: true,
      });
      const { password: _, ...result } = user as any;
      return result;
    } catch (e) {
      if (e.message === 'User already exists') {
        throw new BadRequestException('Tên đăng nhập hoặc email đã tồn tại');
      }
      throw e;
    }
  }
}
