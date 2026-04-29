import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../domain/post.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { MediaManagerService } from '../../upload/media-manager.service';
import { AdminAlertService } from '../../admin-alert/admin-alert.service';
import { PostNotFoundException, UnauthorizedPostActionException } from '../domain/post.errors';

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    private readonly mediaManager: MediaManagerService,
    private readonly adminAlertService: AdminAlertService,
  ) {}

  async execute(id: number, user: User, ip?: string): Promise<{ success: boolean }> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new PostNotFoundException(id);
    
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN && post.author_id !== user.id) {
      throw new UnauthorizedPostActionException('delete');
    }

    // Unregister all media usages for this post
    await this.mediaManager.unregisterAllForEntity('POST', id);
    
    await this.postRepository.delete(id);

    this.adminAlertService.sendAlert({
      subject: `🗑️ Bài viết bị xóa: ${id}`,
      text: `🗑️ <b>BÀI VIẾT BỊ XÓA</b>\n\n• ID: #${id}\n• User: ${user.username}`,
    });

    return { success: true };
  }
}

