import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../../domain/repositories/post.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { IStorageService, STORAGE_SERVICE } from '../../../../infrastructure/storage/storage.interface';
import { AdminAlertService } from '../../../admin-alert/admin-alert.service';

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
    private readonly adminAlertService: AdminAlertService,
  ) {}

  async execute(id: number, user: User, ip?: string): Promise<{ success: boolean }> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN && post.author_id !== user.id) {
      throw new ForbiddenException('Không có quyền xóa bài viết này.');
    }

    if (post.cover_image) await this.storageService.deleteFile(post.cover_image).catch(() => {});
    await this.postRepository.delete(id);

    this.adminAlertService.sendAlert({
      subject: `🗑️ Bài viết bị xóa: ${id}`,
      text: `🗑️ <b>BÀI VIẾT BỊ XÓA</b>\n\n• ID: #${id}\n• User: ${user.username}`,
    });

    return { success: true };
  }
}
