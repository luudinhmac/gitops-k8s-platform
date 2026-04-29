import { CommentEntity } from './comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '@portfolio/contracts';

export const I_COMMENTS_REPOSITORY = 'I_COMMENTS_REPOSITORY';

export interface ICommentsRepository {
  findAll(postId: number): Promise<CommentEntity[]>;
  findById(id: number): Promise<CommentEntity | null>;
  create(data: CreateCommentDto): Promise<CommentEntity>;
  update(id: number, data: UpdateCommentDto): Promise<CommentEntity>;
  delete(id: number): Promise<void>;
  count(where?: any): Promise<number>;
}
