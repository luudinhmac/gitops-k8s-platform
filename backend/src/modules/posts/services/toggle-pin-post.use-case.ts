import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../domain/post.repository.interface';
import { User, UserRole } from '@portfolio/types';
import { PostEntity } from '../domain/post.entity';
import { PostNotFoundException, UnauthorizedPostActionException } from '../domain/post.errors';

@Injectable()
export class TogglePinPostUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(id: number, user: User): Promise<PostEntity> {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
      throw new UnauthorizedPostActionException('pin');
    }
    const post = await this.postRepository.findById(id);
    if (!post) throw new PostNotFoundException(id);
    
    return this.postRepository.togglePin(id);
  }
}
