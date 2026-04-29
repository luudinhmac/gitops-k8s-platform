import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '@portfolio/contracts';

// Use Cases
import { LoginUseCase } from '../services/login.use-case';
import { RegisterUseCase } from '../services/register.use-case';
import { ValidateUserUseCase } from '../services/validate-user.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and return JWT token' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: any) {
    const user = await this.validateUserUseCase.execute(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng.');
    }

    const result = await this.loginUseCase.execute(user as any);
    
    // Set JWT in HttpOnly cookie
    res.cookie('access_token', result.token, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Set cookie hint for frontend AuthContext
    res.cookie('logged_in', 'true', {
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: false,
      sameSite: 'lax',
    });

    return result;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.registerUseCase.execute(registerDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: any) {
    return {
      success: true,
      user: req.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and clear cookies' })
  async logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie('access_token');
    res.clearCookie('logged_in');
    return { success: true, message: 'Đăng xuất thành công' };
  }
}
