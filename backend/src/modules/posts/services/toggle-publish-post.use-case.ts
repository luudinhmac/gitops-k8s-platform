import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../domain/post.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { PostEntity } from '../domain/post.entity';
import { PostNotFoundException, UnauthorizedPostActionException } from '../domain/post.errors';

@Injectable()
export class TogglePublishPostUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(id: number, user: User, reason?: string): Promise<PostEntity> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new PostNotFoundException(id);
    
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
      throw new UnauthorizedPostActionException('publish (admin cannot publish others draft)');
    }

    if (isOwn) {
      if (post.is_blocked) {
        throw new UnauthorizedPostActionException('publish (blocked by admin)');
      }
      return this.postRepository.togglePublish(id, reason);
    }

    throw new UnauthorizedPostActionException('toggle-publish');
  }
}
