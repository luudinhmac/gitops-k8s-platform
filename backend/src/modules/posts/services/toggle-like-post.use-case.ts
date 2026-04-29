import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../domain/post.repository.interface';

@Injectable()
export class ToggleLikePostUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(id: number, userId: number): Promise<{ liked: boolean }> {
    return this.postRepository.toggleLike(id, userId);
  }
}
