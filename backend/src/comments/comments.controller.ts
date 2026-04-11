import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: { post_id: number; author_name: string; author_email?: string; content: string }) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('post/:id')
  findByPost(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findByPost(id);
  }
}
