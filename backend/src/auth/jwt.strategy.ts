import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.token || request?.Authorization?.split(' ')[1];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'super_secret_jwt_key_2026',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        avatar: true,
        role: true,
        phone: true,
        profession: true,
        birthday: true,
        address: true,
        // @ts-ignore
        is_active: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }

    if (!(user as any).is_active) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    return user;
  }
}
