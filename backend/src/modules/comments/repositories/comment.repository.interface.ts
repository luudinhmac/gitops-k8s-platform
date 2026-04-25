import { CommentEntity } from '../domain/comment.entity';
import { CreateCommentDto } from '@portfolio/contracts';

export const I_COMMENTS_REPOSITORY = 'I_COMMENTS_REPOSITORY';

export interface ICommentsRepository {
  findAll(postId: number): Promise<CommentEntity[]>;
  findById(id: number): Promise<CommentEntity | null>;
  create(data: CreateCommentDto & { user_id?: number }): Promise<CommentEntity>;
  update(id: number, content: string): Promise<CommentEntity>;
  delete(id: number): Promise<void>;
  countByPostId(postId: number): Promise<number>;
}
