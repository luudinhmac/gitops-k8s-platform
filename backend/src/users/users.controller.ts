import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req: any, @Body() createUserDto: any) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Req() req: any, @Body() updateUserDto: any) {
    return this.usersService.update(+id, req.user, updateUserDto);
  }

  @Patch(':id/role')
  @UseGuards(AuthGuard('jwt'))
  updateRole(@Param('id') id: string, @Req() req: any, @Body() body: { role: string }) {
    return this.usersService.updateRole(+id, req.user, body.role);
  }

  @Patch(':id/reset-password')
  @UseGuards(AuthGuard('jwt'))
  resetPassword(@Param('id') id: string, @Req() req: any, @Body() body: { newPassword: string }) {
    return this.usersService.resetPassword(+id, body.newPassword, req.user);
  }

  @Patch(':id/change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { oldPassword: string; newPassword: string }
  ) {
    return this.usersService.changePassword(+id, body.oldPassword, body.newPassword, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(+id, req.user);
  }
}
