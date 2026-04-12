import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('q') q: string) {
    return this.postsService.findAll(null, false, q);
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor', 'user')
  findAllAdmin(@Req() req: any) {
    return this.postsService.findAll(req.user, true);
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string, @Query('action') action: string) {
    const isView = action === 'view';
    return this.postsService.findOne(idOrSlug, isView);
  }

  @Get(':id/like-status')
  @UseGuards(AuthGuard('jwt'))
  checkLikeStatus(@Param('id') id: string, @Req() req: any) {
    // Call a new service method or just query directly if we injected Prisma.
    // Let's add checkLikeStatus in service.
    return this.postsService.checkLikeStatus(+id, req.user.id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  toggleLike(@Param('id') id: string, @Req() req: any) {
    return this.postsService.toggleLike(+id, req.user.id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor', 'user')
  create(@Req() req: any, @Body() createPostDto: any) {
    return this.postsService.create(req.user, createPostDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor', 'user')
  update(@Param('id') id: string, @Req() req: any, @Body() updatePostDto: any) {
    return this.postsService.update(+id, req.user, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor', 'user')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.postsService.remove(+id, req.user);
  }

  @Patch(':id/toggle-pin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor', 'user')
  togglePin(@Param('id') id: string, @Req() req: any) {
    return this.postsService.togglePin(+id, req.user);
  }

  @Patch(':id/toggle-publish')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'editor', 'user')
  togglePublish(@Param('id') id: string, @Req() req: any) {
    return this.postsService.togglePublish(+id, req.user);
  }
}
