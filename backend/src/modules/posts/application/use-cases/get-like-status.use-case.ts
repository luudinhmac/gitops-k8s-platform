import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, I_POST_REPOSITORY } from '../../domain/repositories/post.repository.interface';

@Injectable()
export class GetLikeStatusUseCase {
  constructor(
    @Inject(I_POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: number, userId: number): Promise<{ liked: boolean }> {
    return this.postRepository.checkLikeStatus(postId, userId);
  }
}
