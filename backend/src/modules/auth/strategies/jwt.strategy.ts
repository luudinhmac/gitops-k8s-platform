import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Use Case for user validation during token check
import { GetUserUseCase } from '../../users/services/get-user.use-case';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private getUserUseCase: GetUserUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: any) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['access_token'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'super_secret_jwt_key_2026',
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.getUserUseCase.execute(Number(payload.id));
      if (!user) {
        this.logger.warn(`Auth failed: User ID ${payload.id} not found`);
        throw new UnauthorizedException('Tài khoản không tồn tại.');
      }
      if (!user.is_active) {
        this.logger.warn(`Auth failed: User ${user.username} is inactive`);
        throw new UnauthorizedException('Tài khoản đã bị khóa.');
      }
      return user;
    } catch (error) {
      this.logger.error(`Auth error for ID ${payload.id}: ${error.message}`);
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    }
  }
}
