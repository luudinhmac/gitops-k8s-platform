import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
<<<<<<< HEAD
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User } from '@portfolio/contracts';
import { AuthenticatedRequest } from '../users/interfaces/user.interface';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
=======
import { LoginDto, RegisterDto, User } from '@portfolio/contracts';
import { ApiTags } from '@nestjs/swagger';
>>>>>>> feature/arch-refactor

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const validatedUser = (await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    )) as User | null;

    if (!validatedUser) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
    }
    const result = await this.authService.login(validatedUser);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Public hint cookie (non-HttpOnly) to avoid unnecessary 401 fetch in frontend
    res.cookie('logged_in', 'true', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: any) {
    return { success: true, user: req.user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('logged_in');
    return { success: true, message: 'Đã đăng xuất' };
  }
}
