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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest } from './interfaces/user.interface';
import { Request } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto, @Req() req: AuthenticatedRequest) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, req.user, updateUserDto);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateRole(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body('role') role: string,
  ) {
    return this.usersService.updateRole(+id, req.user, role);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status (active/inactive)' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateStatus(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body('is_active') isActive: boolean,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.socket.remoteAddress as string);
    return this.usersService.updateStatus(+id, req.user, isActive, Array.isArray(ip) ? ip[0] : ip);
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Update user permissions and status' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updatePermissions(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() data: { 
      role?: string; 
      is_active?: boolean; 
      can_comment?: boolean; 
      can_post?: boolean;
      reason?: string; 
    },
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.socket.remoteAddress as string);
    return this.usersService.updatePermissions(+id, req.user, data, Array.isArray(ip) ? ip[0] : ip);
  }

  @Patch(':id/reset-password')
  @ApiOperation({ summary: 'Admin reset user password' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  resetPassword(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body('password') password: string,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.socket.remoteAddress as string);
    return this.usersService.resetPassword(+id, password, req.user, Array.isArray(ip) ? ip[0] : ip);
  }

  @Patch(':id/change-password')
  @ApiOperation({ summary: 'User self change password' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  changePassword(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() data: any,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.socket.remoteAddress as string);
    return this.usersService.changePassword(
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
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const ip = req.ip || req.headers['x-forwarded-for'] || (req.socket.remoteAddress as string);
    return this.usersService.remove(+id, req.user, Array.isArray(ip) ? ip[0] : ip);
  }
}
