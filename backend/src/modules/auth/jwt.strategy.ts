import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '@portfolio/contracts';

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
    private prisma: PrismaService,
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
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result as unknown as User;
  }
}
