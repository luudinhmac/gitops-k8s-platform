import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { ICommentsRepository, I_COMMENTS_REPOSITORY } from '../domain/comment.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { CommentNotFoundException } from '../domain/comment.errors';
import { SettingsService } from '../../settings/settings.service';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject(I_COMMENTS_REPOSITORY)
    private readonly commentRepository: ICommentsRepository,
    private readonly settingsService: SettingsService,
  ) {}

  async execute(id: number, user: User): Promise<void> {
    // Maintenance Check
    const settings = await this.settingsService.getPublicSettings();
    const isMaintenance = (settings as any).maintenance_comments === 'true' || (settings as any).maintenance_comments === true;
    const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN;

    if (isMaintenance && !isAdmin) {
      throw new ForbiddenException('Tính năng bình luận hiện đang bảo trì. Vui lòng quay lại sau.');
    }

    const comment = await this.commentRepository.findById(id);
    if (!comment) throw new CommentNotFoundException(id);

    const isOwner = comment.user_id === user.id;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    await this.commentRepository.delete(id);
  }
}
