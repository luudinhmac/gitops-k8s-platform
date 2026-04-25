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
import { AuthenticatedRequest } from '../users/interfaces/user.interface';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
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
    return this.postsService.findAll(undefined, false, query, undefined, sort, userIdNum, pageNum, limitNum);
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAllAdmin(
    @Req() req: AuthenticatedRequest,
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
  @UseGuards(AuthGuard('jwt'))
  findMyPosts(
    @Req() req: AuthenticatedRequest,
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

  @Get(':idOrSlug')
  findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('action') action?: string,
  ) {
    const incrementView = action === 'view';
    return this.postsService.findOne(idOrSlug, incrementView);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(req.user, createPostDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, req.user, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postsService.remove(id, req.user, req.ip);
  }

  @Post(':id/pin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  togglePin(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postsService.togglePin(id, req.user, req.ip);
  }

  @Post(':id/publish')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  togglePublish(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Body('reason') reason?: string,
  ) {
    return this.postsService.togglePublish(id, req.user, req.ip, reason);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postsService.toggleLike(id, req.user.id);
  }

  @Get(':id/like-status')
  @UseGuards(AuthGuard('jwt'))
  checkLikeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postsService.checkLikeStatus(id, req.user.id);
  }
}
