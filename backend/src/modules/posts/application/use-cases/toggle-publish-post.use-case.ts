import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../../domain/repositories/post.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { PostEntity } from '../../domain/entities/post.entity';

@Injectable()
export class TogglePublishPostUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(id: number, user: User, reason?: string): Promise<PostEntity> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    
    const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN;
    const isOwn = post.author_id === user.id;

    if (isAdmin && !isOwn) {
      if (post.is_blocked) {
        return this.postRepository.update(id, { is_blocked: false, blocked_by_id: null });
      }
      if (post.is_published) {
        return this.postRepository.update(id, { 
          is_published: false, 
          is_blocked: true, 
          blocked_by_id: user.id 
        });
      }
      throw new ForbiddenException('Admin không thể xuất bản bản nháp của người khác.');
    }

    if (isOwn) {
      if (post.is_blocked) {
        throw new ForbiddenException(`Bài viết bị ẩn bởi Admin. Vui lòng liên hệ để được mở khóa.`);
      }
      return this.postRepository.togglePublish(id, reason);
    }

    throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này.');
  }
}
