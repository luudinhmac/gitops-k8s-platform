import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    // If user is logged in (via some check or optional guard), we could set user_id here.
    // However, for simplicity, we'll let the frontend send user_id if they are logged in.
    return this.commentsService.create(createCommentDto);
  }

  @Get('post/:id')
  findByPost(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findByPost(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentsService.update(id, content, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentsService.remove(id, req.user);
  }
}
