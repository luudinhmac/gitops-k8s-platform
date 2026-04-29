import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { ICommentsRepository, I_COMMENTS_REPOSITORY } from '../domain/comment.repository.interface';
import { User } from '@portfolio/types';
import { UpdateCommentDto, Comment } from '@portfolio/contracts';
import { CommentNotFoundException } from '../domain/comment.errors';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject(I_COMMENTS_REPOSITORY)
    private readonly commentRepository: ICommentsRepository,
  ) {}

  async execute(id: number, data: UpdateCommentDto, user: User): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) throw new CommentNotFoundException(id);
    
    if (comment.user_id !== user.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }
    
    if (!user.can_comment) {
      throw new ForbiddenException('Tài khoản của bạn đã bị cấm bình luận.');
    }

    const updated = await this.commentRepository.update(id, data);
    return updated as unknown as Comment;
  }
}
