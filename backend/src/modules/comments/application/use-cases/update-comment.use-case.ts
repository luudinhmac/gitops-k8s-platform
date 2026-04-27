import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ICommentsRepository, I_COMMENTS_REPOSITORY } from '../../domain/repositories/comment.repository.interface';
import { User, Comment, UpdateCommentDto } from '@portfolio/types';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject(I_COMMENTS_REPOSITORY)
    private readonly commentRepository: ICommentsRepository,
  ) {}

  async execute(id: number, data: UpdateCommentDto, user: User): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    
    if (comment.user_id !== user.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }
    
    if (!user.can_comment) {
      throw new ForbiddenException('Tài khoản của bạn đã bị cấm bình luận.');
    }

    return this.commentRepository.update(id, data);
  }
}
