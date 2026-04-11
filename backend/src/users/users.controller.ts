import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Req() req: any, @Body() createUserDto: any) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() updateUserDto: any) {
    return this.usersService.update(+id, req.user, updateUserDto);
  }

  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Req() req: any, @Body() body: { role: string }) {
    return this.usersService.updateRole(+id, req.user, body.role);
  }

  @Patch(':id/reset-password')
  resetPassword(@Param('id') id: string, @Req() req: any, @Body() body: { newPassword: string }) {
    return this.usersService.resetPassword(+id, body.newPassword, req.user);
  }

  @Patch(':id/change-password')
  changePassword(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { oldPassword: string; newPassword: string }
  ) {
    return this.usersService.changePassword(+id, body.oldPassword, body.newPassword, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(+id, req.user);
  }
}
