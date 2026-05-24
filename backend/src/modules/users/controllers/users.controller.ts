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
  Header,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User } from '@portfolio/contracts';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { Permissions } from '../../auth/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { getClientIp } from '../../../common/utils/ip';

// Use Cases
import { GetUsersUseCase } from '../services/get-users.use-case';
import { GetUserUseCase } from '../services/get-user.use-case';
import { CreateUserUseCase } from '../services/create-user.use-case';
import { UpdateUserUseCase } from '../services/update-user.use-case';
import { UpdateUserPermissionsUseCase } from '../services/update-user-permissions.use-case';
import { ResetPasswordUseCase } from '../services/reset-password.use-case';
import { ChangePasswordUseCase } from '../services/change-password.use-case';
import { DeleteUserUseCase } from '../services/delete-user.use-case';

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
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('users:manage')
  @ApiBearerAuth()
  @Header('Cache-Control', 'no-transform')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  findAll(@Req() req: any) {
    return this.getUsersUseCase.execute(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Header('Cache-Control', 'no-transform')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: User })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.getUserUseCase.execute(+id, req.user);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('users:manage')
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    return this.createUserUseCase.execute(createUserDto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Header('Cache-Control', 'no-transform')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(+id, req.user, updateUserDto);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role' })
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('users:manage')
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
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('users:manage')
  @ApiBearerAuth()
  updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body('is_active') isActive: boolean,
  ) {
    const ip = getClientIp(req);
    return this.updateUserPermissionsUseCase.execute(+id, req.user, { is_active: isActive }, ip);
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Update user permissions and status' })
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('users:manage')
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
    const ip = getClientIp(req);
    return this.updateUserPermissionsUseCase.execute(+id, req.user, data, ip);
  }

  @Patch(':id/reset-password')
  @ApiOperation({ summary: 'Admin reset user password' })
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('users:manage')
  @ApiBearerAuth()
  resetPassword(
    @Param('id') id: string,
    @Req() req: any,
    @Body('password') password: string,
  ) {
    const ip = getClientIp(req);
    return this.resetPasswordUseCase.execute(+id, password, req.user, ip);
  }

  @Patch(':id/change-password')
  @ApiOperation({ summary: 'User self change password' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  changePassword(
    @Param('id') id: string,
    @Req() req: any,
    @Body() data: any,
  ) {
    const ip = getClientIp(req);
    return this.changePasswordUseCase.execute(
      +id,
      data.oldPassword,
      data.newPassword,
      req.user,
      ip
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('users:manage')
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() req: any) {
    const ip = getClientIp(req);
    return this.deleteUserUseCase.execute(+id, req.user, ip);
  }
}
