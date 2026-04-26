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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { CreatePostDto, UpdatePostDto, User } from '@portfolio/contracts';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published posts' })
  findAll(
    @Query('q') query?: string,
    @Query('userId') userId?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userIdNum = userId ? parseInt(userId) : undefined;
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.postsService.findAll(undefined, false, query, 'published', sort, userIdNum, pageNum, limitNum);
  }

  @Get('admin')
  @ApiOperation({ summary: 'Admin: Get all posts with full status' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAllAdmin(
    @Req() req: any,
    @Query('q') query?: string,
    @Query('status') status?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.postsService.findAll(req.user, true, query, status, sort, undefined, pageNum, limitNum);
  }

  @Get('my-posts')
  @ApiOperation({ summary: 'User: Get own posts' })
  @UseGuards(AuthGuard('jwt'))
  findMyPosts(
    @Req() req: any,
    @Query('q') query?: string,
    @Query('status') status?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.postsService.findAll(req.user, true, query, status, sort, req.user.id, pageNum, limitNum);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get post by id or slug' })
  findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('action') action?: string,
  ) {
    const incrementView = action === 'view';
    return this.postsService.findOne(idOrSlug, incrementView);
  }

  @Post()
  @ApiOperation({ summary: 'Create new post' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(req.user, createPostDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, req.user, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.postsService.remove(id, req.user, req.ip);
  }

  @Post(':id/pin')
  @ApiOperation({ summary: 'Toggle pin post' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  togglePin(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.postsService.togglePin(id, req.user, req.ip);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Toggle publish status' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  togglePublish(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body('reason') reason?: string,
  ) {
    return this.postsService.togglePublish(id, req.user, req.ip, reason);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Toggle like post' })
  @UseGuards(AuthGuard('jwt'))
  toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.postsService.toggleLike(id, req.user.id);
  }

  @Get(':id/like-status')
  @ApiOperation({ summary: 'Check if user liked post' })
  @UseGuards(AuthGuard('jwt'))
  checkLikeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.postsService.checkLikeStatus(id, req.user.id);
  }
}
