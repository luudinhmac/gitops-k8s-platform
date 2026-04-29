import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { ICommentsRepository, I_COMMENTS_REPOSITORY } from '../domain/comment.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { CommentNotFoundException } from '../domain/comment.errors';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject(I_COMMENTS_REPOSITORY)
    private readonly commentRepository: ICommentsRepository,
  ) {}

  async execute(id: number, user: User): Promise<void> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) throw new CommentNotFoundException(id);

    const isOwner = comment.user_id === user.id;
    const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    await this.commentRepository.delete(id);
  }
}
