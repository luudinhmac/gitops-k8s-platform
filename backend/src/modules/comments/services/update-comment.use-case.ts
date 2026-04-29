import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { ICommentsRepository, I_COMMENTS_REPOSITORY } from '../domain/comment.repository.interface';
import { User } from '@portfolio/types';
import { UpdateCommentDto, Comment } from '@portfolio/contracts';
import { CommentNotFoundException } from '../domain/comment.errors';
import { SettingsService } from '../../settings/settings.service';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject(I_COMMENTS_REPOSITORY)
    private readonly commentRepository: ICommentsRepository,
    private readonly settingsService: SettingsService,
  ) {}

  async execute(id: number, data: UpdateCommentDto, user: User): Promise<Comment> {
    // Maintenance Check
    const settings = await this.settingsService.getPublicSettings();
    const isMaintenance = (settings as any).maintenance_comments === 'true' || (settings as any).maintenance_comments === true;
    const isAdmin = ['admin', 'superadmin'].includes(user?.role || '');

    if (isMaintenance && !isAdmin) {
      throw new ForbiddenException('Tính năng bình luận hiện đang bảo trì. Vui lòng quay lại sau.');
    }

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
