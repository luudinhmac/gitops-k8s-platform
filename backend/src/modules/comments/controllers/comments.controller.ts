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
import { CreateCommentDto, UpdateCommentDto } from '@portfolio/contracts';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { GetCommentsByPostUseCase } from '../services/get-comments-by-post.use-case';
import { CreateCommentUseCase } from '../services/create-comment.use-case';
import { UpdateCommentUseCase } from '../services/update-comment.use-case';
import { DeleteCommentUseCase } from '../services/delete-comment.use-case';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';

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
  @UseGuards(OptionalJwtAuthGuard)
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    return this.createCommentUseCase.execute(createCommentDto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update comment' })
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() req: any) {
    return this.deleteCommentUseCase.execute(+id, req.user);
  }
}
