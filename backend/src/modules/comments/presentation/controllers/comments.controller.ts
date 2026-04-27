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
} from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from '@portfolio/types';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { GetCommentsByPostUseCase } from '../../application/use-cases/get-comments-by-post.use-case';
import { CreateCommentUseCase } from '../../application/use-cases/create-comment.use-case';
import { UpdateCommentUseCase } from '../../application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from '../../application/use-cases/delete-comment.use-case';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly getCommentsByPostUseCase: GetCommentsByPostUseCase,
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get comments by post' })
  findByPost(@Query('post_id') postId: string) {
    return this.getCommentsByPostUseCase.execute(+postId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new comment' })
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    // Optional auth: req.user might be null
    return this.createCommentUseCase.execute(createCommentDto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update comment' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: any,
  ) {
    return this.updateCommentUseCase.execute(+id, updateCommentDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() req: any) {
    return this.deleteCommentUseCase.execute(+id, req.user);
  }
}
