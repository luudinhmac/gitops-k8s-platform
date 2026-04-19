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
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import type { AuthenticatedRequest } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, req.user, updateUserDto);
  }

  @Patch(':id/role')
  @UseGuards(AuthGuard('jwt'))
  updateRole(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { role: string },
  ) {
    return this.usersService.updateRole(+id, req.user, body.role);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  updateStatus(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { is_active: boolean },
  ) {
  }

  @Patch(':id/permissions')
  @UseGuards(AuthGuard('jwt'))
  updatePermissions(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { role?: string; is_active?: boolean; can_comment?: boolean; can_post?: boolean },
  ) {
    return this.usersService.updatePermissions(+id, req.user, body);
  }

  @Patch(':id/reset-password')
  @UseGuards(AuthGuard('jwt'))
  resetPassword(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { newPassword: string },
  ) {
    return this.usersService.resetPassword(+id, body.newPassword, req.user);
  }

  @Patch(':id/change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(
      +id,
      body.oldPassword,
      body.newPassword,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.usersService.remove(+id, req.user);
  }
}
