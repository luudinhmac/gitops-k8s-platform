import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminAlertModule } from '../admin-alert/admin-alert.module';
import { UsersModule } from '../users/users.module';

// Use Cases
import { LoginUseCase } from './services/login.use-case';
import { RegisterUseCase } from './services/register.use-case';
import { ValidateUserUseCase } from './services/validate-user.use-case';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          'super_secret_jwt_key_2026',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    AdminAlertModule,
    UsersModule,
  ],
  providers: [
    JwtStrategy,
    LoginUseCase,
    RegisterUseCase,
    ValidateUserUseCase,
  ],
  controllers: [AuthController],
  exports: [LoginUseCase, RegisterUseCase, ValidateUserUseCase],
})
export class AuthModule {}
