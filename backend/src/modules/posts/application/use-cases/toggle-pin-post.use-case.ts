import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../../domain/repositories/post.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { PostEntity } from '../../domain/entities/post.entity';

@Injectable()
export class TogglePinPostUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(id: number, user: User): Promise<PostEntity> {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Chỉ Admin mới có thể ghim bài viết.');
    }
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    
    return this.postRepository.togglePin(id);
  }
}
