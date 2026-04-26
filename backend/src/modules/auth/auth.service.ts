import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
<<<<<<< HEAD
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '@portfolio/contracts';
import { RegisterDto } from './dto/auth.dto';
import { MonitoringService } from '../../admin-alert/monitoring.service';
import { UsersRepository } from '../users/users.repository';

interface PrismaError {
  code: string;
}
=======
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole, RegisterDto } from '@portfolio/contracts';
import { MonitoringService } from '../admin-alert/monitoring.service';
import { IUsersRepository, I_USERS_REPOSITORY } from '../users/repositories/user.repository.interface';
>>>>>>> feature/arch-refactor

@Injectable()
export class AuthService {
  constructor(
<<<<<<< HEAD
    private userRepository: UsersRepository,
=======
    @Inject(I_USERS_REPOSITORY) private userRepository: IUsersRepository,
>>>>>>> feature/arch-refactor
    private jwtService: JwtService,
    private monitoringService: MonitoringService,
  ) {}

<<<<<<< HEAD
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
=======
  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_TIME = 10 * 60 * 1000;

  async validateUser(username: string, pass: string): Promise<Partial<User> | null> {
>>>>>>> feature/arch-refactor
    this.monitoringService.trackLoginAttempt();
    const attempt = this.loginAttempts.get(username);
    const now = Date.now();

    if (attempt && attempt.count >= this.MAX_ATTEMPTS) {
      if (now - attempt.lastAttempt < this.LOCK_TIME) {
<<<<<<< HEAD
        throw new UnauthorizedException(
          `Tài khoản tạm thời bị khóa do nhiều lần đăng nhập thất bại. Vui lòng thử lại sau ${Math.ceil((this.LOCK_TIME - (now - attempt.lastAttempt)) / 60000)} phút.`,
        );
=======
        throw new UnauthorizedException(`Tài khoản tạm thời bị khóa. Thử lại sau ${Math.ceil((this.LOCK_TIME - (now - attempt.lastAttempt)) / 60000)} phút.`);
>>>>>>> feature/arch-refactor
      } else {
        this.loginAttempts.delete(username);
      }
    }

<<<<<<< HEAD
    const user = await this.userRepository.findMany({
      where: {
        OR: [{ username: username }, { email: username }],
      },
      take: 1
    });

    const foundUser = user[0];

    if (foundUser && (await bcrypt.compare(pass, foundUser.password as string))) {
      if (!foundUser.is_active) {
        throw new UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa.');
      }
      this.loginAttempts.delete(username);
      const { password: _, ...result } = foundUser;
      return result as Partial<User>;
    }

    const currentAttempt = this.loginAttempts.get(username) || {
      count: 0,
      lastAttempt: now,
    };
    this.loginAttempts.set(username, {
      count: currentAttempt.count + 1,
      lastAttempt: now,
    });
=======
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
>>>>>>> feature/arch-refactor

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
<<<<<<< HEAD
      throw new BadRequestException(
        'Mật khẩu phải tối thiểu 8 ký tự, bao gồm cả chữ và số.',
      );
=======
      throw new BadRequestException('Mật khẩu phải tối thiểu 8 ký tự, bao gồm cả chữ và số.');
>>>>>>> feature/arch-refactor
    }
    const hash = await bcrypt.hash(data.password, 10);
    try {
      const user = await this.userRepository.create({
<<<<<<< HEAD
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
=======
        ...data,
        fullname: data.fullname || data.username,
        password: hash,
        role: UserRole.USER,
        profession: data.profession || 'Người dùng mới',
        is_active: true,
>>>>>>> feature/arch-refactor
      });
      const { password: _, ...result } = user as any;
      return result;
    } catch (e) {
<<<<<<< HEAD
      const err = e as PrismaError;
      if (err.code === 'P2002') {
=======
      if (e.message === 'User already exists') {
>>>>>>> feature/arch-refactor
        throw new BadRequestException('Tên đăng nhập hoặc email đã tồn tại');
      }
      throw e;
    }
  }
}
