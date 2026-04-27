import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User } from '@portfolio/types';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { UpdateUserPermissionsUseCase } from '../../application/use-cases/update-user-permissions.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateUserPermissionsUseCase: UpdateUserPermissionsUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.getUsersUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    return this.createUserUseCase.execute(createUserDto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(+id, req.user, updateUserDto);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateRole(
    @Param('id') id: string,
    @Req() req: any,
    @Body('role') role: string,
  ) {
    return this.updateUserPermissionsUseCase.execute(+id, req.user, { role });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status (active/inactive)' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body('is_active') isActive: boolean,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.socket.remoteAddress as string);
    return this.updateUserPermissionsUseCase.execute(+id, req.user, { is_active: isActive }, Array.isArray(ip) ? ip[0] : ip);
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Update user permissions and status' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updatePermissions(
    @Param('id') id: string,
    @Req() req: any,
    @Body() data: { 
      role?: string; 
      is_active?: boolean; 
      can_comment?: boolean; 
      can_post?: boolean;
      reason?: string; 
    },
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.socket.remoteAddress as string);
    return this.updateUserPermissionsUseCase.execute(+id, req.user, data, Array.isArray(ip) ? ip[0] : ip);
  }

  @Patch(':id/reset-password')
  @ApiOperation({ summary: 'Admin reset user password' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  resetPassword(
    @Param('id') id: string,
    @Req() req: any,
    @Body('password') password: string,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.socket.remoteAddress as string);
    return this.resetPasswordUseCase.execute(+id, password, req.user, Array.isArray(ip) ? ip[0] : ip);
  }

  @Patch(':id/change-password')
  @ApiOperation({ summary: 'User self change password' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  changePassword(
    @Param('id') id: string,
    @Req() req: any,
    @Body() data: any,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.socket.remoteAddress as string);
    return this.changePasswordUseCase.execute(
      +id,
      data.oldPassword,
      data.newPassword,
      req.user,
      Array.isArray(ip) ? ip[0] : ip
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.socket.remoteAddress as string);
    return this.deleteUserUseCase.execute(+id, req.user, Array.isArray(ip) ? ip[0] : ip);
  }
}
