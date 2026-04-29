import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IUsersRepository, I_USERS_REPOSITORY } from '../../users/domain/user.repository.interface';
import { MonitoringService } from '../../admin-alert/monitoring.service';
import { User } from '@portfolio/contracts';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject(I_USERS_REPOSITORY) private userRepository: IUsersRepository,
    private monitoringService: MonitoringService,
  ) {}

  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_TIME = 10 * 60 * 1000;

  async execute(username: string, pass: string): Promise<Partial<User> | null> {
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
      return user.toJSON() as Partial<User>;
    }

    const currentAttempt = this.loginAttempts.get(username) || { count: 0, lastAttempt: now };
    this.loginAttempts.set(username, { count: currentAttempt.count + 1, lastAttempt: now });

    return null;
  }
}
