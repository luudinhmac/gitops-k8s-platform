import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@portfolio/types';
import { GetUserUseCase } from '../users/application/use-cases/get-user.use-case';

interface JwtPayload {
  id: number;
  username: string;
  role: string;
}

interface RequestWithCookies {
  cookies?: {
    token?: string;
  };
  headers?: {
    authorization?: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly getUserUseCase: GetUserUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithCookies) => {
          return (
            request?.cookies?.token ||
            request?.headers?.authorization?.split(' ')[1] ||
            null
          );
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: (() => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error(
            'JWT_SECRET must be defined in the environment variables',
          );
        }
        return secret;
      })(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    try {
      const user = await this.getUserUseCase.execute(payload.id);

      if (!user.is_active) {
        throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
      }
      
      const { password, ...result } = user as any;
      return result as User;
    } catch (error) {
      throw new UnauthorizedException('Không tìm thấy người dùng hoặc lỗi xác thực');
    }
  }
}
