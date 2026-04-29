import { Inject, Injectable } from '@nestjs/common';
import { ICommentsRepository, I_COMMENTS_REPOSITORY } from '../domain/comment.repository.interface';
import { Comment } from '@portfolio/contracts';

@Injectable()
export class GetCommentsByPostUseCase {
  constructor(
    @Inject(I_COMMENTS_REPOSITORY)
    private readonly commentRepository: ICommentsRepository,
  ) {}

  async execute(postId: number): Promise<Comment[]> {
    const comments = await this.commentRepository.findAll(postId);
    
    // Build tree
    const map = new Map<number, any>();
    const roots: any[] = [];

    comments.forEach(c => map.set(c.id, { ...c, Replies: [] }));
    comments.forEach(c => {
      const node = map.get(c.id);
      if (!node) return;
      if (c.parent_id) {
        const parent = map.get(c.parent_id);
        if (parent) parent.Replies.push(node);
        else roots.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots as unknown as Comment[];
  }
}
